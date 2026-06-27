import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 text-white">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}