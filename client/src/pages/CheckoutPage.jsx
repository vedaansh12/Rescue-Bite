import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../services/api';
import useGeolocation from '../hooks/useGeolocation';
import { ArrowLeft, IndianRupee, QrCode, CreditCard, Smartphone, Wallet, Landmark } from 'lucide-react';
import toast from 'react-hot-toast';

const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: Smartphone },
  { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
  { id: 'netbanking', name: 'Net Banking', icon: Landmark },
  { id: 'wallet', name: 'Wallet', icon: Wallet },
  { id: 'cod', name: 'Cash on Pickup', icon: IndianRupee },
];

export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { coords } = useGeolocation();
  const [pack, setPack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const fetchPack = async () => {
      try {
        const { data } = await API.get(`/packs/${id}`);
        setPack(data);
      } catch (err) {
        toast.error('Failed to load pack details');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchPack();
  }, [id, navigate]);

  const handleConfirm = async () => {
    if (!selectedPayment) return toast.error('Please select a payment method');
    if (!coords) return toast.error('Location not available. Enable GPS.');
    setConfirming(true);
    try {
      await API.post(`/packs/${pack._id}/claim`, {
        lat: coords.lat,
        lng: coords.lng,
      });
      toast.success('Pack claimed successfully!');
      navigate('/my-claim');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Claim failed');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
          Loading...
        </div>
      </Layout>
    );
  }

  if (!pack) return null;

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
          Checkout & <span className="text-green-400">Claim</span>
        </h2>

        {/* Order Summary */}
        <div className="glass-card p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Item</span>
              <span className="text-white font-medium">{pack.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Canteen</span>
              <span className="text-white">{pack.canteen?.name}</span>
            </div>
            <hr className="border-white/10" />
            <div className="flex justify-between">
              <span className="text-gray-400">Original Price</span>
              <span className="text-white line-through">₹{pack.originalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Discount (60%)</span>
              <span className="text-green-400">-₹{pack.originalPrice - pack.discountedPrice}</span>
            </div>
            <hr className="border-white/10" />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-300">Total Amount</span>
              <span className="text-green-400">₹{pack.discountedPrice}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Quantity available</span>
              <span>{pack.quantity}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="glass-card p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                  selectedPayment === method.id
                    ? 'border-green-400 bg-green-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <method.icon className="w-5 h-5 text-green-400" />
                <span className="text-gray-200">{method.name}</span>
              </button>
            ))}
          </div>
          {selectedPayment && (
            <p className="mt-3 text-sm text-green-400">
              Payment method selected: {paymentMethods.find(m => m.id === selectedPayment)?.name}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-4">
            * This is a demo. No real payment will be processed.
          </p>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={confirming || !selectedPayment}
          className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-semibold transition shadow-lg shadow-green-900/30 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <QrCode className="w-5 h-5" />
          {confirming ? 'Processing...' : 'Confirm & Claim'}
        </button>
      </div>
    </Layout>
  );
}