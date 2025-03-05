import React, { useEffect, useState } from "react";

const NAV_LINKS = [
  { name: "Orders", href: "/worker/orders" },
  { name: "Inventory", href: "/worker/inventory" },
];

function WorkerNavBar() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/check-auth` || "http://localhost:5000/check-auth", { credentials: "include" });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid JSON response from server");
        }
    
        const data = await response.json();
        if (data.authenticated && data.user?.username) {
          setUsername(data.user.username);
        }
      } catch (error) {
        console.error("Error fetching session data:", error.message);
      }
    };
    

    fetchUsername();
  }, []);

  return (
    <nav className="bg-gray-800 w-full fixed">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <h1 className="text-white text-xl font-bold">
          {username ? (
            <h1 className="text-white text-md font-medium">{username}</h1>
          ) : (
            <h1 className="text-gray-400 text-sm">Not logged in</h1>
          )}
          </h1>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-4">
            {NAV_LINKS.map(({ name, href }) => (
              <a
                key={href}
                href={href}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                {name}
              </a>
            ))}
          </div>          
        </div>
      </div>
    </nav>
  );
}

export default WorkerNavBar;
