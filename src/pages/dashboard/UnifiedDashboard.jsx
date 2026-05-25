import React from "react";
import { useAuth } from "../../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

const UnifiedDashboard = () => {
  const { user } = useAuth();
  const role = (user?.role || "").toLowerCase();

  if (role === "admin") {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
};

export default UnifiedDashboard;
