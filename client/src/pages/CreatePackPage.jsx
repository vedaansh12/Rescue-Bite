import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../services/api';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreatePackPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    description: '',
    originalPrice: '',
    quantity: 1,
    availableUntil: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const expiry = form.availableUntil
        ? new Date(form.availableUntil).toISOString()
        : new Date(Date.now() + 15 * 60000).toISOString();

      await API.post('/packs', {
        description: form.description,
        originalPrice: Number(form.originalPrice),
        quantity: Number(form.quantity),
        availableUntil: expiry,
        // image field is no longer sent
      });
      toast.success('Pack created successfully!');
      navigate('/vendor');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create pack');
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="p-4 max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/vendor')}
          className="flex items-center gap-2 text-gray-300 hover:text-green-400 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <h2 className="text-3xl font-bold mb-8">
          Create <span className="text-green-400">New Pack</span>
        </h2>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Food Description</label>
              <input
                type="text"
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g., Veg Thali with 3 Rotis"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
              />
            </div>

            {/* Price & Quantity */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm text-gray-300 mb-1">Original Price (₹)</label>
    <input
      type="number"
      required
      min="1"
      value={form.originalPrice}
      onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
      placeholder="150"
      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
    />
    {/* Live discount calculation */}
    {form.originalPrice && (
      <div className="mt-2 flex items-center gap-2">
        <span className="text-sm text-gray-400">Discounted (60% off):</span>
        <span className="text-green-400 font-semibold">
          ₹{Math.round(Number(form.originalPrice) * 0.4)}
        </span>
      </div>
    )}
  </div>
  <div>
    <label className="block text-sm text-gray-300 mb-1">Quantity</label>
    <input
      type="number"
      required
      min="1"
      value={form.quantity}
      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
    />
  </div>
</div>

            {/* Available Until */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Pickup Deadline</label>
              <input
                type="datetime-local"
                value={form.availableUntil}
                onChange={(e) => setForm({ ...form, availableUntil: e.target.value })}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
              />
              <p className="text-xs text-gray-400 mt-1">Leave blank for automatic 15‑min window.</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-semibold transition shadow-lg shadow-green-900/30 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Publish Leftover Pack'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}