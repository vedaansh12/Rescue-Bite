import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      toast.success(`Welcome back, ${data.name}!`);
      return data; // so we can use role for redirection
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await API.post('/auth/register', userData);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      toast.success('Account created successfully!');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);