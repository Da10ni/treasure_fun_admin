import React, { useState } from "react";
import { Bell, Search } from "lucide-react";
import AdminProfileDropdown from "../updateprofile/AdminProfileDropdown";
import { useLocation } from "react-router-dom";

const Header = ({ activeTab, setActiveTab }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 left-0 z-50">
      <div className="flex items-center justify-between p-4 relative">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold">
            {activeTab === "update-profile" && "Update Profile"}
            {activeTab === "dashboard" && "Dashboard Overview"}
            {activeTab === "deposits" && "Deposit Verification"}
            {activeTab === "withdrawals" && "Withdrawal Management"}
            {activeTab === "users" && "User Management"}
            {activeTab === "packages" && "Package Management"}
            {activeTab === "referrals" && "Referral Settings"}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          <button className="relative p-2 text-gray-500 hover:text-gray-700">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Admin Button */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-2">
                A
              </div>
              <span className="ml-2 font-medium text-gray-700">Admin</span>
            </button>

            {/* Dropdown */}
            <AdminProfileDropdown
              isOpen={dropdownOpen}
              onClose={() => setDropdownOpen(false)}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
