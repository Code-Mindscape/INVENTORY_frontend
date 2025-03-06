import React, { useState } from "react";
import axios from "axios";

const AddProduct = ({ onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    size: "",
    color: "",
    description: "",
    image: null, // ✅ Corrected from imageUrl to image
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Image Selection (Send to Backend)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, image: file })); // Store file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ✅ Corrected validation check
    if (!formData.name || !formData.price || !formData.stock || !formData.image) {
      setError("⚠️ Name, Price, Stock, and Image are required.");
      setLoading(false);
      return;
    }

    try {
      const productData = new FormData();
      productData.append("name", formData.name);
      productData.append("price", formData.price);
      productData.append("stock", formData.stock);
      productData.append("size", formData.size);
      productData.append("color", formData.color);
      productData.append("description", formData.description);
      productData.append("image", formData.image); // ✅ Fixed file submission

      const response = await axios.post("https://inventorybackend-production-6c3c.up.railway.app/product/addProduct", productData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      onProductAdded();
      onClose();
    } catch (err) {
      setError("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-lg text-black font-semibold mb-4">🛒 Add New Product</h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name *" className="border-black text-black w-full p-2 border rounded-md" required />
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price *" className="border-black text-black w-full p-2 border rounded-md" required />
        <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock *" className="border-black text-black w-full p-2 border rounded-md" required />
        <input type="text" name="size" value={formData.size} onChange={handleChange} placeholder="Size (Optional)" className="border-black text-black w-full p-2 border rounded-md" />
        <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="Color (Optional)" className="border-black text-black w-full p-2 border rounded-md" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description (Optional)" className="border-black text-black w-full p-2 border rounded-md"></textarea>

        {/* ✅ File Input for Image */}
        <input type="file" accept="image/*" name="image" onChange={handleImageChange} className="w-full p-2 border border-black text-black rounded-md" required />

        <div className="flex justify-between mt-4">
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded-md" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={`px-4 py-2 rounded-md text-white ${loading || !formData.image ? "bg-gray-500" : "bg-blue-500"}`} disabled={loading || !formData.image}>
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
