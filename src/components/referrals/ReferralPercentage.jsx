import React from 'react'

const ReferralPercentage = () => {
    const referralSettings = {
        basicPlan: 5, // 5% commission
        proPlan: 10,  // 10% commission
        enterprisePlan: 15 // 15% commission
      };

  return (
    <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold">Referral Commission Settings</h3>
                  <p className="text-sm text-gray-500 mt-1">Configure commission percentages for referrals</p>
                </div>
                <div className="p-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Basic Plan Commission (%)</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="100" 
                          value={referralSettings.basicPlan} 
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">Current: 5% commission on Basic Plan referrals</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pro Plan Commission (%)</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="100" 
                          value={referralSettings.proPlan} 
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">Current: 10% commission on Pro Plan referrals</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enterprise Plan Commission (%)</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="100" 
                          value={referralSettings.enterprisePlan} 
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">Current: 15% commission on Enterprise Plan referrals</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button 
                        type="submit" 
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold mb-4">Referral Program Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500">Total Referrals</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500">Active Referrers</p>
                    <p className="text-2xl font-bold">287</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500">Total Commission Paid</p>
                    <p className="text-2xl font-bold">$14,389.00</p>
                  </div>
                </div>
              </div>
            </div>
  )
}

export default ReferralPercentage