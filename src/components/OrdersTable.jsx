import React, { useEffect, useState } from "react";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/order/allOrders` ||"http://localhost:5000/order/allOrders", {
          credentials: "include",
        });
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
      const response = await fetch(`${process.env.BACKEND_URL}/order/updateOrder/${orderId}` || `http://localhost:5000/order/updateOrder/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delivered: isChecked }),
        credentials: "include",
      });
  
      const responseText = await response.text(); // Read response as text
      console.log("Raw Response:", responseText); // Log raw response
  
      try {
        const responseData = JSON.parse(responseText); // Attempt to parse JSON
        if (!response.ok) {
          console.error("Server Response:", responseData);
          throw new Error(`Failed to update order status: ${responseData.message || "Unknown error"}`);
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
    <div className="overflow-x-auto mt-16 p-4">

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <table className="table table-md w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Address</th>
              <th>Contact</th>
              <th>COD</th>
              <th>Description</th>
              <th>Delivered</th>
              <th>Worker</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{order.customerName}</td>
                <td>{order.productID?.name || "N/A"}</td>
                <td>{order.quantity}</td>
                <td>{order.address}</td>
                <td>
                  <a href={`https://wa.me/${order.contact}`} className="text-green-500">
                    {order.contact} (WhatsApp)
                  </a>
                </td>
                <td>{order.cod ? "Yes" : "No"}</td>
                <td>{order.description || "N/A"}</td>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={order.delivered}
                    onChange={(e) => handleDeliveredChange(order._id, e.target.checked)}
                  />
                </td>
                <td>{order.workerID?.username || "Unknown Worker"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersTable;
