import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function MapView({ packs, coords }) {
  if (!coords) return <div className="text-gray-400 p-4">Waiting for location...</div>;

  // Group packs by canteen
  const canteenMap = new Map();
  packs.forEach(p => {
    const cId = p.canteen._id;
    if (!canteenMap.has(cId)) {
      canteenMap.set(cId, { ...p.canteen, count: 0 });
    }
    canteenMap.get(cId).count++;
  });
  const uniqueCanteens = Array.from(canteenMap.values());

  return (
    <MapContainer center={[coords.lat, coords.lng]} zoom={15} className="h-80 w-full rounded-lg z-0">
      {/* Dark theme tiles (free, no key) */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <ChangeView center={[coords.lat, coords.lng]} />
      {uniqueCanteens.map(c => (
        <Marker
          key={c._id}
          position={[c.location.coordinates[1], c.location.coordinates[0]]}
        >
          <Popup>
            <strong>{c.name}</strong><br />
            Available packs: {c.count}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}