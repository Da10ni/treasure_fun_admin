import React from "react";
import { User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function AdminProfileDropdown({ isOpen, onClose, setActiveTab }) {
  const navigate = useNavigate();
  const api_base = import.meta.env.VITE_API_BASE_URL

  const handleOption = async (option) => {
    if (option === "Update Profile") {
      toast.info("Redirecting to update profile...", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/update-profile");
    } else if (option === "Logout") {
      await handleLogout(); // Centralized logout
    }
  
    onClose(); // close dropdown
  };
  
  const handleLogout = async () => {
  
    // Show loading toast
    const loadingToast = toast.loading("Logging out...", {
      position: "top-right",
    });
  
    try {
      const token = localStorage.getItem("authToken");
  
      const response = await fetch(`${api_base}/admin/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
  
      const data = await response.json();
  
      // Dismiss loading
      toast.dismiss(loadingToast);
  
      if (data.success) {
        toast.success("Logged out successfully! 👋", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
  
        // Clear storage
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("adminData");
  
        setActiveTab && setActiveTab("dashboard");
  
        console.log("Logout successful");
  
        // Delay for toast then navigate
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.error(data.message || "Logout failed!", {
          position: "top-right",
          autoClose: 5000,
        });
  
        console.error("Logout API failed:", data.message);
        navigate("/login"); // still redirect
      }
    } catch (error) {
      toast.dismiss(loadingToast);
  
      toast.error("Logout failed! Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
  
      console.error("Logout error:", error.message);
      navigate("/login"); // still redirect
    } finally {
      setIsLoggingOut(false);
    }
  };
  

  if (!isOpen) return null;

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  return (
    <>
      <div className="absolute right-0 top-14 z-10 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.username?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">
                {user?.username || "Admin"}
              </div>
              <div className="text-xs text-gray-500">
                {user?.email || "admin@example.com"}
              </div>
            </div>
          </div>
        </div>

        <div className="py-1">
          <button
            onClick={() => handleOption("Logout")}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 hover:text-red-600"
          >
            <LogOut className="w-4 h-4 mr-3 text-gray-500" />
            <span>Log out</span>
          </button>
        </div>
      </div>

      {/* Backdrop to close dropdown on outside click */}
      <div className="fixed inset-0 z-0" onClick={onClose} />
    </>
  );
}

export default AdminProfileDropdown;
