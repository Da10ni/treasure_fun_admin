import React, { useState, useEffect } from "react";
import Recentadditions from "../components/dashboard/Recentadditions";
import DashboardStats from "../components/dashboard/DashboardStats";
import axios from "axios";

const Dashboard = () => {
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        // Fetch deposits
        const depositsResponse = await axios.get(`${baseUrl}/deposits`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (depositsResponse.data.success) {
          // API returns either data.deposits or directly data
          const allDeposits =
            depositsResponse.data.data.deposits || depositsResponse.data.data;
          setDeposits(allDeposits.slice(0, 5)); // Just take first 5
        }

        // Use dummy data for withdrawals as shown in your screenshot
        setWithdrawals([
          {
            id: 101,
            user: "emma_wilson",
            amount: "$320.00",
            date: "2025-07-15",
            status: "completed",
          },
          {
            id: 102,
            user: "david_brown",
            amount: "$1,500.00",
            date: "2025-07-14",
            status: "processing",
          },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        const depositsResponse = await axios.get(`${baseUrl}/deposits`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (depositsResponse.data.success) {
          const allDeposits =
            depositsResponse.data.data.deposits || depositsResponse.data.data;
          setDeposits(allDeposits.slice(0, 5));
        }

        const withdrawalsResponse = await axios.get(`${baseUrl}/withdrawals`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (withdrawalsResponse.data.success) {
          const allWithdrawals =
            withdrawalsResponse.data.data.withdrawals ||
            withdrawalsResponse.data.data;
          setWithdrawals(allWithdrawals.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <DashboardStats />
      <div className="w-full flex flex-col gap-6 py-5">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <Recentadditions name={"Recent Deposits"} data={deposits} />
            <Recentadditions name={"Recent Withdrawals"} data={withdrawals} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
