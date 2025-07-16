import { Search } from 'lucide-react'
import React from 'react'

const User = () => {
    const users = [
        { id: 1001, username: 'john_doe', email: 'john@example.com', status: 'active', joinDate: '2025-01-15' },
        { id: 1002, username: 'sarah_smith', email: 'sarah@example.com', status: 'active', joinDate: '2025-02-20' },
        { id: 1003, username: 'mike_jones', email: 'mike@example.com', status: 'disabled', joinDate: '2025-03-10' },
        { id: 1004, username: 'emma_wilson', email: 'emma@example.com', status: 'active', joinDate: '2025-04-05' },
        { id: 1005, username: 'david_brown', email: 'david@example.com', status: 'active', joinDate: '2025-05-12' },
      ];
    
  return (
    <div className="space-y-6 p-8">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">User Management</h3>
                    <p className="text-sm text-gray-500 mt-1">Enable or disable user accounts</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search users..." 
                        className="pl-10 pr-4 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <button className="px-4 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 flex items-center gap-2">
                      <span>Add User</span>
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{user.joinDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                            {user.status === 'active' ? (
                              <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Disable</button>
                            ) : (
                              <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Enable</button>
                            )}
                            <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                            <button className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-sm text-gray-500">Showing 5 of 5 entries</div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">Previous</button>
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">1</button>
                    <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">Next</button>
                  </div>
                </div>
              </div>
            </div>
  )
}

export default User