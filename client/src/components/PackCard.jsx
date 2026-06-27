import CountdownTimer from './CountdownTimer';

export default function PackCard({ pack, onClaim }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{pack.canteen?.name}</h3>
          <p className="text-gray-600">{pack.description}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="line-through text-gray-400">₹{pack.originalPrice}</span>
            <span className="text-green-600 font-bold text-xl">₹{pack.discountedPrice}</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">60% off</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500">Qty: {pack.quantity}</span>
          <CountdownTimer expiry={pack.availableUntil} />
        </div>
      </div>
      <button
        onClick={() => onClaim(pack._id)}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 transition"
      >
        Claim this pack
      </button>
    </div>
  );
}