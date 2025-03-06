import React, { useState } from "react";
import ImageUploader from "./ImageUploader";

const AddProduct = ({ onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    size: "",
    color: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (imageUrl) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate required fields
    if (!formData.name || !formData.price || !formData.stock || !formData.image) {
      setError("⚠️ Name, Price, Stock, and Image are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/product/addProduct", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">🛒 Add New Product</h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name *" className="w-full p-2 border rounded-md" required />
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price *" className="w-full p-2 border rounded-md" required />
        <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock *" className="w-full p-2 border rounded-md" required />
        <input type="text" name="size" value={formData.size} onChange={handleChange} placeholder="Size (Optional)" className="w-full p-2 border rounded-md" />
        <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="Color (Optional)" className="w-full p-2 border rounded-md" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description (Optional)" className="w-full p-2 border rounded-md"></textarea>

        {/* ✅ Image Upload with Preview */}
        <ImageUploader onImageUpload={handleImageUpload} />
        {formData.image && <img src={formData.image} alt="Preview" className="w-full h-40 object-cover mt-2 rounded-md" />}

        <div className="flex justify-between mt-4">
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded-md" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={`px-4 py-2 rounded-md text-white ${loading ? "bg-gray-500" : "bg-blue-500"}`} disabled={loading || !formData.image}>
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
