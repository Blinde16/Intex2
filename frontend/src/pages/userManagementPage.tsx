import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthorizeView from "../components/AuthorizeView";
import UserManagement from "../components/userManagement.tsx";
import { useNavigate } from "react-router-dom";
import "./css/UserManagementPage.css";

const UserManagementPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <AuthorizeView>
        <div className="container mt-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>User Management</h1>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/adminPage")}
            >
              ← Back to Admin Dashboard
            </button>
          </div>

          <UserManagement />
        </div>
      </AuthorizeView>
      <Footer />
    </>
  );
};

export default UserManagementPage;
