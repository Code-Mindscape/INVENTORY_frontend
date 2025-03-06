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
          {
            credentials: "include",
          }
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

  const handleDeliveredChange = async (orderId, isChecked) => {
    try {
      const response = await fetch(
        `https://inventorybackend-production-6c3c.up.railway.app/order/updateOrder/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ delivered: isChecked }),
          credentials: "include",
        }
      );
      
      if (!response.ok) throw new Error("Failed to update order status");
      
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, delivered: isChecked } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="mt-16 p-4">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(ordersPerPage)].map((_, index) => (
            <div key={index} className="bg-gray-200 animate-pulse h-[300px] rounded-lg"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {currentOrders.map((order) => (
              <div key={order._id} className="bg-white shadow-lg rounded-lg p-4 w-[300px]">
                <h2 className="font-bold text-lg">Order ID: {order._id}</h2>
                <p className="text-sm text-gray-500">Customer: {order.customerName}</p>
                <p className="text-sm">Product: {order.productID?.name || "N/A"}</p>
                <p className="text-sm">Qty: {order.quantity}</p>
                <p className="text-sm">Address: {order.address}</p>
                <p className="text-sm text-green-500">
                  <a href={`https://wa.me/${order.contact}`}>WhatsApp: {order.contact}</a>
                </p>
                <p className="text-sm">COD: {order.cod ? "Yes" : "No"}</p>
                <p className="text-sm">Worker: {order.workerID?.username || "Unknown"}</p>
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    checked={order.delivered}
                    onChange={(e) => handleDeliveredChange(order._id, e.target.checked)}
                    className="mr-2"
                  />
                  <label>Delivered</label>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersTable;