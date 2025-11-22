import React from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./admin/AdminDashboard";
import StudentDashboard from "./student/StudentDashboard";
import StaffDashboard from "./stuff/StaffDashboard";
import CanteenManagerDashboard from "./canteen/CanteenManagerDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const RoleDashboard = ({ role, userName }) => {
    const dashboards = {
      STUDENT: <StudentDashboard />,
      STAFF: <StaffDashboard />,
      ADMIN: <AdminDashboard />,
      CANTEEN_MANAGER: <CanteenManagerDashboard />,
      TEACHER: <AdminDashboard />
    };

    return dashboards[role] || dashboards.STUDENT;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  if (!user || !user.email) {
    navigate('/login');
    return null;
  }

  return (
    <div>
        <RoleDashboard role={user.role} userName={user.name} />
    </div>
  );
};

export default Dashboard;