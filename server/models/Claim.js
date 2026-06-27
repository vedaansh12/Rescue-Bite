const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const claimSchema = new mongoose.Schema({
  pack: { type: mongoose.Schema.Types.ObjectId, ref: 'Pack', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, default: () => uuidv4(), unique: true },
  qrCodeData: String, // will be set to claimId + token
  claimedAt: { type: Date, default: Date.now },
  collected: { type: Boolean, default: false },
  expiry: { type: Date, required: true } // copy of pack.availableUntil
}, { timestamps: true });

claimSchema.pre('save', function (next) {
  if (!this.qrCodeData) {
    this.qrCodeData = `${this._id}:${this.token}`;
  }
  next();
});

module.exports = mongoose.model('Claim', claimSchema);