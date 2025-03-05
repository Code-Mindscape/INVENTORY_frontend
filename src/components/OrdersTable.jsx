import React, { useEffect, useState } from "react";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

      const responseText = await response.text();
      console.log("Raw Response:", responseText);

      try {
        const responseData = JSON.parse(responseText);
        if (!response.ok) {
          console.error("Server Response:", responseData);
          throw new Error(
            `Failed to update order status: ${
              responseData.message || "Unknown error"
            }`
          );
        }

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, delivered: isChecked } : order
          )
        );
      } catch (jsonError) {
        console.error("Response is not JSON. Possible authentication issue.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="overflow-auto mt-16 p-4">
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="w-full">
          <table className="table table-md w-full min-w-[600px]">
            <thead>
              <tr className="bg-gray-100 text-gray-800 text-xs sm:text-sm">
                <th>#</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Address</th>
                <th>Contact</th>
                <th>COD</th>
                <th>Description</th>
                <th>Delivered</th>
                <th>Worker Name</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {orders.map((order, index) => (
                <tr key={index} className="border-b">
                  <td className="px-2 py-1">{index + 1}</td>
                  <td className="px-2 py-1 break-words whitespace-normal">
                    {order.customerName}
                  </td>
                  <td className="px-2 py-1 break-words whitespace-normal">
                    {order.productID?.name || "N/A"}
                  </td>
                  <td className="px-2 py-1">{order.quantity}</td>
                  <td className="px-2 py-1 break-words whitespace-normal">
                    {order.address}
                  </td>
                  <td className="px-2 py-1">
                    <a
                      href={`https://wa.me/${order.contact}`}
                      className="text-green-500 break-words whitespace-normal"
                    >
                      {order.contact} (WhatsApp)
                    </a>
                  </td>
                  <td className="px-2 py-1">{order.cod ? "Yes" : "No"}</td>
                  <td className="px-2 py-1 break-words whitespace-normal">
                    {order.description || "N/A"}
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={order.delivered}
                      onChange={(e) =>
                        handleDeliveredChange(order._id, e.target.checked)
                      }
                    />
                  </td>
                  <td className="px-2 py-1 break-words whitespace-normal">
                    {order.workerID?.username || "Unknown Worker"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
