import React, { useEffect, useState } from "react";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async (page, query) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://inventorybackend-production-6c3c.up.railway.app/order/allOrders?page=${page}&limit=${ordersPerPage}&search=${query}`,
        { credentials: "include" }
      );
      const data = await response.json();
      if (data.orders && Array.isArray(data.orders)) {
        setOrders(data.orders);
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

  const updateOrderStatus = async (orderId, delivered) => {
    try {
      const response = await fetch(
        `https://inventorybackend-production-6c3c.up.railway.app/order/updateOrder/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ delivered }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, delivered } : order
          )
        );
      } else {
        console.error("Failed to update order:", data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchOrders(currentPage, searchQuery);
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [currentPage, searchQuery]);

  return (
    <div className="p-6 mt-16">
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search orders..."
          className="border border-black text-black p-1 rounded-md w-[200px] max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div style={{ minHeight: "420px" }} key={i} className="h-80 bg-gray-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {orders.length > 0 ? (
            orders.map((order) => (
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
                <p className="text-gray-700 text-sm">Product: {order.productID?.name}</p>
                <p className="text-gray-700 text-sm">Size: {order.productID?.size}</p>
                <p className="text-gray-700 text-sm">Color: {order.productID?.color}</p>
                <p className="text-gray-700 text-sm">Qty: {order.quantity}</p>
                <p className="text-gray-700 text-sm">Date: {order.dateAdded}</p>
                <p className={`text-sm font-semibold ${order.delivered ? "text-green-600" : "text-red-600"}`}>
                  Status: {order.delivered ? "Delivered" : "Pending"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <label className="text-sm font-semibold">Delivered:</label>
                  <input
                    type="checkbox"
                    checked={order.delivered}
                    onChange={(e) => updateOrderStatus(order._id, e.target.checked)}
                    className="cursor-pointer"
                  />
                </div>
                <div className="bg-gray-100 p-3 mt-2 rounded-lg border border-gray-300 text-gray-700 text-sm break-words max-h-32 overflow-auto">
                  <strong>Address:</strong> {order.address}
                </div>
                <p className="text-gray-700 text-sm mt-2">
                  Contact: <a href={`https://wa.me/${order.contact}`} className="text-blue-600 underline">{order.contact}</a>
                </p>
                <p className="text-gray-700 text-sm">COD: {order.cod}</p>
                <p className="text-gray-700 text-sm">Worker: {order.workerID?.username || "Unknown"}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No orders found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersTable;