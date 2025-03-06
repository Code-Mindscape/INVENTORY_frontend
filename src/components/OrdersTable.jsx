import React, { useEffect, useState } from "react";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `https://inventorybackend-production-6c3c.up.railway.app/order/allOrders`,
          { credentials: "include" }
        );
        const data = await response.json();
        if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          console.error("Unexpected API response format:", data);
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="p-4">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-200 h-44 rounded-md"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {currentOrders.map((order, index) => (
            <div key={index} className="bg-green-300 p-4 rounded-lg shadow-md">
              <p className="font-bold">Order ID: {order._id}</p>
              <p className="text-sm">Customer: {order.customerName}</p>
              <p className="text-sm">Product: {order.productID?.name || "N/A"}</p>
              <p className="text-sm">Qty: {order.quantity}</p>
              <p className="text-sm">Contact: {order.contact}</p>
              <p className="text-sm">COD: {order.cod ? "Yes" : "No"}</p>
              <p className="text-sm">Status: {order.delivered ? "Delivered" : "Pending"}</p>
            </div>
          ))}
        </div>
      )}
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 mx-1 border rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrdersTable;
