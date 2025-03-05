import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const WorkerRegisterPage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, confirmPassword } = credentials;

    if (!username || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://inventorybackend-production-6c3c.up.railway.app/worker-register3453`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Registration failed");

      navigate("/worker-login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <form className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Worker Registration</h2>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 text-sm text-center mb-4 bg-red-100 p-2 rounded-md">
            ⚠️ {error}
          </p>
        )}

        {/* Username Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-2">Username</label>
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-2">Password</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="••••••••"
            required
          />
        </div>

        {/* Confirm Password Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-2">Confirm Password</label>
          <input
            type="password"
            value={credentials.confirmPassword}
            onChange={(e) =>
              setCredentials({ ...credentials, confirmPassword: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="••••••••"
            required
          />
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default WorkerRegisterPage;
