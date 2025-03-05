import React, { useEffect, useState } from "react";
import AddProduct from "../pages/AddProduct";

const InventoryTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch products from the backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://inventorybackend-production-6c3c.up.railway.app/product/allProducts` ||
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

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="relative overflow-x-auto mt-16 p-4">
      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative z-50">
            <AddProduct
              onClose={() => setIsModalOpen(false)}
              onProductAdded={fetchProducts} // Refresh list after adding
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

      {/* Inventory Table */}
      <div className="relative z-0">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <span className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></span>
          </div>
        ) : (
          <table className="table table-md w-full">
            <thead className="text-black">
              <tr>
                {[
                  "#",
                  "Product ID",
                  "Name",
                  "Price",
                  "Stock",
                  "Size",
                  "Color",
                  "Description",
                ].map((header) => (
                  <th key={header} className="text-black">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((item, index) => (
                  <tr key={index} className="text-black">
                    <td className="px-6 py-4 text-sm">{index + 1}</td>
                    <td className="px-6 py-4 text-sm">{item._id}</td>
                    <td className="px-6 py-4 text-sm">{item.name}</td>
                    <td className="px-6 py-4 text-sm">${item.price}</td>
                    <td
                      className={`px-6 py-4 text-sm ${
                        item.stock <= 0 ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {item.stock <= 0 ? "Out of Stock" : item.stock}
                    </td>
                    <td className="px-6 py-4 text-sm">{item.size}</td>
                    <td className="px-6 py-4 text-sm">{item.color}</td>
                    <td className="px-6 py-4 text-sm">{item.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-gray-500 py-4">
                    No products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InventoryTable;
