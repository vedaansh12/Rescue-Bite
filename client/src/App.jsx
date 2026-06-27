import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import MyClaimPage from "./pages/MyClaimPage";
import ProfilePage from "./pages/ProfilePage";
import VendorDashboard from "./pages/VendorDashboard";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CreatePackPage from "./pages/CreatePackPage";
import CreateCanteenPage from "./pages/CreateCanteenPage";
import CheckoutPage from "./pages/CheckoutPage";
import EditPackPage from "./pages/EditPackPage";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-green-400 text-xl">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #4ade80",
          },
        }}
      />
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={!user ? <LandingPage /> : <Navigate to="/home" />}
        />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/home" />}
        />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/checkout/:id"
          element={user ? <CheckoutPage /> : <Navigate to="/login"></Navigate>}
        />
        {/* Protected routes */}
        <Route
          path="/home"
          element={user ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-claim"
          element={user ? <MyClaimPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/vendor"
          element={
            user?.role === "vendor" ? <VendorDashboard /> : <Navigate to="/" />
          }
        />
        <Route
          path="/create-pack"
          element={
            user?.role === "vendor" ? <CreatePackPage /> : <Navigate to="/" />
          }
        />
        <Route
          path="/create-canteen"
          element={
            user?.role === "vendor" ? (
              <CreateCanteenPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        // Inside Routes:
        <Route
          path="/edit-pack/:id"
          element={
            user?.role === "vendor" ? <EditPackPage /> : <Navigate to="/" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
