import React from "react";
import Recentadditions from "../components/dashboard/Recentadditions";

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
    <div className="bg-gray-50 ">
      <Recentadditions name={"Pending Deposit"} data={pendingDeposits} />
      <Recentadditions name={"Recent Withdrawal"} data={recentWithdrawals} />
    </div>
  );
};

export default Dashboard;
