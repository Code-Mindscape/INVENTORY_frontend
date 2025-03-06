import React, { useState } from "react";

const AddProduct = ({ onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    size: "",
    color: "",
    description: "",
    image: null, // Image file
    preview: null, // Image preview
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes (for text inputs)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!formData.name || !formData.price || !formData.stock) {
      setError("Name, Price, and Stock are required.");
      setLoading(false);
      return;
    }

    // Prepare FormData for file upload
    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("price", Number(formData.price));
    productData.append("stock", Number(formData.stock));
    productData.append("size", formData.size || null);
    productData.append("color", formData.color || null);
    productData.append("description", formData.description || "");
    if (formData.image) {
      productData.append("image", formData.image);
    }

    try {
      const response = await fetch(
        `https://inventorybackend-production-6c3c.up.railway.app/product/addProduct` ||
          "http://localhost:5000/product/addProduct",
        {
          method: "POST",
          credentials: "include",
          body: productData, // ✅ FormData for file upload
        }
      );

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
    <div className="p-6 rounded-lg shadow-lg w-full max-w-md z-10 bg-white">
      <h2 className="text-lg font-semibold mb-4">Add Product</h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Preview */}
        {formData.preview && (
          <img
            src={formData.preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-md border mb-3"
          />
        )}

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded-md"
        />

        {/* Product Details */}
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

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-md text-white ${
              loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
            }`}
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
