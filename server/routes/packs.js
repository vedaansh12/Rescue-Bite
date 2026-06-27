const express = require('express');
const { protect, vendorOnly } = require('../middleware/auth');
const { validateCreatePack } = require('../middleware/validate');
const Pack = require('../models/Pack');
const Canteen = require('../models/Canteen');
const router = express.Router();

// Create pack (vendor) – with validation
router.post('/', protect, vendorOnly, validateCreatePack, async (req, res) => {
  try {
    const canteen = await Canteen.findOne({ owner: req.user._id });
    if (!canteen) return res.status(400).json({ message: 'Create a canteen first' });

    const { description, originalPrice, quantity, availableUntil } = req.body;
    const discountedPrice = Math.round(originalPrice * 0.4);

    const pack = await Pack.create({
      canteen: canteen._id,
      description,
      originalPrice,
      discountedPrice,
      quantity,
      availableUntil: availableUntil ? new Date(availableUntil) : new Date(Date.now() + 15 * 60000),
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`campus_${req.user.campusId}`).emit('pack:new', pack);
    }

    res.status(201).json(pack);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update pack (vendor only, must own canteen)
router.put('/:id', protect, vendorOnly, async (req, res) => {
  try {
    const pack = await Pack.findById(req.params.id).populate('canteen');
    if (!pack) return res.status(404).json({ message: 'Pack not found' });

    if (pack.canteen.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this pack' });
    }

    const { description, originalPrice, quantity, availableUntil } = req.body;
    if (description !== undefined) pack.description = description;
    if (originalPrice !== undefined) {
      pack.originalPrice = originalPrice;
      pack.discountedPrice = Math.round(originalPrice * 0.4);
    }
    if (quantity !== undefined) pack.quantity = quantity;
    if (availableUntil !== undefined) pack.availableUntil = new Date(availableUntil);

    await pack.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`campus_${req.user.campusId}`).emit('pack:updated', pack);
    }

    res.json(pack);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a pack (vendor only)
router.delete('/:id', protect, vendorOnly, async (req, res) => {
  try {
    const pack = await Pack.findById(req.params.id).populate('canteen');
    if (!pack) return res.status(404).json({ message: 'Pack not found' });

    if (pack.canteen.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this pack' });
    }

    await Pack.findByIdAndDelete(req.params.id);

    const io = req.app.get('io');
    if (io) {
      io.to(`campus_${req.user.campusId}`).emit('pack:updated', { deleted: pack._id });
    }

    res.json({ message: 'Pack deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single pack by ID (any authenticated user)
router.get('/:id', protect, async (req, res) => {
  try {
    const pack = await Pack.findById(req.params.id).populate('canteen', 'name address location');
    if (!pack) return res.status(404).json({ message: 'Pack not found' });
    res.json(pack);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get nearby packs (customer)
router.get('/nearby', protect, async (req, res) => {
  try {
    const { lat, lng, radius = 1000 } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: 'Latitude and longitude required' });

    const canteens = await Canteen.find({
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius)
        }
      }
    });
    const canteenIds = canteens.map(c => c._id);

    const now = new Date();
    const packs = await Pack.find({
      canteen: { $in: canteenIds },
      status: 'available',
      availableUntil: { $gt: now },
      quantity: { $gt: 0 }
    }).populate('canteen', 'name address location').sort({ availableUntil: 1 });

    res.json(packs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get vendor's own packs
router.get('/mine', protect, vendorOnly, async (req, res) => {
  try {
    const canteen = await Canteen.findOne({ owner: req.user._id });
    if (!canteen) return res.json([]);
    const packs = await Pack.find({ canteen: canteen._id }).sort({ createdAt: -1 });
    res.json(packs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;