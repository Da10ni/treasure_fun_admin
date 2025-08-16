import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  ImageIcon,
  LogOut,
  Menu,
  PackageCheck,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem("authToken");

      // Call the logout API endpoint
      const response = await fetch(`${API_BASE}/admin/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token if your backend requires it
        },
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        localStorage.removeItem("adminData");

        setActiveTab("dashboard");

        console.log("Logout successful");

        navigate("/login");
      } else {
        console.error("Logout API failed:", data.message);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserInfo = () => {
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        return user;
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
    return null;
  };

  const user = getUserInfo();

  return (
    <div
      className={`${
        sidebarOpen ? "w-64 absolute md:sticky top-0 z-60" : "w-20"
      } h-screen bg-gray-100 text-black shadow-lg transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-indigo-200">
        {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
        <Link
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-md hover:bg-gray-200"
        >
          <Menu size={20} />
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to={"/"}
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-200 transition-colors ${
                activeTab === "dashboard" ? "bg-white text-black" : ""
              }`}
            >
              <Activity size={20} />
              {sidebarOpen && <span className="ml-3">Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              to={"/deposits"}
              onClick={() => setActiveTab("deposits")}
              className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-200 transition-colors ${
                activeTab === "deposits" ? "bg-white text-black" : ""
              }`}
            >
              <ArrowDownLeft size={20} />
              {sidebarOpen && (
                <span className="ml-3">Deposit Verification</span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to={"/withdrawals"}
              onClick={() => setActiveTab("withdrawals")}
              className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-200 transition-colors ${
                activeTab === "withdrawals" ? "bg-white text-black" : ""
              }`}
            >
              <ArrowUpRight size={20} />
              {sidebarOpen && <span className="ml-3">Withdrawals</span>}
            </Link>
          </li>
          <li>
            <Link
              to={"/users"}
              onClick={() => setActiveTab("users")}
              className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-200 transition-colors ${
                activeTab === "users" ? "bg-white text-black" : ""
              }`}
            >
              <Users size={20} />
              {sidebarOpen && <span className="ml-3">User Management</span>}
            </Link>
          </li>
          <li>
            <Link
              to={"/products"}
              onClick={() => setActiveTab("products")}
              className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-200 transition-colors ${
                activeTab === "products" ? "bg-white text-black" : ""
              }`}
            >
              <PackageCheck size={20} />
              {sidebarOpen && <span className="ml-3">Products</span>}
            </Link>
          </li>
          <li>
            <Link
              to={"/referrals"}
              onClick={() => setActiveTab("referrals")}
              className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-200 transition-colors ${
                activeTab === "referrals" ? "bg-white text-red" : ""
              }`}
            >
              <Gift size={20} />
              {sidebarOpen && <span className="ml-3">Referral Settings</span>}
            </Link>
          </li>
          <li>
            <Link
              to={"/images"}
              onClick={() => setActiveTab("images")}
              className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-200 transition-colors ${
                activeTab === "images" ? "bg-white text-red" : ""
              }`}
            >
              <ImageIcon size={20} />
              {sidebarOpen && <span className="ml-3">Hero Image</span>}
            </Link>
          </li>

          <li>
            <Link
              to={"/Notification "}
              onClick={() => setActiveTab("Notification")}
              className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-200 transition-colors ${
                activeTab === "images" ? "bg-white text-red" : ""
              }`}
            >
              <ImageIcon size={20} />
              {sidebarOpen && <span className="ml-3">Notfication</span>}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-indigo-200">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`flex items-center w-full p-2 rounded-md transition-colors ${
            isLoggingOut
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "hover:bg-indigo-200 hover:text-red-600"
          }`}
        >
          <LogOut size={20} />
          {sidebarOpen && (
            <span className="ml-3">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
