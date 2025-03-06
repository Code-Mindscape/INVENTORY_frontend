import React, { useEffect, useState } from "react";
import AddProduct from "../pages/AddProduct";

const InventoryTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products from backend with pagination
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://inventorybackend-production-6c3c.up.railway.app/product/allProducts?page=${page}&limit=${itemsPerPage}`,
        { credentials: "include" }
      );
      const data = await response.json();

      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
        setTotalPages(Math.ceil(data.totalCount / itemsPerPage));
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
    fetchProducts(currentPage);
  }, [currentPage]);

  return (
    <div className="relative overflow-x-auto mt-16 p-4">
      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative z-50">
            <AddProduct
              onClose={() => setIsModalOpen(false)}
              onProductAdded={() => fetchProducts(currentPage)} // Refresh after adding
            />
          </div>
        </div>
      )}

      {/* Add Product Button */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md"
          onClick={() => setIsModalOpen(true)}
        >
          Add Product
        </button>
      </div>

      {/* Inventory Cards */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600">
                  <strong>Product ID:</strong> {item._id}
                </p>
                <p className="text-gray-600">
                  <strong>Price:</strong> ${item.price}
                </p>
                <p
                  className={`text-sm font-bold ${
                    item.stock <= 0 ? "text-red-500" : "text-green-600"
                  }`}
                >
                  <strong>Stock:</strong>{" "}
                  {item.stock <= 0 ? "Out of Stock" : item.stock}
                </p>
                <p className="text-gray-600">
                  <strong>Size:</strong> {item.size}
                </p>
                <p className="text-gray-600">
                  <strong>Color:</strong> {item.color}
                </p>
                <p className="text-gray-600 truncate">
                  <strong>Description:</strong> {item.description}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No products available
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-3">
        <button
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="text-green-700 font-bold text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
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
