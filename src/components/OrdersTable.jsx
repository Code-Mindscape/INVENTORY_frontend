import React, { useEffect, useState } from "react";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch orders with search
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

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchOrders(currentPage, searchQuery);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [currentPage, searchQuery]);

  const handleDeliveredChange = async (orderId, delivered) => {
    try {
      const response = await fetch(
        `https://inventorybackend-production-6c3c.up.railway.app/order/updateOrder/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ delivered }),
        }
      );
      if (response.ok) {
        fetchOrders(currentPage, searchQuery);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="p-6 mt-16">
      {/* Search Bar */}
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
            <div
              key={i}
              className="h-80 bg-gray-200 animate-pulse rounded-xl"
            ></div>
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
                {/* Image Box */}
                <div className="w-full h-44 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                  {order.productID?.imageUrl ? (
                    <img
                      src={order.productID.imageUrl}
                      alt={order.productID?.name || "Product"}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  ) : (
                    "No Image"
                  )}
                </div>
                <h2 className="text-xl font-bold text-green-800 mt-3">
                  Order ID: {order._id}
                </h2>
                <p className="text-gray-700 text-sm font-medium">
                  Customer: {order.customerName}
                </p>
                <p className="text-gray-700 text-sm">
                  Product: {order.productID?.name}
                </p>
                <p className="text-gray-700 text-sm">
                  Size: {order.productID?.size}
                </p>
                <p className="text-gray-700 text-sm">
                  Color: {order.productID?.color}
                </p>
                <p className="text-gray-700 text-sm">Qty: {order.quantity}</p>
                <p className="text-gray-700 text-sm">Date: {order.dateAdded}</p>
                <p
                  className={`text-sm font-semibold ${
                    order.delivered ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Status: {order.delivered ? "Delivered" : "Pending"}
                </p>
                <label className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={order.delivered}
                    onChange={(e) =>
                      handleDeliveredChange(order._id, e.target.checked)
                    }
                  />
                  <span className="ml-2 text-gray-700">Mark as Delivered</span>
                </label>
                <div className="bg-gray-100 p-3 mt-2 rounded-lg border border-gray-300 text-gray-700 text-sm break-words max-h-32 overflow-auto">
                  <strong>Address:</strong> {order.address}
                </div>
                <p className="text-gray-700 text-sm mt-2">
                  Contact:{" "}
                  <a
                    href={`https://wa.me/${order.contact}`}
                    className="text-blue-600 underline"
                  >
                    {order.contact}
                  </a>
                </p>
                <p className="text-gray-700 text-sm">COD: {order.cod}</p>
                <p className="text-gray-700 text-sm">
                  Worker: {order.workerID?.username || "Unknown"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No orders found.
            </p>
          )}
        </div>
      )}

      {/* Pagination Controls */}
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
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersTable;
