import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../services/api';
import { ArrowLeft, Store, MapPin, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to handle map clicks
function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

export default function CreateCanteenPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    coordinates: null, // { lat, lng }
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([28.7041, 77.1025]); // default Delhi
  const [marker, setMarker] = useState(null); // [lat, lng]
  const [addressLoading, setAddressLoading] = useState(false);

  // Free geocoding using Nominatim
  const lookupAddress = async () => {
    if (!form.address.trim()) return alert('Enter an address first');
    setAddressLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.address)}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setForm({ ...form, coordinates: { lat, lng } });
        setMapCenter([lat, lng]);
        setMarker([lat, lng]);
      } else {
        alert('Address not found. Try a more specific search.');
      }
    } catch (err) {
      alert('Geocoding failed. Check your internet connection.');
    }
    setAddressLoading(false);
  };

  const handleMapClick = useCallback((latlng) => {
    const lat = latlng.lat;
    const lng = latlng.lng;
    setMarker([lat, lng]);
    setForm({ ...form, coordinates: { lat, lng } });
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.coordinates) return alert('Please select a location on the map.');
    setLoading(true);
    try {
      await API.post('/canteens', {
        name: form.name,
        location: {
          type: 'Point',
          coordinates: [form.coordinates.lng, form.coordinates.lat],
        },
        address: form.address,
      });
      alert('Canteen created!');
      navigate('/vendor');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create canteen');
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="p-4 max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/vendor')}
          className="flex items-center gap-2 text-gray-300 hover:text-green-400 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <h2 className="text-3xl font-bold mb-8">
          Create Your <span className="text-green-400">Canteen</span>
        </h2>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Canteen Name</label>
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-green-400" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Main Cafeteria"
                  className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                />
              </div>
            </div>

            {/* Address with free lookup */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Address</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Type address, then click Lookup"
                  className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                />
                <button
                  type="button"
                  onClick={lookupAddress}
                  disabled={addressLoading}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                  <Search className="w-4 h-4" /> {addressLoading ? 'Searching…' : 'Lookup'}
                </button>
              </div>
              {form.coordinates && (
                <p className="text-green-400 text-xs mt-1">
                  Lat: {form.coordinates.lat.toFixed(6)}, Lng: {form.coordinates.lng.toFixed(6)}
                </p>
              )}
            </div>

            {/* Map to pick location */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1 text-green-400" /> Click on the map to set exact location
              </label>
              <div className="rounded-xl overflow-hidden border border-white/10">
                <MapContainer
                  center={mapCenter}
                  zoom={15}
                  className="h-80 w-full z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />
                  <ClickHandler onClick={handleMapClick} />
                  {marker && <Marker position={marker} />}
                </MapContainer>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-semibold transition shadow-lg shadow-green-900/30 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Canteen'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}