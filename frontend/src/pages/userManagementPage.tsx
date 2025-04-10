import React from "react";
import UserManagement from "../components/userManagement.tsx";
import { useNavigate } from "react-router-dom";

const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/adminPage"); // Adjust to your dashboard route
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin User Management</h1>
        <button className="btn btn-secondary" onClick={handleBack}>
          ← Back to Admin Dashboard
        </button>
      </div>

      <UserManagement />
    </div>
  );
};

export default UserManagementPage;
