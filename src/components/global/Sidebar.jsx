import { Activity, ArrowDownLeft, ArrowUpRight, Gift, LogOut, Menu, PackageCheck, Users } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className={`${sidebarOpen ? 'w-64 absolute md:sticky top-0' : 'w-20'} h-screen bg-indigo-800 text-white transition-all duration-300 ease-in-out flex flex-col`}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-indigo-700">
        {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-md hover:bg-indigo-700"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link to={"/"}
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-700 transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-700' : ''}`}
            >
              <Activity size={20} />
              {sidebarOpen && <span className="ml-3">Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link to={"/deposits"}
              onClick={() => setActiveTab('deposits')}
              className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-700 transition-colors ${activeTab === 'deposits' ? 'bg-indigo-700' : ''}`}
            >
              <ArrowDownLeft size={20} />
              {sidebarOpen && <span className="ml-3">Deposit Verification</span>}
            </Link>
          </li>
          <li>
            <Link to={"/withdrawals"}
              onClick={() => setActiveTab('withdrawals')}
              className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-700 transition-colors ${activeTab === 'withdrawals' ? 'bg-indigo-700' : ''}`}
            >
              <ArrowUpRight size={20} />
              {sidebarOpen && <span className="ml-3">Withdrawals</span>}
            </Link>
          </li>
          <li>
            <Link to={"/users"}
              onClick={() => setActiveTab('users')}
              className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-700 transition-colors ${activeTab === 'users' ? 'bg-indigo-700' : ''}`}
            >
              <Users size={20} />
              {sidebarOpen && <span className="ml-3">User Management</span>}
            </Link>
          </li>
          <li>
            <Link to={"/packages"}
              onClick={() => setActiveTab('packages')}
              className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-700 transition-colors ${activeTab === 'packages' ? 'bg-indigo-700' : ''}`}
            >
              <PackageCheck size={20} />
              {sidebarOpen && <span className="ml-3">Packages</span>}
            </Link>
          </li>
          <li>
            <Link to={"/referrals"}
              onClick={() => setActiveTab('referrals')}
              className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-700 transition-colors ${activeTab === 'referrals' ? 'bg-indigo-700' : ''}`}
            >
              <Gift size={20} />
              {sidebarOpen && <span className="ml-3">Referral Settings</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-indigo-700">
        <button className="flex items-center w-full p-2 rounded-md hover:bg-indigo-700 transition-colors">
          <LogOut size={20} />
          {sidebarOpen && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>

  )
}

export default Sidebar