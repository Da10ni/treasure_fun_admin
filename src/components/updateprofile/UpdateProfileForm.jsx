import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = "http://localhost:3006/api/admin";

const UpdateProfileForm = ({ onSave, onCancel }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [walletId, setWalletId] = useState("");
  const [bankName, setBankName] = useState("");
  const [initialData, setInitialData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("authToken");

  // Fetch current user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${API_BASE}/${id}`, {
          method: "GET",
          headers: {
            Authorization : `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile data.");
        }

        const data = await res.json();

        console.log("DATAA111", data.data.user);
        setInitialData(data.data.user); // Save initial data for placeholder use
        setWalletId(data.data.user.walletId);
        setBankName(data.data.user.bankName);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to load user data.");
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleSave = async () => {
    if (!id) {
      setError("User ID is required");
      return;
    }

    if (!walletId.trim() || !bankName.trim()) {
      setError("Both Wallet ID and Bank Name are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE}/update/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletId: walletId.trim(),
          bankName: bankName.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("Profile updated successfully!");

        if (onSave) {
          onSave({ walletId, bankName });
        }

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Wallet ID
        </label>
        <input
          type="text"
          value={walletId}
          onChange={(e) => setWalletId(e.target.value)}
          disabled={loading}
          placeholder={initialData.walletId || "Enter wallet ID"}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bank Name
        </label>
        <input
          type="text"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          disabled={loading}
          placeholder={initialData.bankName || "Enter bank name"}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
};

export default UpdateProfileForm;
