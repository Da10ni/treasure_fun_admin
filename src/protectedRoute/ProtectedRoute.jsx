import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/axiosInstance";
import ClipLoader from "react-spinners/ClipLoader";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/admin/check-auth");
        if (res.data.success) {
          setIsAuth(true);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div className="h-screen w-full flex items-center justify-center">
    <ClipLoader color="#36d7b7" loading={loading} size={50} />
  </div>;
  if (isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;