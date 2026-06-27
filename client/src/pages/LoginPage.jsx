import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    campusId: "",
    role: "customer",
  });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const data = await register(form);
        if (data.role === "vendor")
          navigate("/home"); // <-- changed to /home
        else navigate("/home");
      } else {
        const data = await login(form.email, form.password);
        if (data.role === "vendor")
          navigate("/home"); // <-- changed to /home
        else navigate("/home");
      }
    } catch (err) {
      // toast is already shown inside login/register, so we just stop here
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass-card w-full max-w-md p-8 mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 text-green-400">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Campus ID"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                  required
                  value={form.campusId}
                  onChange={(e) =>
                    setForm({ ...form, campusId: e.target.value })
                  }
                />
                <select
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-green-400"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="customer" className="bg-gray-900">
                    Student / Staff
                  </option>
                  <option value="vendor" className="bg-gray-900">
                    Canteen Vendor
                  </option>
                </select>
              </>
            )}
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-semibold transition"
            >
              {isRegister ? "Register" : "Login"}
            </button>
          </form>
          <p className="mt-6 text-center text-gray-300">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-green-400 ml-1 underline hover:text-green-300"
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>
        </div>
      </div>
    </Layout>
  );
}
