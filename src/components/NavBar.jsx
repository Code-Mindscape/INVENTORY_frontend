import { Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";

const NAV_LINKS = [
  { name: "Orders", href: "/admin/orders" },
  { name: "Inventory", href: "/admin/inventory" },
  { name: "New Worker", href: "/worker-register3543" },
];

function NavBar() {
  const [username, setUsername] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch(
          "https://inventorybackend-production-6c3c.up.railway.app/check-auth" || "http://localhost:5000/check-auth",
          { credentials: "include" }
        );

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
    <nav className="bg-gray-800 w-full fixed z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <h1 className="text-white text-xl font-bold">
            {username ? (
              <span className="text-white text-md font-medium">{username}</span>
            ) : (
              <span className="text-gray-400 text-sm">Not logged in</span>
            )}
          </h1>

          {/* Hamburger Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Navigation Links (Desktop) */}
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-green-900 py-2">
          <div className="px-4 space-y-2">
            {NAV_LINKS.map(({ name, href }) => (
              <a
                key={href}
                href={href}
                className="block text-gray-300 hover:bg-green-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
