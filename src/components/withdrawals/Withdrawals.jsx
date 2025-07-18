import React, { useState, useEffect } from 'react';

const WithdrawalsPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({});
  const [statusFilter, setStatusFilter] = useState('');
  
  // Base URL for your API
  const API_BASE_URL = 'http://localhost:3006/api'; // Adjust according to your backend URL

  // Fetch all withdrawal requests (Admin view)
  const fetchWithdrawals = async (page = 1, status = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(status && { status })
      });
      
      const response = await fetch(`${API_BASE_URL}/withdrawals/`);
      const data = await response.json();
      
      if (data.success) {
        setWithdrawals(data.data.withdrawals);
        setPagination(data.data.pagination);
        setTotalPages(data.data.pagination.totalPages);
        setCurrentPage(data.data.pagination.currentPage);
      } else {
        setError(data.message || 'Failed to fetch withdrawals');
      }
    } catch (err) {
      setError('Failed to fetch withdrawals');
      console.error('Fetch withdrawals error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Approve withdrawal
  const handleApprove = async (withdrawalId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/withdrawals/${withdrawalId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      
      if (data.success) {
        // Refresh the list
        fetchWithdrawals(currentPage, statusFilter);
        alert('Withdrawal approved successfully!');
      } else {
        alert('Failed to approve withdrawal: ' + data.message);
      }
    } catch (err) {
      alert('Failed to approve withdrawal: ' + err.message);
      console.error('Approve withdrawal error:', err);
    }
  };

  // Reject withdrawal
  const handleReject = async (withdrawalId) => {
    const reason = prompt('Please enter rejection reason:');
    if (!reason) return;

    try {
      const response = await fetch(`${API_BASE_URL}/withdrawals/${withdrawalId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason })
      });
      const data = await response.json();
      
      if (data.success) {
        // Refresh the list
        fetchWithdrawals(currentPage, statusFilter);
        alert('Withdrawal rejected successfully!');
      } else {
        alert('Failed to reject withdrawal: ' + data.message);
      }
    } catch (err) {
      alert('Failed to reject withdrawal: ' + err.message);
      console.error('Reject withdrawal error:', err);
    }
  };

  // View withdrawal details
  const handleViewDetails = async (withdrawalId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/withdrawals/${withdrawalId}`);
      const data = await response.json();
      
      if (data.success) {
        const withdrawal = data.data;
        alert(`Withdrawal Details:
        
ID: ${withdrawal._id}
User: ${withdrawal.userId.name} (${withdrawal.userId.email})
Amount: ${withdrawal.amount}
Wallet ID: ${withdrawal.walletId}
Status: ${withdrawal.status}
Request Date: ${new Date(withdrawal.requestDate).toLocaleDateString()}
${withdrawal.processedDate ? `Processed Date: ${new Date(withdrawal.processedDate).toLocaleDateString()}` : ''}
${withdrawal.rejectionReason ? `Rejection Reason: ${withdrawal.rejectionReason}` : ''}`);
      } else {
        alert('Failed to fetch withdrawal details: ' + data.message);
      }
    } catch (err) {
      alert('Failed to fetch withdrawal details: ' + err.message);
      console.error('Fetch details error:', err);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchWithdrawals(page, statusFilter);
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
    fetchWithdrawals(1, status);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Load data on component mount
  useEffect(() => {
    fetchWithdrawals();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-gray-500">Loading withdrawals...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Withdrawal Management</h3>
            <p className="text-sm text-gray-500 mt-1">Manage withdrawal requests</p>
          </div>
          
          {/* Status Filter */}
          <div className="flex gap-2">
            <select 
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Status</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <button 
              onClick={() => fetchWithdrawals(currentPage, statusFilter)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {withdrawals.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No withdrawal requests found
                </td>
              </tr>
            ) : (
              withdrawals.map((withdrawal) => (
                <tr key={withdrawal._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                    {withdrawal._id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium">{withdrawal.userId.name}</div>
                      <div className="text-sm text-gray-500">{withdrawal.userId.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    {formatCurrency(withdrawal.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                    {withdrawal.walletId ? withdrawal.walletId.slice(-8) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDate(withdrawal.requestDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      withdrawal.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : withdrawal.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                    {withdrawal.status === 'processing' && (
                      <>
                        <button 
                          onClick={() => handleApprove(withdrawal._id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(withdrawal._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleViewDetails(withdrawal._id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-200 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {pagination.itemsPerPage ? Math.min(pagination.itemsPerPage, pagination.totalItems) : 0} of {pagination.totalItems || 0} entries
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === pageNum 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalsPage;