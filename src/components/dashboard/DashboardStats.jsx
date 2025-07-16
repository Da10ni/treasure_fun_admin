import { ArrowDownLeft, ArrowUpRight, PackageCheck, Users } from 'lucide-react';
import React from 'react'

const DashboardStats = () => {

  const overviewStats = [
    { title: 'Total Users', value: '1,247', icon: <Users size={20} />, change: '+12%', color: 'bg-blue-500' },
    { title: 'Active Packages', value: '3', icon: <PackageCheck size={20} />, change: '+1', color: 'bg-green-500' },
    { title: 'Pending Deposits', value: '$2,450', icon: <ArrowDownLeft size={20} />, change: '+$750', color: 'bg-yellow-500' },
    { title: 'Pending Withdrawals', value: '$1,820', icon: <ArrowUpRight size={20} />, change: '-$320', color: 'bg-purple-500' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {overviewStats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{stat?.title}</p>
            <p className="text-2xl font-bold">{stat?.value}</p>
            <p className="text-sm text-green-500">{stat?.change}</p>
          </div>
          <div className={`${stat?.color} p-3 rounded-lg text-white`}>
            {stat?.icon}
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardStats