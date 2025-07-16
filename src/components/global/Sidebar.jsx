import React from "react";

const  Sidebar=() =>{
return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-indigo-800 text-white transition-all duration-300 ease-in-out flex flex-col`}>
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
              <button 
                onClick={() => setActiveTab('dashboard')} 
                className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-700 transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-700' : ''}`}
              >
                <Activity size={20} />
                {sidebarOpen && <span className="ml-3">Dashboard</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('deposits')} 
                className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-700 transition-colors ${activeTab === 'deposits' ? 'bg-indigo-700' : ''}`}
              >
                <ArrowDownLeft size={20} />
                {sidebarOpen && <span className="ml-3">Deposit Verification</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('withdrawals')} 
                className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-700 transition-colors ${activeTab === 'withdrawals' ? 'bg-indigo-700' : ''}`}
              >
                <ArrowUpRight size={20} />
                {sidebarOpen && <span className="ml-3">Withdrawals</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('users')} 
                className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-700 transition-colors ${activeTab === 'users' ? 'bg-indigo-700' : ''}`}
              >
                <Users size={20} />
                {sidebarOpen && <span className="ml-3">User Management</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('packages')} 
                className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-700 transition-colors ${activeTab === 'packages' ? 'bg-indigo-700' : ''}`}
              >
                <PackageCheck size={20} />
                {sidebarOpen && <span className="ml-3">Packages</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('referrals')} 
                className={`flex items-center w-full p-2 rounded-md hover:bg-indigo-700 transition-colors ${activeTab === 'referrals' ? 'bg-indigo-700' : ''}`}
              >
                <Gift size={20} />
                {sidebarOpen && <span className="ml-3">Referral Settings</span>}
              </button>
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