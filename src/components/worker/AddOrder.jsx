import React, { useState } from "react";

const AddOrder = ({ onClose, onOrderAdded }) => {
  const [formData, setFormData] = useState({
    productID: "",
    customerName: "",
    quantity: "",
    address: "",
    contact: "",
    cod: "",
    description: "",
    delivered: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value.trim(),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate required fields
    if (Object.values(formData).some((val) => val === "" || val === null)) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://inventorybackend-production-6c3c.up.railway.app/order/addOrder` ||
          "http://localhost:5000/order/addOrder",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add order.");
      }

      onOrderAdded();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Add New Order</h2>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-sm text-center mb-3 bg-red-100 p-2 rounded-md">
          ⚠️ {error}
        </p>
      )}

      {/* Order Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: "productID", label: "Product ID", type: "text" },
          { name: "customerName", label: "Customer Name", type: "text" },
          { name: "address", label: "Address", type: "text" },
          { name: "contact", label: "Contact", type: "text" },
          { name: "description", label: "Description", type: "text" },
        ].map(({ name, label, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-black"
              placeholder={label}
              required
            />
          </div>
        ))}

        {/* Quantity Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-black"
            placeholder="Enter quantity"
            required
          />
        </div>

        {/* Cash on Delivery (COD) Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Cash on Delivery (COD)</label>
          <input
            type="number"
            name="cod"
            value={formData.cod}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-black"
            placeholder="Enter COD amount"
            required
          />
        </div>

        {/* Delivered Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="delivered"
            checked={formData.delivered}
            onChange={handleChange}
            className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="text-sm text-gray-700">Mark as Delivered</label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrder;
