import React, { useEffect, useState } from "react";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://inventorybackend-production-6c3c.up.railway.app/order/allOrders?page=${page}&limit=${ordersPerPage}`,
        { credentials: "include" }
      );
      const data = await response.json();
      
      if (data.orders && Array.isArray(data.orders)) {
        setOrders(data.orders.slice(0, ordersPerPage));
        setTotalPages(Math.ceil(data.totalCount / ordersPerPage));
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  return (
    <div className="p-6 mt-16">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-green-200 border border-gray-300 shadow-lg rounded-xl p-6 w-full"
              style={{ minHeight: "420px" }}
            >
              <div className="w-full h-44 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                No Image
              </div>
              <h2 className="text-xl font-bold text-green-800 mt-3">Order ID: {order._id}</h2>
              <p className="text-gray-700 text-sm font-medium">Customer: {order.customerName}</p>
              <p className="text-gray-700 text-sm">Product: {order.productID?.name || "N/A"}</p>
              <p className="text-gray-700 text-sm">Size: {order.productID?.size || "N/A"}</p>
              <p className="text-gray-700 text-sm">Color: {order.productID?.color || "N/A"}</p>
              <p className="text-gray-700 text-sm">Qty: {order.quantity}</p>
              <p className={`text-sm font-semibold ${order.delivered ? "text-green-600" : "text-red-600"}`}>
                Status: {order.delivered ? "Delivered" : "Pending"}
              </p>
              <div className="bg-gray-100 p-3 mt-2 rounded-lg border border-gray-300 text-gray-700 text-sm">
                <strong>Address:</strong> {order.address}
              </div>
              <p className="text-gray-700 text-sm mt-2">
                Contact: <a href={`https://wa.me/${order.contact}`} className="text-blue-600 underline">{order.contact}</a>
              </p>
              <p className="text-gray-700 text-sm">COD: {order.cod}</p>
              <p className="text-gray-700 text-sm">Worker: {order.workerID?.username || "Unknown"}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-3">
        <button
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
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
            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
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

export default OrdersTable;
