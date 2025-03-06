import React, { useEffect, useState } from "react";
import AddProduct from "../pages/AddProduct";

const InventoryTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const productsPerPage = 8;
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products from the backend
  const fetchProducts = async (page, query = "") => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://inventorybackend-production-6c3c.up.railway.app/product/allProducts?page=${page}&limit=${productsPerPage}&search=${query}`,
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
    fetchProducts(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  return (
    <div className="p-6 mt-16">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full"
        />
      </div>

      {/* Add Product Button */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          onClick={() => setIsModalOpen(true)}
        >
          Add Product
        </button>
      </div>

      {/* Product Cards */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="border p-4 rounded-lg shadow">
                <h2 className="font-bold">{product.name}</h2>
                <p>Price: ${product.price}</p>
                <p>Stock: {product.stock}</p>
              </div>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded"
        >
          Prev
        </button>
        <span className="mx-4">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InventoryTable;
