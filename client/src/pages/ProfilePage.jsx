import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { User, Mail, School, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Layout>
      <div className="p-4 max-w-lg mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Your <span className="text-green-400">Profile</span>
        </h2>
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3 text-gray-300">
            <User className="w-5 h-5 text-green-400" />
            <span className="font-medium">{user.name}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Mail className="w-5 h-5 text-green-400" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <School className="w-5 h-5 text-green-400" />
            <span>Campus: {user.campusId}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Shield className="w-5 h-5 text-green-400" />
            <span>Role: {user.role}</span>
          </div>

          {user.role === 'vendor' && (
            <button
              onClick={() => navigate('/vendor')}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg transition"
            >
              Vendor Dashboard
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </Layout>
  );
}