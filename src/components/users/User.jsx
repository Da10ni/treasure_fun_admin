import {
  Search,
  Users,
  RefreshCw,
  User as UserIcon,
  Calendar,
  Eye,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [actionLoading, setActionLoading] = useState(null);
  const [detailsModal, setDetailsModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Filter users based on search and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchTerm ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active" &&
        (user.status === "active" || user.isActive)) ||
      (statusFilter === "disabled" &&
        (user.status === "disabled" || !user.isActive));

    return matchesSearch && matchesStatus;
  });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Authentication required. Please login again.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const response = await fetch(`${API_BASE}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
        throw new Error(`HTTP ${response.status}: Failed to fetch users`);
      }

      const data = await response.json();

      if (data.success) {
        const usersData = data.data.users || data.data;
        setUsers(usersData);

        toast.success(`👥 Loaded ${usersData.length} users successfully`, {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        throw new Error(data.message || "Failed to fetch users");
      }
    } catch (err) {
      setError(err.message);

      toast.error(`Failed to load users: ${err.message}`, {
        position: "top-right",
        autoClose: 5000,
      });

      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle user status
  const toggleUserStatus = async (userId, username) => {
    try {
      setActionLoading(userId);

      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Authentication required. Please login again.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const currentUser = users.find((u) => (u.id || u._id) === userId);
      const isCurrentlyActive =
        currentUser?.status === "active" || currentUser?.isActive;
      const action = isCurrentlyActive ? "Disabling" : "Enabling";

      // Show loading toast
      const loadingToast = toast.loading(`${action} user ${username}...`, {
        position: "top-right",
      });

      const response = await fetch(
        `${API_BASE}/auth/users/${userId}/toggle-status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.", {
            position: "top-right",
            autoClose: 5000,
          });
          return;
        }
        throw new Error(
          `HTTP ${response.status}: Failed to toggle user status`
        );
      }

      const data = await response.json();

      if (data.success) {
        // Refresh the users list
        await fetchUsers();

        const newStatus = data.data.isActive ? "enabled" : "disabled";
        const statusEmoji = data.data.isActive ? "✅" : "❌";

        toast.success(
          `${statusEmoji} User ${username} ${newStatus} successfully!`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      } else {
        throw new Error(data.message || "Failed to toggle user status");
      }
    } catch (err) {
      toast.error(`❌ Error updating user: ${err.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Error toggling user status:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle view user details
  const handleViewDetails = async (userId) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Authentication required. Please login again.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading("Loading user details...", {
        position: "top-right",
      });

      const response = await fetch(`${API_BASE}/auth/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDetailsModal(data.data);

          toast.success("📋 User details loaded", {
            position: "top-right",
            autoClose: 1500,
          });
        } else {
          // If API doesn't support individual user fetch, use data from the list
          const user = users.find((u) => (u.id || u._id) === userId);
          if (user) {
            setDetailsModal(user);

            toast.success("📋 User details loaded", {
              position: "top-right",
              autoClose: 1500,
            });
          } else {
            throw new Error("User not found");
          }
        }
      } else {
        // If API doesn't support individual user fetch, use data from the list
        const user = users.find((u) => (u.id || u._id) === userId);
        if (user) {
          setDetailsModal(user);

          toast.success("📋 User details loaded", {
            position: "top-right",
            autoClose: 1500,
          });
        } else {
          throw new Error("User details not available");
        }
      }
    } catch (err) {
      toast.error(`❌ Failed to load user details: ${err.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Error fetching user details:", err);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value) {
      toast.info(`🔍 Searching for: ${value}`, {
        position: "top-right",
        autoClose: 1500,
      });
    }
  };

  // Handle filter change
  const handleFilterChange = (status) => {
    setStatusFilter(status);
    const filterText = status ? `"${status}"` : "all";
    toast.info(`📊 Filtering by ${filterText} users`, {
      position: "top-right",
      autoClose: 1500,
    });
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
        <button
          onClick={() => {
            toast.info("Retrying...", {
              position: "top-right",
              autoClose: 1000,
            });
            fetchUsers();
          }}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 p-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Total: {users.length} users • Filtered: {filteredUsers.length}
                </p>
              </div>
              <button
                onClick={() => {
                  toast.info("Refreshing users...", {
                    position: "top-right",
                    autoClose: 1000,
                  });
                  fetchUsers();
                }}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm transition-colors"
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by username or email..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="">All Status</option>
                <option value="active">Active Only</option>
                <option value="disabled">Disabled Only</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referrals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <UserIcon className="mx-auto h-12 w-12" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No users found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchTerm || statusFilter
                            ? "Try adjusting your search or filter criteria."
                            : "No users have been created yet."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id || user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        #{(user.id || user._id).slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user.username?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {formatDate(user.joinDate || user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === "active" || user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status ||
                            (user.isActive ? "active" : "disabled")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">
                            Count:{" "}
                            {user.referralCount ||
                              (user.referredUsers
                                ? user.referredUsers.length
                                : 0)}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            Code: {user.myReferralCode || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                        <button
                          onClick={() =>
                            toggleUserStatus(user.id || user._id, user.username)
                          }
                          disabled={actionLoading === (user.id || user._id)}
                          className={`px-3 py-1 text-white rounded text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            user.status === "active" || user.isActive
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {actionLoading === (user.id || user._id)
                            ? "Processing..."
                            : user.status === "active" || user.isActive
                            ? "Disable"
                            : "Enable"}
                        </button>
                        <button
                          onClick={() => handleViewDetails(user.id || user._id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {detailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  User Details
                </h3>
                <button
                  onClick={() => {
                    setDetailsModal(null);
                    toast.info("Closed user details", {
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
                      User ID
                    </label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">
                      #{detailsModal.id || detailsModal._id}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {detailsModal.username}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {detailsModal.email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <span
                      className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        detailsModal.status === "active" ||
                        detailsModal.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {detailsModal.status ||
                        (detailsModal.isActive ? "active" : "disabled")}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Join Date
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(
                        detailsModal.joinDate || detailsModal.createdAt
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Referral Code
                    </label>
                    <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                      {detailsModal.myReferralCode || "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Referral Count
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {detailsModal.referralCount ||
                        (detailsModal.referredUsers
                          ? detailsModal.referredUsers.length
                          : 0)}{" "}
                      users
                    </p>
                  </div>

                  {detailsModal.referredBy && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Referred By
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {detailsModal.referredBy}
                      </p>
                    </div>
                  )}

                  {detailsModal.lastLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Last Login
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(detailsModal.lastLogin)}
                      </p>
                    </div>
                  )}

                  {detailsModal.totalDeposits && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Total Deposits
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        ${detailsModal.totalDeposits}
                      </p>
                    </div>
                  )}

                  {detailsModal.totalWithdrawals && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Total Withdrawals
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        ${detailsModal.totalWithdrawals}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => {
                    toggleUserStatus(
                      detailsModal.id || detailsModal._id,
                      detailsModal.username
                    );
                    setDetailsModal(null);
                  }}
                  className={`px-4 py-2 text-white rounded transition-colors ${
                    detailsModal.status === "active" || detailsModal.isActive
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {detailsModal.status === "active" || detailsModal.isActive
                    ? "Disable User"
                    : "Enable User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default User;
