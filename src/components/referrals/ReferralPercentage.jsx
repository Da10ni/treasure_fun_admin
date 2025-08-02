import React, { useState } from "react";
import { toast } from 'react-toastify';

const ReferralPercentage = () => {
  const [referralSettings, setReferralSettings] = useState({
    percentage: 5,
  });

  const baseUrl = `${import.meta.env.VITE_BASE_URL}`

  const [loading, setLoading] = useState(false);

  const handleInputChange = (plan, value) => {
    setReferralSettings((prev) => ({
      ...prev,
      [plan]: parseInt(value),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const token = localStorage.getItem("authToken");

    // Show loading toast
    const loadingToast = toast.loading("Saving referral settings...", {
      position: "top-right",
    });

    try {
      const response = await fetch(
        `${baseUrl}/referrals/create-referral`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(referralSettings),
        }
      );

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.ok) {
        const data = await response.json();

        toast.success("✅ Referral settings updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        console.log("API Response:", data);
      } else {
        throw new Error("Failed to update settings");
      }
    } catch (error) {
      toast.dismiss(loadingToast);

      console.error("Error updating referral settings:", error);

      toast.error("❌ Error updating settings. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold">Referral Commission Settings</h3>
          <p className="text-sm text-gray-500 mt-1">
            Configure commission percentages for referrals
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {/* Basic Plan */}
            <div className="flex items-center justify-center">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Basic Plan Commission (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={referralSettings.percentage}
                  onChange={(e) =>
                    handleInputChange("percentage", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Current: {referralSettings.percentage}% commission on Basic
                  Plan referrals
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralPercentage;