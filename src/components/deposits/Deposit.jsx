import React from "react";

const Deposit = () => {
  const pendingDeposits = [
    {
      id: 1,
      user: "john_doe",
      amount: "$500.00",
      date: "2025-07-15",
      status: "pending",
    },
    {
      id: 2,
      user: "sarah_smith",
      amount: "$1,200.00",
      date: "2025-07-16",
      status: "pending",
    },
    {
      id: 3,
      user: "mike_jones",
      amount: "$750.00",
      date: "2025-07-16",
      status: "pending",
    },
  ];
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold">Deposit Verification</h3>
        <p className="text-sm text-gray-500 mt-1">Verify pending deposits</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pendingDeposits.map((deposit) => (
              <tr key={deposit.id}>
                <td className="px-6 py-4 whitespace-nowrap">{deposit.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{deposit.user}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {deposit.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{deposit.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    {deposit.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                  <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    Reject
                  </button>
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-200 flex justify-between items-center">
        <div className="text-sm text-gray-500">Showing 3 of 3 entries</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">
            Previous
          </button>
          <button className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">
            1
          </button>
          <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
