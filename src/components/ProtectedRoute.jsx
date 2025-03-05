import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.VITE_BACKEND_URL}/check-auth` || "http://localhost:5000/check-auth", {
          credentials: "include",
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Error ${res.status}: Session validation failed`);

        const data = await res.json();
        
        if (isMounted) {
          if (data.authenticated) {
            localStorage.setItem("isAuthenticated", "true");
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("isAuthenticated");
            navigate("/", { replace: true });
          }
        }
      } catch (err) {
        if (err.name !== "AbortError" && isMounted) {
          console.error("Session check failed:", err);
          localStorage.removeItem("isAuthenticated");
          navigate("/", { replace: true });
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [navigate]);

  if (isAuthenticated === null) return <div>Loading...</div>;

  return children;
};

export default ProtectedRoute;
