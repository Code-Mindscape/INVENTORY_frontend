import React, { useEffect, useState } from "react";

const WorkerInventoryTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/product/allProducts` || "http://localhost:5000/product/allProducts");
        const data = await response.json();

        if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("Unexpected API response format:", data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="overflow-x-auto mt-16">
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <table className="table table-md w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Size</th>
              <th>Color</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{item._id}</td>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.stock <= 0 ? "Out of Stock" : item.stock}</td>
                <td>{item.size}</td>
                <td>{item.color}</td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WorkerInventoryTable;
