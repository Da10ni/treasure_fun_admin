
import React from "react";
import Recentadditions from "../components/dashboard/Recentadditions";
import DashboardStats from "../components/dashboard/DashboardStats";

const Dashboard = () => {
  const pendingDeposits = [
    {
      id: 1,
      user: "john_doe",
      amount: "$500.00",
      date: "2025-07-15",
      status: "pending",
    },
    {
      id: 2,
      user: "sarah_smith",
      amount: "$1,200.00",
      date: "2025-07-16",
      status: "pending",
    },
    {
      id: 3,
      user: "mike_jones",
      amount: "$750.00",
      date: "2025-07-16",
      status: "pending",
    },
  ];

  const recentWithdrawals = [
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
  ];
  return (
    <div className='p-4'>
      <DashboardStats />
      <div className="w-full flex flex-col gap-6 py-5">
      <Recentadditions name={"deposit"} data={pendingDeposits} />
      <Recentadditions name={"withdrawal"} data={recentWithdrawals} />
      </div>
    </div>
  );
};

export default Dashboard;
