import { X, QrCode, IndianRupee, Clock } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

export default function PackPreviewModal({ pack, onClose, onClaim }) {
  if (!pack) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Glass card */}
      <div className="glass-card w-full max-w-md p-6 relative animate-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image (if any) */}
        {pack.image && (
          <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
            <img src={pack.image} alt={pack.description} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Details */}
        <h3 className="text-2xl font-bold mb-2">{pack.description}</h3>
        <p className="text-gray-400 mb-1">from {pack.canteen?.name}</p>
        <p className="text-sm text-gray-500">{pack.canteen?.address}</p>

        <div className="flex items-baseline gap-2 mt-4">
          <span className="line-through text-gray-500 text-lg">₹{pack.originalPrice}</span>
          <span className="text-3xl font-bold text-green-400">₹{pack.discountedPrice}</span>
          <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">60% off</span>
        </div>

        <div className="flex items-center gap-2 mt-2 text-gray-300">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Pickup by: <CountdownTimer expiry={pack.availableUntil} /></span>
        </div>

        <p className="mt-2 text-sm text-gray-400">
          Quantity available: <span className="text-white font-semibold">{pack.quantity}</span>
        </p>

        {/* Claim button */}
        <button
          onClick={() => onClaim(pack._id)}
          className="mt-6 w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-green-900/30"
        >
          <QrCode className="w-5 h-5" /> Claim This Pack
        </button>
      </div>
    </div>
  );
}