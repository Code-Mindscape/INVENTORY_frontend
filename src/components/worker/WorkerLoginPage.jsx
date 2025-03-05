import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const WorkerLoginPage = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = credentials;

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://inventorybackend-production-6c3c.up.railway.app/worker-login`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Login failed");

      navigate("/worker/orders");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Worker Login</h2>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 text-sm text-center mb-4 bg-red-100 p-2 rounded-md">
            ⚠️ {error}
          </p>
        )}

        {/* Username Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-2">
            Username
          </label>
          <input
            type="text"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="Enter username"
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-2">
            Password
          </label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300  text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="••••••••"
            required
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Signing In..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default WorkerLoginPage;
