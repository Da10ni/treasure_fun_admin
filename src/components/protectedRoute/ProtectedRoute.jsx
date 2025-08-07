import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ClipLoader from "react-spinners/ClipLoader";

const AdminProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("authToken");
        console.log("🔑 Checking token:", token);

        // No token found
        if (!token) {
          console.log("❌ No token found");
          setIsAuth(false);
          setLoading(false);
          return;
        }

        // Decode and check expiry
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        console.log("⏰ Token expires at:", new Date(decodedToken.exp * 1000));

        // Token expired
        if (decodedToken.exp < currentTime) {
          console.log("❌ Token expired - removing from storage");
          localStorage.removeItem("authToken");
          setIsAuth(false);
          setLoading(false);
          return;
        }

        // Token is valid
        console.log("✅ Token is valid");
        setIsAuth(true);
        setLoading(false);

      } catch (error) {
        console.error("❌ Token validation failed:", error);
        localStorage.removeItem("authToken");
        setIsAuth(false);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ClipLoader color="#dc2626" loading={loading} size={50} />
          <p className="mt-4 text-gray-600 font-medium">
            Verifying Access...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuth) {
    console.log("🔄 Access denied - redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Authenticated - render children
  console.log("✅ Access granted");
  return children;
};

export default AdminProtectedRoute;