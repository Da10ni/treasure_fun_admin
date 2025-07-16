import React from 'react'

const WithdrawalsPage = () => {
    const recentWithdrawals = [
        { id: 101, user: 'emma_wilson', amount: '$320.00', date: '2025-07-15', status: 'completed' },
        { id: 102, user: 'david_brown', amount: '$1,500.00', date: '2025-07-14', status: 'processing' },
        { id: 103, user: 'emma_david', amount: '$320.00', date: '2025-07-15', status: 'completed' },
        { id: 104, user: 'walter_key', amount: '$1,500.00', date: '2025-07-14', status: 'processing' },
        { id: 105, user: 'emma_watson', amount: '$320.00', date: '2025-07-15', status: 'completed' },
        { id: 106, user: 'david_schwimzer', amount: '$1,500.00', date: '2025-07-14', status: 'processing' },
      ];
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="p-4 border-b border-gray-200">
      <h3 className="font-semibold">Withdrawal Management</h3>
      <p className="text-sm text-gray-500 mt-1">Manage withdrawal requests</p>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {recentWithdrawals.map((withdrawal) => (
            <tr key={withdrawal.id}>
              <td className="px-6 py-4 whitespace-nowrap">{withdrawal.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{withdrawal.user}</td>
              <td className="px-6 py-4 whitespace-nowrap">{withdrawal.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap">{withdrawal.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  withdrawal.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {withdrawal.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                {withdrawal.status === 'processing' && (
                  <>
                    <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Approve</button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Reject</button>
                  </>
                )}
                <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="p-4 border-t border-gray-200 flex justify-between items-center">
      <div className="text-sm text-gray-500">Showing 2 of 2 entries</div>
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">Previous</button>
        <button className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">1</button>
        <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">Next</button>
      </div>
    </div>
  </div>
  )
}

export default WithdrawalsPage