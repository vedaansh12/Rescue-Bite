import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, User, LogOut, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const homeLink = user ? '/home' : '/';

  return (
    <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-green-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={homeLink} className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
            <Leaf className="w-6 h-6 text-green-400" />
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              Rescue Bite
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to={homeLink} className="text-gray-300 hover:text-green-400 transition">Home</Link>
            <Link to="/services" className="text-gray-300 hover:text-green-400 transition">Services</Link>
            <Link to="/about" className="text-gray-300 hover:text-green-400 transition">About</Link>
            <Link to="/contact" className="text-gray-300 hover:text-green-400 transition">Contact</Link>
          </div>

          <div className="hidden md:block">
            {!user ? (
              <Link to="/login" className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-full font-medium transition">
                Login / Register
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/home" title="Dashboard" className="text-gray-300 hover:text-green-400"><LayoutDashboard className="w-5 h-5" /></Link>
                <Link to="/my-claim" title="My Claim" className="text-gray-300 hover:text-green-400"><ShoppingBag className="w-5 h-5" /></Link>
                <Link to="/profile" title="Profile" className="text-gray-300 hover:text-green-400"><User className="w-5 h-5" /></Link>
                <button onClick={handleLogout} title="Logout" className="text-gray-300 hover:text-red-400"><LogOut className="w-5 h-5" /></button>
              </div>
            )}
          </div>

          <button className="md:hidden text-gray-300 hover:text-green-400" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link to={homeLink} className="block text-gray-300 hover:text-green-400" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/services" className="block text-gray-300 hover:text-green-400" onClick={() => setMobileOpen(false)}>Services</Link>
            <Link to="/about" className="block text-gray-300 hover:text-green-400" onClick={() => setMobileOpen(false)}>About</Link>
            <Link to="/contact" className="block text-gray-300 hover:text-green-400" onClick={() => setMobileOpen(false)}>Contact</Link>
            {!user ? (
              <Link to="/login" className="block text-green-400 font-semibold" onClick={() => setMobileOpen(false)}>Login / Register</Link>
            ) : (
              <div className="flex gap-4 pt-2">
                <Link to="/home" className="text-gray-300 hover:text-green-400"><LayoutDashboard className="w-5 h-5" /></Link>
                <Link to="/my-claim" className="text-gray-300 hover:text-green-400"><ShoppingBag className="w-5 h-5" /></Link>
                <Link to="/profile" className="text-gray-300 hover:text-green-400"><User className="w-5 h-5" /></Link>
                <button onClick={handleLogout} className="text-gray-300 hover:text-red-400"><LogOut className="w-5 h-5" /></button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}