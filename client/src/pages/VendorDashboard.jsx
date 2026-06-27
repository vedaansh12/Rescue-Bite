import { useEffect, useState } from 'react';
import API from '../services/api';
import VendorPackCard from '../components/VendorPackCard';
import QRScanner from '../components/QRScanner';
import Layout from '../components/Layout';
import { QrCode, Plus, Package, TrendingUp, DollarSign,Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import toast from 'react-hot-toast';

// Sample data for charts (can be replaced with real data later)
const ordersData = [
  { month: 'Jan', orders: 12 },
  { month: 'Feb', orders: 19 },
  { month: 'Mar', orders: 25 },
  { month: 'Apr', orders: 30 },
  { month: 'May', orders: 22 },
  { month: 'Jun', orders: 35 },
  { month: 'Jul', orders: 40 },
];

const revenueData = [
  { month: 'Jan', original: 2400, discounted: 960 },
  { month: 'Feb', original: 3800, discounted: 1520 },
  { month: 'Mar', original: 5000, discounted: 2000 },
  { month: 'Apr', original: 6000, discounted: 2400 },
  { month: 'May', original: 4400, discounted: 1760 },
  { month: 'Jun', original: 7000, discounted: 2800 },
  { month: 'Jul', original: 8000, discounted: 3200 },
];

export default function VendorDashboard() {
  const [packs, setPacks] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [stats, setStats] = useState({ totalPacks: 0, activePacks: 0 });

  const fetchPacks = async () => {
    const { data } = await API.get('/packs/mine');
    setPacks(data);
    const active = data.filter(p => p.status === 'available').length;
    setStats({ totalPacks: data.length, activePacks: active });
  };

  useEffect(() => { fetchPacks(); }, []);

  const handleCollect = async (claimId) => {
  try {
    await API.post(`/claims/${claimId}/collect`);
    fetchPacks();
    toast.success('Pack marked as collected!');
  } catch (err) {
    toast.error('Failed to collect pack');
  }
};

  const handleScan = async (decodedText) => {
  try {
    const { data: claimId } = await API.post('/claims/verify-token', { token: decodedText });
    await handleCollect(claimId);
    setScanning(false);
    toast.success('Pack collected!');
  } catch (err) {
    toast.error('Invalid token or not your pack');
  }
};

  return (
    <Layout>
      <div className="p-4 max-w-6xl mx-auto">
        {/* Header with action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold">
            Vendor <span className="text-green-400">Dashboard</span>
          </h2>
          <div className="flex gap-2">
            <Link
              to="/create-pack"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-3 rounded-lg font-medium transition"
            >
              <Plus className="w-5 h-5" /> New Pack
            </Link>
            <button
              onClick={() => setScanning(!scanning)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-3 rounded-lg font-medium transition"
            >
              <QrCode className="w-5 h-5" />
              {scanning ? 'Close Scanner' : 'Scan QR'}
            </button>
            <Link
  to="/create-canteen"
  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-lg font-medium transition border border-white/20"
>
  <Store className="w-5 h-5" /> Create Canteen
</Link>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-5 flex items-center gap-4">
            <Package className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold">{stats.totalPacks}</p>
              <p className="text-gray-400 text-sm">Total Packs</p>
            </div>
          </div>
          <div className="glass-card p-5 flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold">{stats.activePacks}</p>
              <p className="text-gray-400 text-sm">Active Packs</p>
            </div>
          </div>
          <div className="glass-card p-5 flex items-center gap-4">
            <DollarSign className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold">₹{packs.reduce((acc, p) => acc + (p.discountedPrice || 0), 0)}</p>
              <p className="text-gray-400 text-sm">Total Discounted Value</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Orders per Month (Bar Chart) */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-green-400 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Orders per Month
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                />
                <Bar dataKey="orders" fill="#4ade80" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Trend (Line Chart) */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-green-400 flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> Pricing Trend (Original vs Discounted)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="original" stroke="#f87171" strokeWidth={2} />
                <Line type="monotone" dataKey="discounted" stroke="#4ade80" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400"></span> Original</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-400"></span> Discounted (60% off)</span>
            </div>
          </div>
        </div>

        {/* QR Scanner */}
        {scanning && (
          <div className="mb-8">
            <QRScanner onScan={handleScan} />
          </div>
        )}

        {/* Pack list */}
        <div className="space-y-4">
          {packs.length === 0 && (
            <div className="glass-card p-8 text-center text-gray-400">
              No packs yet. Click “New Pack” to create your first leftover.
            </div>
          )}
          {packs.map(pack => (
            <VendorPackCard key={pack._id} pack={pack} onRefresh={fetchPacks} />
          ))}
        </div>
      </div>
    </Layout>
  );
}