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
      const response = await fetch(`https://inventorybackend-production-6c3c.up.railway.app/order/addOrder` || "http://localhost:5000/order/addOrder", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

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
    <div className="p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">Add Order</h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {["productID", "customerName", "address", "contact", "description"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field.replace(/([A-Z])/g, " $1").trim()}
            className="w-full p-2 border rounded-md"
            required
          />
        ))}

        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          className="w-full p-2 border rounded-md"
          required
        />

        <input
          type="number"
          name="cod"
          value={formData.cod}
          onChange={handleChange}
          placeholder="Cash on Delivery (COD)"
          className="w-full p-2 border rounded-md"
          required
        />

        <div className="flex justify-between mt-4">
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded-md" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md" disabled={loading}>
            {loading ? "Adding..." : "Add Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrder;
