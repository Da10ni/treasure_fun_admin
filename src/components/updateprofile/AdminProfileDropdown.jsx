import React from "react";
import { User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure axios is installed

function AdminProfileDropdown({ isOpen, onClose, setActiveTab }) {
  const navigate = useNavigate();

  const handleOption = async (option) => {
    if (option === "Update Profile") {
      alert("Update Profile clicked");
      navigate("/update-profile");
    } else if (option === "Logout") {
      alert("Logout clicked");

      try {
        const response = await axios.post(
          "http://localhost:3006/api/admin/logout",
          {},
          { withCredentials: true }
        );
        if (response.data.success) {
          // Optionally clear localStorage/session
          localStorage.removeItem("user");
          localStorage.removeItem("authToken"); // or any other stored data
          console.log("Logged out successfully");

          navigate("/login"); // Redirect to login
        } else {
          console.error("Logout failed:", response.data.message);
        }
      } catch (error) {
        console.error("Logout error:", error.message);
      }
    }

    onClose(); // close the dropdown regardless of what was clicked
  };

  if (!isOpen) return null;

  const userString = localStorage.getItem("user");
  const user = JSON.parse(userString);

  return (
    <>
      <div className="absolute right-0 top-14 z-10 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              A
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">
                {user?.username}
              </div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
          </div>
        </div>

        <div className="py-1">
          <Link
            to={`/update-profile/${user?._id}`}
            onClick={() => setActiveTab("update-profile")}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
          >
            <User className="w-4 h-4 mr-3 text-gray-500" />
            <span>Update Profile</span>
          </Link>

          <button
            onClick={() => handleOption("Logout")}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
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
