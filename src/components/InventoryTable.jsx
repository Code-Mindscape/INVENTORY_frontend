import React, { useEffect, useState } from "react";

const InventoryTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 4 per row, 2 rows per page

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://inventorybackend-production-6c3c.up.railway.app/product/allProducts" ||
          "http://localhost:5000/product/allProducts",
        { credentials: "include" }
      );
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-4">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(itemsPerPage)].map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-300 h-40 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {currentItems.length > 0 ? (
            currentItems.map((product, index) => (
              <div
                key={index}
                className="bg-green-300 p-4 rounded-lg shadow-md"
              >
                <h2 className="font-bold">Order ID: {product._id}</h2>
                <p>Status: Delivered</p>
                <p>Total Amount: {product.price}rs</p>
                <hr className="my-2" />
                <p className="font-semibold">Supplier</p>
                <p className="font-semibold">Customer</p>
                <p>{product.name}</p>
                <p>{product.description || "No description"}</p>
                <p>Size: {product.size || "N/A"}</p>
                <p>Quantity: {product.stock}</p>
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-400 text-white rounded-md mx-2"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {currentPage}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              indexOfLastItem < products.length ? prev + 1 : prev
            )
          }
          className="px-4 py-2 bg-gray-400 text-white rounded-md mx-2"
          disabled={indexOfLastItem >= products.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InventoryTable;
