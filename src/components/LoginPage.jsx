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
      const response = await fetch(`https://inventorybackend-production-6c3c.up.railway.app/admin-login`, {
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
<div className="h-screen flex items-center justify-center bg-gray-200">
  <form className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm border border-black text-black">
    <h2 className="text-2xl font-bold text-center !text-black !opacity-100">Test Login</h2>
    
    <label className="block text-sm font-medium text-black mb-2">Username</label>
    <input type="text" className="w-full px-4 py-2 border border-black text-black bg-white" />

    <label className="block text-sm font-medium text-black mb-2 mt-4">Password</label>
    <input type="password" className="w-full px-4 py-2 border border-black text-black bg-white" />

    <button className="w-full bg-blue-800 text-white py-2 rounded-lg mt-4">
      Login
    </button>
  </form>
</div>
  );
};

export default LoginPage;
