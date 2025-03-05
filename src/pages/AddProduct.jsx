import React, { useState } from "react";

const AddProduct = ({ onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    size: "",
    color: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    if (!formData.name || !formData.price || !formData.stock) {
      setError("Name, Price, and Stock are required.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/product/addProduct` || "http://localhost:5000/product/addProduct", {
        method: "POST",
        credentials: "include",  // ✅ Ensures cookies are sent
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price),
          stock: Number(formData.stock),
          size: formData.size || null,
          color: formData.color || null,
          description: formData.description || "",
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add product.");
      }
  
      onProductAdded();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-lg w-full max-w-md z-10" >
      <h2 className="text-lg font-semibold mb-4">Add Product</h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="text"
          name="size"
          value={formData.size}
          onChange={handleChange}
          placeholder="Size (Optional)"
          className="w-full p-2 border rounded-md"
        />
        <input
          type="text"
          name="color"
          value={formData.color}
          onChange={handleChange}
          placeholder="Color (Optional)"
          className="w-full p-2 border rounded-md"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description (Optional)"
          className="w-full p-2 border rounded-md"
        ></textarea>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
