const express = require('express');
const { protect, vendorOnly } = require('../middleware/auth');
const Canteen = require('../models/Canteen');
const router = express.Router();

router.post('/', protect, vendorOnly, async (req, res) => {
  try {
    const { name, location, address } = req.body;
    const canteen = await Canteen.create({
      owner: req.user._id,
      name,
      location: { type: 'Point', coordinates: location.coordinates },
      address
    });
    res.status(201).json(canteen);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/mine', protect, vendorOnly, async (req, res) => {
  const canteens = await Canteen.find({ owner: req.user._id });
  res.json(canteens);
});

module.exports = router;