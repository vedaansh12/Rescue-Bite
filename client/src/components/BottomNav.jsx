import { NavLink } from 'react-router-dom';
import { Home, QrCode, User } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `flex flex-col items-center ${isActive ? 'text-green-600' : 'text-gray-500'}`
        }
      >
        <Home size={24} />
        <span className="text-xs">Home</span>
      </NavLink>
      <NavLink
        to="/my-claim"
        className={({ isActive }) =>
          `flex flex-col items-center ${isActive ? 'text-green-600' : 'text-gray-500'}`
        }
      >
        <QrCode size={24} />
        <span className="text-xs">My Claim</span>
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center ${isActive ? 'text-green-600' : 'text-gray-500'}`
        }
      >
        <User size={24} />
        <span className="text-xs">Profile</span>
      </NavLink>
    </nav>
  );
}