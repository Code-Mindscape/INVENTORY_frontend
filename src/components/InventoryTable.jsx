import React, { useEffect, useState } from "react";
import AddProduct from "../pages/AddProduct";

const InventoryTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [totalPages, setTotalPages] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products from the backend
  const fetchProducts = async (page, search = "") => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://inventorybackend-production-6c3c.up.railway.app/product/allProducts?page=${page}&limit=${productsPerPage}&search=${search}`,
        { credentials: "include" }
      );
      const data = await response.json();
      
      if (data.products) {
        setProducts(data.products);
        setTotalPages(Math.ceil(data.totalCount / productsPerPage));
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Copy Product ID to clipboard
  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); // Hide tooltip after 2 seconds
  };

  return (
    <div className="p-6 mt-16">
      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative z-50">
            <AddProduct onClose={() => setIsModalOpen(false)} onProductAdded={() => fetchProducts(currentPage)} />
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search products..."
          className="border p-2 rounded-md w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md"
          onClick={() => setIsModalOpen(true)}
        >
          Add Product
        </button>
      </div>

      {/* Product Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-300 shadow-lg rounded-xl p-6 w-full transform transition duration-300 relative"
                style={{ minHeight: "450px" }}
              >
                {/* Image Box */}
                <div className="w-full h-44 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover rounded-lg" />
                  ) : (
                    "No Image"
                  )}
                </div>

                {/* Product Info */}
                <h2 className="text-lg font-bold text-blue-800 mt-3">{product.name}</h2>

                {/* Copyable Product ID */}
                <div
                  className="relative cursor-pointer text-gray-700 text-sm font-medium bg-gray-100 p-2 rounded-lg inline-block"
                  onClick={() => copyToClipboard(product._id)}
                >
                  Product ID: {product._id}
                  {copiedId === product._id && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-2 py-1 rounded">
                      Copied!
                    </span>
                  )}
                </div>

                <p className="text-gray-700 text-sm">Price: <span className="font-semibold text-green-700">${product.price}</span></p>
                <p className={`text-sm font-semibold ${product.stock <= 0 ? "text-red-600" : "text-green-600"}`}>
                  {product.stock <= 0 ? "Out of Stock" : `Stock: ${product.stock}`}
                </p>
                <p className="text-gray-700 text-sm">Size: {product.size}</p>
                <p className="text-gray-700 text-sm">Color: {product.color}</p>

                {/* Description with Proper Wrapping */}
                <div className="bg-gray-100 p-3 mt-2 rounded-lg border border-gray-300 text-gray-700 text-sm overflow-hidden">
                  <strong>Description:</strong> <span className="whitespace-pre-line">{product.description}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-4">No products available</p>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-3">
        <button
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="text-blue-700 font-bold text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InventoryTable;
