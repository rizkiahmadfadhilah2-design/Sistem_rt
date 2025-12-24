import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { login } from "../services/Api";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await login(username, password);

      localStorage.setItem("token", res.token);
      const decoded = jwtDecode(res.token);
      localStorage.setItem("role", decoded.role);

      if (decoded.role === "rt") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard-warga");
      }
    } catch {
      setError("Username atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8"
      >
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Sistem Informasi RT
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Silakan login untuk melanjutkan
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Username</label>
            <input
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* BUTTON */}
        <motion.button
          onClick={handleLogin}
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Masuk"}
        </motion.button>

        {/* ERROR */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-red-500 text-center mt-4"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* FOOTER */}
        <p className="text-xs text-center text-gray-400 mt-8">
          © {new Date().getFullYear()} Sistem Informasi RT
        </p>
      </motion.div>
    </div>
  );
}
