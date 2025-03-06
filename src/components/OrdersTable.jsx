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
      if (Array.isArray(data.orders)) {
        setOrders(data.orders);
        setTotalPages(Math.ceil(data.totalCount / ordersPerPage));
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
    <div className="p-4">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-green-50 border border-green-200 shadow-md rounded-xl p-4 w-full"
              style={{ minHeight: "350px" }}
            >
              <div className="w-full h-36 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                No Image
              </div>
              <h2 className="text-lg font-bold text-green-800 mt-3">Order ID: {order._id}</h2>
              <p className="text-gray-700 text-sm">Customer: {order.customerName}</p>
              <p className="text-gray-700 text-sm">Product: {order.productID?.name || "N/A"}</p>
              <p className="text-gray-700 text-sm">Qty: {order.quantity}</p>
              <div className="bg-white p-2 mt-2 rounded-lg border border-gray-300 text-gray-700 text-sm">
                <strong>Address:</strong> {order.address}
              </div>
              <p className="text-gray-700 text-sm mt-2">
                Contact: <a href={`https://wa.me/${order.contact}`} className="text-green-600">{order.contact} (WhatsApp)</a>
              </p>
              <p className="text-gray-700 text-sm">COD: {order.cod ? "Yes" : "No"}</p>
              <p className="text-gray-700 text-sm">Worker: {order.workerID?.username || "Unknown"}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          className={`px-3 py-2 text-sm font-semibold rounded-md ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
          }`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="text-green-700 font-bold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-3 py-2 text-sm font-semibold rounded-md ${
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
