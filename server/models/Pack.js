const mongoose = require('mongoose');

const packSchema = new mongoose.Schema({
  canteen: { type: mongoose.Schema.Types.ObjectId, ref: 'Canteen', required: true },
  description: String,
  originalPrice: Number,
  discountedPrice: Number,
  quantity: { type: Number, default: 1 },
  image: { type: String, default: '' },   // <-- must be present
  availableUntil: { type: Date, required: true },
  status: {
    type: String,
    enum: ['available', 'claimed', 'expired', 'collected'],
    default: 'available'
  }
}, { timestamps: true });

// Auto-expire function
async function autoExpirePacks() {
  const now = new Date();
  const result = await this.updateMany(
    { status: 'available', availableUntil: { $lt: now } },
    { $set: { status: 'expired' } }
  );
  if (result.modifiedCount > 0) {
    // Emit socket event for each expired pack? We'll handle in the socket setup via change streams or just query.
    // For simplicity, we'll emit from the autoExpire function in server.js using the io instance.
  }
  return result;
}

packSchema.statics.autoExpirePacks = autoExpirePacks;

module.exports = mongoose.model('Pack', packSchema);