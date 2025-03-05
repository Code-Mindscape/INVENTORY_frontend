import React, { useEffect, useState } from "react";
import AddOrder from "./AddOrder";

const WorkerOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `https://inventorybackend-production-6c3c.up.railway.app/order/my-orders` || 
          "http://localhost:5000/order/my-orders",
          { credentials: "include" }
        );
        const data = await response.json();
        if (Array.isArray(data.myOrders)) {
          setOrders(data.myOrders);
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

  return (
    <div className="overflow-x-auto mt-16">
      {/* Modal for Adding Orders */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <AddOrder
              onClose={() => setIsModalOpen(false)}
              onOrderAdded={() => window.location.reload()} // Refresh orders after adding
            />
          </div>
        </div>
      )}

      {/* Add Order Button */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md"
          onClick={() => setIsModalOpen(true)}
        >
          Add Order
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <table className="table table-md w-full">
          <thead>
            <tr className="text-black">
              <th>#</th>
              <th>Customer</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Address</th>
              <th>Contact</th>
              <th>COD</th>
              <th>Description</th>
              <th>Delivered</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="text-black">
                <th>{index + 1}</th>
                <td>{order.customerName}</td>
                <td>{order.productID.name}</td>
                <td>{order.quantity}</td>
                <td>{order.address}</td>
                <td>
                  <a href={`https://wa.me/${order.contact}`} className="text-black">
                    {order.contact} <span className="text-green-500">WhatsApp</span>
                  </a>
                </td>
                <td>{order.cod}</td>
                <td>{order.description}</td>
                <td>{order.delivered ? "✔" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WorkerOrdersTable;
