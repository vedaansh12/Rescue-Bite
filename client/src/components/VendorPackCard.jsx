import CountdownTimer from './CountdownTimer';

export default function VendorPackCard({ pack, onRefresh }) {
  const statusColor = {
    available: 'bg-green-100 text-green-700',
    claimed: 'bg-yellow-100 text-yellow-700',
    expired: 'bg-red-100 text-red-700',
    collected: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex gap-4">
      {pack.image && (
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
          <img src={pack.image} alt={pack.description} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1">
        <div className="flex justify-between">
          <div>
            <h4 className="font-semibold">{pack.description}</h4>
            <p>₹{pack.discountedPrice} <span className="text-sm line-through text-gray-400">₹{pack.originalPrice}</span></p>
            <p>Qty: {pack.quantity}</p>
          </div>
          <div className="text-right">
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColor[pack.status]}`}>
              {pack.status}
            </span>
            {pack.status === 'available' && <CountdownTimer expiry={pack.availableUntil} />}
          </div>
        </div>
      </div>
    </div>
  );
}