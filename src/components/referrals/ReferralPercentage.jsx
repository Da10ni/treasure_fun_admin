import React, { useState } from "react";

const ReferralPercentage = () => {
  const [referralSettings, setReferralSettings] = useState({
    basicPlan: 5,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (plan, value) => {
    setReferralSettings((prev) => ({
      ...prev,
      [plan]: parseInt(value),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        "http://localhost:3006/api/referrals/create-referral",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(referralSettings),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage("Referral settings updated successfully!");
        console.log("API Response:", data);
      } else {
        throw new Error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating referral settings:", error);
      setMessage("Error updating settings. Please try again.");
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
                  value={referralSettings.basicPlan}
                  onChange={(e) =>
                    handleInputChange("basicPlan", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Current: {referralSettings.basicPlan}% commission on Basic
                  Plan referrals
                </p>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div
                className={`p-3 rounded-md ${
                  message.includes("Error")
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {message}
              </div>
            )}

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
