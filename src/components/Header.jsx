import { Bell, Search, User } from 'lucide-react'

const Header = ({ activeTab }) => {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 left-0 z-50">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    <h2 className="text-xl font-semibold">
                        {activeTab === 'dashboard' && 'Dashboard Overview'}
                        {activeTab === 'deposits' && 'Deposit Verification'}
                        {activeTab === 'withdrawals' && 'Withdrawal Management'}
                        {activeTab === 'users' && 'User Management'}
                        {activeTab === 'packages' && 'Package Management'}
                        {activeTab === 'referrals' && 'Referral Settings'}
                    </h2>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <button className="relative p-2 text-gray-500 hover:text-gray-700">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                            <User size={16} />
                        </div>
                        <span className="ml-2 font-medium text-gray-700">Admin</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
