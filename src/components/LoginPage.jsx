import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // ✅ For success messages
  const [error, setError] = useState(""); // ✅ For error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include", // ✅ Ensures session handling
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Store authentication status (use context/global state if available)
      localStorage.setItem("isAuthenticated", "true");

      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/admin/orders"), 1500); // ✅ Smooth redirection
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

        {error && <p className="text-red-500 text-sm text-center mb-4">⚠️ {error}</p>}
        {message && <p className="text-green-500 text-sm text-center mb-4">✅ {message}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Enter username"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="••••••••"
            required
          />
        </div>

        <a className="text-blue-600 underline text-sm block text-center mb-4" href="/worker-login">
          Worker Login
        </a>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
        >
          {loading ? "Signing In..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
