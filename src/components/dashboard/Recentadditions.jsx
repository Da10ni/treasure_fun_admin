import React from "react";
import { useNavigate } from "react-router-dom";

const Recentadditions = ({ data, name }) => {
  const navigate = useNavigate()
  // Function to get status color
  const handleViewAll = () =>{

    if (name.toLowerCase().includes("deposit")) {
      navigate("/deposits");
    } else if (name.toLowerCase().includes("withdrawal")) {
      navigate("/withdrawals");
    }
  }
  const getStatusColor = (status) => {
    
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-300 flex justify-between items-center">
        <h3 className="font-semibold">{name}</h3>
        <button onClick={handleViewAll}
         className="text-sm text-indigo-600 hover:text-indigo-900">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
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
            
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data && data.length > 0 ? (
              data.map((deposit) => (
                <tr key={deposit.id || deposit._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {deposit.user || (deposit.userId && deposit.userId.email) || deposit.email || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {typeof deposit.amount === 'number' ? `$${deposit.amount.toLocaleString()}` : deposit.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {deposit.date || new Date(deposit.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(deposit.status)}`}>
                      {deposit.status}
                    </span>
                  </td>
                 
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Recentadditions;