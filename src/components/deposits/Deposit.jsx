import React, { useState, useEffect } from "react";
import { Eye, Check, X, RefreshCw, Calendar, DollarSign, User, Package } from "lucide-react";

const Deposit = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Fetch deposits from API
  const fetchDeposits = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/deposits`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch deposits");
      }

      const data = await response.json();

      if (data.success) {
        setDeposits(data.data.deposits || data.data);
      } else {
        throw new Error(data.message || "Failed to fetch deposits");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching deposits:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle approve deposit
  const handleApprove = async (depositId) => {
    try {
      setActionLoading(depositId);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE}/deposits/${depositId}/approve`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approvedBy: localStorage.getItem('userId') || 'admin',
          notes: 'Approved via admin panel'
        })
      });

      const data = await response.json();

      if (data.success) {
        // Refresh deposits
        fetchDeposits();
        alert('Deposit approved successfully!');
      } else {
        throw new Error(data.message || 'Failed to approve deposit');
      }
    } catch (err) {
      alert('Error approving deposit: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle reject deposit
  const handleReject = async (depositId) => {
    const reason = prompt('Please enter rejection reason:');
    if (!reason) return;

    try {
      setActionLoading(depositId);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE}/deposits/${depositId}/reject`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rejectedBy: localStorage.getItem('userId') || 'admin',
          reason: reason
        })
      });

      const data = await response.json();

      if (data.success) {
        // Refresh deposits
        fetchDeposits();
        alert('Deposit rejected successfully!');
      } else {
        throw new Error(data.message || 'Failed to reject deposit');
      }
    } catch (err) {
      alert('Error rejecting deposit: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle view details
  const handleViewDetails = async (depositId) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE}/deposits/${depositId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setSelectedDeposit(data.data);
        setShowDetailModal(true);
      } else {
        throw new Error(data.message || 'Failed to fetch deposit details');
      }
    } catch (err) {
      alert('Error fetching deposit details: ' + err.message);
    }
  };

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
    fetchDeposits(1, status);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchDeposits(page, filterStatus);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Initial load
  useEffect(() => {
    fetchDeposits();
  }, []);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Deposit Management
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Total: {deposits.length} deposits
              </p>
            </div>
            <button
              onClick={() => fetchDeposits()}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>Error: {error}</p>
              <button
                onClick={() => fetchDeposits()}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
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
                      Product
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
                  {deposits.map((deposit) => (
                    <tr key={deposit._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                        #{deposit._id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {deposit.userId?.name || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {deposit.userId?.email || ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <div className="text-sm text-gray-900">
                            {deposit.productId?.title || 'Unknown Product'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          ${deposit.amount?.toLocaleString() || '0'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {formatDate(deposit.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(deposit.status)}`}>
                          {deposit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                        {deposit.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(deposit._id)}
                              disabled={actionLoading === deposit._id}
                              className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                            >
                              <Check className="w-3 h-3" />
                              {actionLoading === deposit._id ? '...' : 'Approve'}
                            </button>
                            <button 
                              onClick={() => handleReject(deposit._id)}
                              disabled={actionLoading === deposit._id}
                              className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                            >
                              <X className="w-3 h-3" />
                              {actionLoading === deposit._id ? '...' : 'Reject'}
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleViewDetails(deposit._id)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          <Eye className="w-3 h-3" />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {deposits.length === 0 && (
                <div className="text-center py-12">
                  <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No deposits found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No deposits have been created yet.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedDeposit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Deposit Details</h3>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Deposit ID</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">#{selectedDeposit._id}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDeposit.userId?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{selectedDeposit.userId?.email || ''}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDeposit.productId?.title || 'Unknown Product'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <p className="mt-1 text-lg font-semibold text-green-600">${selectedDeposit.amount?.toLocaleString() || '0'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedDeposit.status)}`}>
                      {selectedDeposit.status}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created At</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedDeposit.createdAt)}</p>
                  </div>

                  {selectedDeposit.referredBy && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Referred By</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDeposit.referredBy}</p>
                    </div>
                  )}
                </div>

                {/* Attachment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Proof</label>
                  {selectedDeposit.attachment ? (
                    <div className="border rounded-lg overflow-hidden">
                      <img 
                        src={selectedDeposit.attachment} 
                        alt="Payment proof" 
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-2 bg-gray-50">
                        <a 
                          href={selectedDeposit.attachment} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Full Size
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No attachment uploaded</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              {selectedDeposit.status === 'pending' && (
                <div className="mt-6 flex gap-3 justify-end">
                  <button 
                    onClick={() => {
                      handleReject(selectedDeposit._id);
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => {
                      handleApprove(selectedDeposit._id);
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Deposit;