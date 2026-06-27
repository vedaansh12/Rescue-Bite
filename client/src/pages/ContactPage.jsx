// client/src/pages/ContactPage.jsx
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Mail, MapPin, Phone, Send, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Helper to re-center map when coords change
function CenterOnLoad({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function ContactPage() {
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        // Fallback to Delhi campus if user denies location
        setUserCoords([28.7041, 77.1025]);
      }
    );
  }, []);

  return (
    <Layout>
      <div className="px-4 py-20 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Get in <span className="text-green-400">Touch</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Have questions, suggestions, or want to bring Rescue Bite to your campus? We’d love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Send className="w-5 h-5 text-green-400" /> Send a Message
            </h2>
            <form className="space-y-5">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition"
                />
              </div>
              <div>
                <textarea
                  rows="4"
                  placeholder="Your Message"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-semibold transition shadow-lg shadow-green-900/30 flex items-center justify-center gap-2"
                onClick={(e) => {
  e.preventDefault();
  toast('This form is for demo. Connect a backend to make it live!', { icon: '📬' });
}}>
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>

          {/* Contact Info + Map */}
          <div className="space-y-6">
            {/* Info Cards */}
            <div className="glass-card p-6 group hover:scale-105 transition-transform">
              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-green-400 group-hover:animate-pulse" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-300">hello@rescuebite.com</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6 group hover:scale-105 transition-transform">
              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-green-400 group-hover:animate-pulse" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-300">+91 7078513370</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6 group hover:scale-105 transition-transform">
              <div className="flex items-center gap-4">
                <MapPin className="w-6 h-6 text-green-400 group-hover:animate-pulse" />
                <div>
                  <h3 className="font-semibold">Visit Us</h3>
                  <p className="text-gray-300">Campus Innovation Hub, Block C, Delhi</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-4">
                <Clock className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="font-semibold">Support Hours</h3>
                  <p className="text-gray-300">Mon–Fri, 9 AM – 6 PM</p>
                </div>
              </div>
            </div>

            {/* Map showing current location */}
            <div className="glass-card overflow-hidden">
              {userCoords ? (
                <MapContainer center={userCoords} zoom={15} className="h-64 w-full z-0">
                  <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />
                  <Marker position={userCoords} />
                  <CenterOnLoad center={userCoords} />
                </MapContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Loading map…
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}