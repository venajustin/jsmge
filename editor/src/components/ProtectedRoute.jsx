import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null); // Track authorization status
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        console.log("No Token found");
        setIsAuthorized(false); // Redirect to login
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:5000/protected", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsAuthorized(true); // Token is valid
        } else {
          setIsAuthorized(false); // Token is invalid or expired
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsAuthorized(false); // Redirect to login on error
      }
    };

    verifyToken();
  }, [token]);

  // While the token is being verified, show a loading state
  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  // If not authorized, redirect to the login page
  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  // If authorized, render the child component
  return children;
};

export default ProtectedRoute;