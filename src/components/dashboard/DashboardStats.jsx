import axios from 'axios';
import { ArrowDownLeft, ArrowUpRight, PackageCheck, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const DashboardStats = () => {
  // Initial state mein activeUsersCount 0 se initialize karein
  const [state, setState] = useState({ activeUsersCount: 0 });
  const [activePackages, setActivePackages] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/admin/getactiveuser');
        console.log("fetch data active user", response);
        
        if (response.data.success) {
          const activeUsersCount = response.data.data.users.length;
          setState({
            activeUsersCount: activeUsersCount,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };
    
    fetchUserData();
    // Empty dependency array to run only once
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/products/allproducts');
        console.log("fetch data products", response);
        
        if (response.data.success) {
          const activeProductsCount = response.data.data.filter(
            (product) => product.status === "active"
          ).length;
        
          setActivePackages(activeProductsCount);
        }
      } catch (error) {
        console.error("Error fetching product data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
    // Empty dependency array to run only once
  }, []);

  const overviewStats = [
    { title: 'Total Users', value: loading ? 'Loading...' : state.activeUsersCount, icon: <Users size={20} />, change: '+12%', color: 'bg-blue-500' },
    { title: 'Active Packages', value: loading ? 'Loading...' : activePackages, icon: <PackageCheck size={20} />, change: '+1', color: 'bg-green-500' },
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