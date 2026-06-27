const express = require('express');
const { protect, vendorOnly } = require('../middleware/auth');
const Claim = require('../models/Claim');
const Pack = require('../models/Pack');
const Canteen = require('../models/Canteen');
const router = express.Router();

// Customer claims a pack
router.post('/:packId/claim', protect, async (req, res) => {
  try {
    // Check if user already has an active claim
    const activeClaim = await Claim.findOne({ customer: req.user._id, collected: false, expiry: { $gt: new Date() } });
    if (activeClaim) return res.status(400).json({ message: 'You already have an active claim. Collect or let it expire first.' });

    const pack = await Pack.findById(req.params.packId);
    if (!pack || pack.status !== 'available' || pack.availableUntil < new Date() || pack.quantity <= 0) {
      return res.status(400).json({ message: 'Pack not available' });
    }

    // Geofence check (user must be within 1km of canteen)
    const canteen = await Canteen.findById(pack.canteen);
    const { lat, lng } = req.body; // user's current location
    if (!lat || !lng) return res.status(400).json({ message: 'Current location required' });

    const distance = getDistanceFromLatLonInM(lat, lng, canteen.location.coordinates[1], canteen.location.coordinates[0]);
    if (distance > 1000) return res.status(400).json({ message: 'You are too far from the canteen' });

    // Create claim
    pack.quantity -= 1;
    if (pack.quantity <= 0) pack.status = 'claimed';
    await pack.save();

    const claim = await Claim.create({
      pack: pack._id,
      customer: req.user._id,
      expiry: pack.availableUntil
    });

    // Emit event
    const io = req.app.get('io');
    io.to(`campus_${req.user.campusId}`).emit('pack:updated', pack);
    io.to(`campus_${req.user.campusId}`).emit('claim:collected', { packId: pack._id });

    res.status(201).json(claim);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get customer's active claim
router.get('/active', protect, async (req, res) => {
  const claim = await Claim.findOne({ customer: req.user._id, collected: false, expiry: { $gt: new Date() } })
    .populate('pack');
  res.json(claim || null);
});

// Vendor marks claim as collected (by scanning token or manual entry)
router.post('/:id/collect', protect, vendorOnly, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    if (claim.collected) return res.status(400).json({ message: 'Already collected' });

    // Verify that the vendor owns the canteen where the pack was posted
    const pack = await Pack.findById(claim.pack).populate('canteen');
    if (pack.canteen.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your canteen' });
    }

    claim.collected = true;
    await claim.save();

    const io = req.app.get('io');
    io.to(`campus_${req.user.campusId}`).emit('claim:collected', { packId: pack._id });

    res.json({ message: 'Marked as collected' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Vendor verifies token (QR scan)
router.post('/verify-token', protect, vendorOnly, async (req, res) => {
  const { token } = req.body; // raw QR data "claimId:token"
  const [claimId, claimToken] = token.split(':');
  const claim = await Claim.findById(claimId);
  if (!claim || claim.token !== claimToken) return res.status(400).json({ message: 'Invalid token' });
  res.json(claim._id); // send claimId to proceed with collection
});

function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
function deg2rad(deg) { return deg * (Math.PI/180); }

module.exports = router;