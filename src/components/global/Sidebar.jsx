import { Activity, ArrowDownLeft, ArrowUpRight, Gift, LogOut, Menu, PackageCheck, Users } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const  Sidebar=({activeTab,setActiveTab}) =>{
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
    <div className={`${sidebarOpen ? 'w-64 absolute md:sticky top-0 z-60' : 'w-20'} h-screen bg-gray-100  text-black shadow-lg transition-all duration-300 ease-in-out flex flex-col`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-indigo-200">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <Link 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-1 rounded-md hover:bg-gray-200"
          >
            <Menu size={20} />
          </Link>
        </div>
        
        {/* Nav Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link to={"/"}
                onClick={() => setActiveTab('dashboard')} 
                className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-200 transition-colors ${activeTab === 'dashboard' ? 'bg-white text-black'  : ''}`}
              >
                <Activity size={20} />
                {sidebarOpen && <span className="ml-3">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link to={'/deposits'}
                onClick={() => setActiveTab('deposits')} 
                className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-200 transition-colors ${activeTab === 'deposits' ? 'bg-white text-black' : ''}`}
              >
                <ArrowDownLeft size={20} />
                {sidebarOpen && <span className="ml-3">Deposit Verification</span>}
              </Link>
            </li>
            <li>
              <Link to={'/withdrawals'}
                onClick={() => setActiveTab('withdrawals')} 
                className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-200 transition-colors ${activeTab === 'withdrawals' ? 'bg-white text-black': ''}`}
              >
                <ArrowUpRight size={20} />
                {sidebarOpen && <span className="ml-3">Withdrawals</span>}
              </Link>
            </li>
            <li>
              <Link to={'/users'}
                onClick={() => setActiveTab('users')} 
                className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-200 transition-colors ${activeTab === 'users' ?'bg-white text-black' : ''}`}
              >
                <Users size={20} />
                {sidebarOpen && <span className="ml-3">User Management</span>}
              </Link>
            </li>
            <li>
              <Link to={'/packages'}
                onClick={() => setActiveTab('packages')} 
                className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-200 transition-colors ${activeTab === 'packages' ? 'bg-white text-black' : ''}`}
              >
                <PackageCheck size={20} />
                {sidebarOpen && <span className="ml-3">Packages</span>}
              </Link>
            </li>
            <li>
              <Link to={"/referrals"}
                onClick={() => setActiveTab('referrals')} 
                className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-200 transition-colors ${activeTab === 'referrals' ? 'bg-white text-black' : ''}`}
              >
                <Gift size={20} />
                {sidebarOpen && <span className="ml-3">Referral Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* User Profile */}
        <div className="p-4 border-t border-indigo-200">
          <button className="flex items-center w-full p-2 rounded-md hover:bg-indigo-200 transition-colors">
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

  )
}

export default Sidebar