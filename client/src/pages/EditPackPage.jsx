import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../services/api';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditPackPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    description: '',
    originalPrice: '',
    quantity: 1,
    availableUntil: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPack = async () => {
      try {
        const { data } = await API.get(`/packs/${id}`);
        // Pre-fill form
        setForm({
          description: data.description || '',
          originalPrice: data.originalPrice?.toString() || '',
          quantity: data.quantity || 1,
          availableUntil: data.availableUntil
            ? new Date(data.availableUntil).toISOString().slice(0, 16)
            : '',
        });
      } catch (err) {
        toast.error('Could not load pack details');
        navigate(-1);
      } finally {
        setFetching(false);
      }
    };
    fetchPack();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        description: form.description,
        originalPrice: Number(form.originalPrice),
        quantity: Number(form.quantity),
        availableUntil: form.availableUntil
          ? new Date(form.availableUntil).toISOString()
          : undefined,
      };
      await API.put(`/packs/${id}`, payload);
      toast.success('Pack updated!');
      navigate('/home'); // go back to vendor home
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh] text-gray-400">
          Loading pack…
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-300 hover:text-green-400 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <h2 className="text-3xl font-bold mb-8">
          Edit <span className="text-green-400">Pack</span>
        </h2>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Description</label>
              <input
                type="text"
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Original Price (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.originalPrice}
                  onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                />
                {form.originalPrice && (
                  <p className="text-green-400 text-xs mt-1">
                    Discounted: ₹{Math.round(Number(form.originalPrice) * 0.4)}
                  </p>
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

            <div>
              <label className="block text-sm text-gray-300 mb-1">Available Until</label>
              <input
                type="datetime-local"
                value={form.availableUntil}
                onChange={(e) => setForm({ ...form, availableUntil: e.target.value })}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-semibold transition shadow-lg shadow-green-900/30 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Pack'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}