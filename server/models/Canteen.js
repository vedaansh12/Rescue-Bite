const mongoose = require('mongoose');

const canteenSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  address: String
}, { timestamps: true });

canteenSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Canteen', canteenSchema);