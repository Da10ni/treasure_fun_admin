import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const WithdrawalsPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [detailsModal, setDetailsModal] = useState(null);
  const token = localStorage.getItem("authToken");

  // Base URL for your API
  const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

  // Fetch all withdrawal requests (Admin view)
  const fetchWithdrawals = async (page = 1, status = "") => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        toast.error("Authentication required. Please login again.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(status && { status }),
      });

      const response = await fetch(`${API_BASE_URL}/withdrawals?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.", {
            position: "top-right",
            autoClose: 5000,
          });
          return;
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch withdrawals`);
      }

      const data = await response.json();

      if (data.success) {
        setWithdrawals(data.data.withdrawals);
        setPagination(data.data.pagination);
        setTotalPages(data.data.pagination.totalPages);
        setCurrentPage(data.data.pagination.currentPage);

        toast.success(
          `💰 Loaded ${data.data.withdrawals.length} withdrawal requests`,
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      } else {
        throw new Error(data.message || "Failed to fetch withdrawals");
      }
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to load withdrawals: ${err.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Fetch withdrawals error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Approve withdrawal
  const handleApprove = async (withdrawalId) => {
    try {
      setActionLoading(withdrawalId);

      if (!token) {
        toast.error("Authentication required. Please login again.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading("Approving withdrawal...", {
        position: "top-right",
      });

      const response = await fetch(
        `${API_BASE_URL}/withdrawals/${withdrawalId}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (data.success) {
        // Refresh the list
        await fetchWithdrawals(currentPage, statusFilter);

        toast.success("✅ Withdrawal approved successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        throw new Error(data.message || "Failed to approve withdrawal");
      }
    } catch (err) {
      toast.error(`❌ Failed to approve withdrawal: ${err.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Approve withdrawal error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Reject withdrawal
  const handleReject = async (withdrawalId) => {
    // Create a custom rejection modal
    const showRejectModal = () => {
      return new Promise((resolve) => {
        const modal = document.createElement("div");
        modal.className =
          "fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-100";
        modal.innerHTML = `
          <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div class="p-6">
              <h3 class="text-lg font-semibold mb-4 text-red-600">Reject Withdrawal</h3>
              <p class="text-gray-600 mb-4">Please provide a reason for rejecting this withdrawal request:</p>
              <textarea 
                id="reject-reason" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                rows="4" 
                placeholder="Enter rejection reason (e.g., Insufficient funds, Invalid wallet address, etc.)"
              ></textarea>
              <div class="flex gap-3 mt-6 justify-end">
                <button id="cancel-reject" class="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded">Cancel</button>
                <button id="confirm-reject" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Reject Withdrawal</button>
              </div>
            </div>
          </div>
        `;

        document.body.appendChild(modal);

        const cancelBtn = modal.querySelector("#cancel-reject");
        const confirmBtn = modal.querySelector("#confirm-reject");
        const reasonInput = modal.querySelector("#reject-reason");

        cancelBtn.onclick = () => {
          document.body.removeChild(modal);
          resolve(null);
        };

        confirmBtn.onclick = () => {
          const reason = reasonInput.value.trim();
          if (!reason) {
            toast.error("Please enter a rejection reason", {
              position: "top-right",
              autoClose: 3000,
            });
            return;
          }
          if (reason.length < 10) {
            toast.error("Rejection reason must be at least 10 characters", {
              position: "top-right",
              autoClose: 3000,
            });
            return;
          }
          document.body.removeChild(modal);
          resolve(reason);
        };

        reasonInput.focus();
      });
    };

    const reason = await showRejectModal();
    if (!reason) return;

    try {
      setActionLoading(withdrawalId);

      if (!token) {
        toast.error("Authentication required. Please login again.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading("Rejecting withdrawal...", {
        position: "top-right",
      });

      const response = await fetch(
        `${API_BASE_URL}/withdrawals/${withdrawalId}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason }),
        }
      );

      const data = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (data.success) {
        // Refresh the list
        await fetchWithdrawals(currentPage, statusFilter);

        toast.success("❌ Withdrawal rejected successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        throw new Error(data.message || "Failed to reject withdrawal");
      }
    } catch (err) {
      toast.error(`❌ Failed to reject withdrawal: ${err.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Reject withdrawal error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // View withdrawal details
  const handleViewDetails = async (withdrawalId) => {
    try {
      if (!token) {
        toast.error("Authentication required. Please login again.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading("Loading withdrawal details...", {
        position: "top-right",
      });

      const response = await fetch(
        `${API_BASE_URL}/withdrawals/${withdrawalId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (data.success) {
        setDetailsModal(data.data);

        toast.success("📄 Withdrawal details loaded", {
          position: "top-right",
          autoClose: 1500,
        });
      } else {
        throw new Error(data.message || "Failed to fetch withdrawal details");
      }
    } catch (err) {
      toast.error(`❌ Failed to load withdrawal details: ${err.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Fetch details error:", err);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      toast.info(`Loading page ${page}...`, {
        position: "top-right",
        autoClose: 1000,
      });
      fetchWithdrawals(page, statusFilter);
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);

    const filterText = status ? `"${status}"` : "all";
    toast.info(`Filtering by ${filterText} status...`, {
      position: "top-right",
      autoClose: 1500,
    });

    fetchWithdrawals(1, status);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Load data on component mount
  useEffect(() => {
    fetchWithdrawals();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <div className="text-gray-500 mt-4">Loading withdrawals...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Withdrawal Management</h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage withdrawal requests • Total: {pagination.totalItems || 0}
              </p>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Status</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={() => {
                  toast.info("Refreshing withdrawals...", {
                    position: "top-right",
                    autoClose: 1000,
                  });
                  fetchWithdrawals(currentPage, statusFilter);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm transition-colors"
                disabled={loading}
              >
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
              <button
                onClick={() => {
                  setError("");
                  fetchWithdrawals(currentPage, statusFilter);
                }}
                className="ml-2 text-red-800 underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}
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
                  Wallet ID
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
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <svg
                        className="mx-auto h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No withdrawals found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        No withdrawal requests match your current filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                withdrawals.map((withdrawal) => (
                  <tr key={withdrawal._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                      #{withdrawal._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {withdrawal.userId?.name || "Unknown User"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {withdrawal.userId?.email || "No email"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                      {formatCurrency(withdrawal.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                      {withdrawal.walletId
                        ? `...${withdrawal.walletId.slice(-8)}`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(withdrawal.requestDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          withdrawal.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : withdrawal.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {withdrawal.status.charAt(0).toUpperCase() +
                          withdrawal.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                      {withdrawal.status === "processing" && (
                        <>
                          <button
                            onClick={() => handleApprove(withdrawal._id)}
                            disabled={actionLoading === withdrawal._id}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === withdrawal._id
                              ? "Processing..."
                              : "Approve"}
                          </button>
                          <button
                            onClick={() => handleReject(withdrawal._id)}
                            disabled={actionLoading === withdrawal._id}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === withdrawal._id
                              ? "Processing..."
                              : "Reject"}
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
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing page {currentPage} of {totalPages} •{" "}
              {pagination.totalItems || 0} total entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i;
                if (pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      currentPage === pageNum
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {detailsModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-100">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Withdrawal Details</h3>
                <button
                  onClick={() => {
                    setDetailsModal(null);
                    toast.info("Closed withdrawal details", {
                      position: "top-right",
                      autoClose: 1000,
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Withdrawal ID
                    </label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">
                      #{detailsModal._id}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      User Information
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {detailsModal.userId?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {detailsModal.userId?.email || "No email"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Amount
                    </label>
                    <p className="mt-1 text-lg font-semibold text-green-600">
                      {formatCurrency(detailsModal.amount)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Wallet Address
                    </label>
                    <p className="mt-1 text-sm text-gray-900 font-mono break-all">
                      {detailsModal.walletId || "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <span
                      className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        detailsModal.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : detailsModal.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {detailsModal.status.charAt(0).toUpperCase() +
                        detailsModal.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Request Date
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(detailsModal.requestDate)}
                    </p>
                  </div>

                  {detailsModal.processedDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Processed Date
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(detailsModal.processedDate)}
                      </p>
                    </div>
                  )}

                  {detailsModal.rejectionReason && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Rejection Reason
                      </label>
                      <p className="mt-1 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                        {detailsModal.rejectionReason}
                      </p>
                    </div>
                  )}

                  {detailsModal.notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Notes
                      </label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                        {detailsModal.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {detailsModal.status === "processing" && (
                <div className="mt-6 flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      handleReject(detailsModal._id);
                      setDetailsModal(null);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(detailsModal._id);
                      setDetailsModal(null);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
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

export default WithdrawalsPage;
