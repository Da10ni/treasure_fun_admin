import axios from "axios";
import { ArrowDownLeft, ArrowUpRight, PackageCheck, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

const DashboardStats = () => {
  const [state, setState] = useState({ activeUsersCount: 0 });
  const [activePackages, setActivePackages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        console.error("No authentication token found");
        setError("Authentication token missing");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3006/api/admin/getactiveuser",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("fetch data active user", response);

        if (response.data.success) {
          const activeUsersCount = response.data.data.users.length;
          setState({
            activeUsersCount: activeUsersCount,
          });
        }
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error.response?.data || error.message
        );
        setError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, [token]);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!token) {
        console.error("No authentication token found");
        setError("Authentication token missing");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3006/api/products/allproducts",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("fetch data products", response);

        if (response.data.success) {
          const activeProductsCount = response.data.data.filter(
            (product) => product.status === "active"
          ).length;

          setActivePackages(activeProductsCount);
        }
      } catch (error) {
        console.error(
          "Error fetching product data:",
          error.response?.data || error.message
        );
        setError("Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [token]);

  // Check if token exists
  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Authentication required. Please login again.
        </div>
      </div>
    );
  }

  const overviewStats = [
    {
      title: "Total Users",
      value: loading ? "Loading..." : state.activeUsersCount,
      icon: <Users size={20} />,
      change: "+12%",
      color: "bg-blue-500",
    },
    {
      title: "Active Packages",
      value: loading ? "Loading..." : activePackages,
      icon: <PackageCheck size={20} />,
      change: "+1",
      color: "bg-green-500",
    },
    {
      title: "Pending Deposits",
      value: "$2,450",
      icon: <ArrowDownLeft size={20} />,
      change: "+$750",
      color: "bg-yellow-500",
    },
    {
      title: "Pending Withdrawals",
      value: "$1,820",
      icon: <ArrowUpRight size={20} />,
      change: "-$320",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {overviewStats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between"
        >
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
  );
};

export default DashboardStats;
