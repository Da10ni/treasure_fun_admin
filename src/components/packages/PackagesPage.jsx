import React from 'react'

const PackagesPage = () => {
    const packages = [
        { id: 1, name: 'Basic Plan', price: '$49.99', features: '5 licenses, basic support', status: 'active' },
        { id: 3, name: 'Enterprise Plan', price: '$199.99', features: 'Unlimited licenses, 24/7 support', status: 'active' },
      ];
  return (
    <div className="space-y-6">
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Package Management</h3>
          <p className="text-sm text-gray-500 mt-1">Add, edit or delete packages</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2">
          <span>Add Package</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {packages.map((pkg) => (
              <tr key={pkg.id}>
                <td className="px-6 py-4 whitespace-nowrap">{pkg.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{pkg.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{pkg.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">{pkg.features}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {pkg.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}

export default PackagesPage