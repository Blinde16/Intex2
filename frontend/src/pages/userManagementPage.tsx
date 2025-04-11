import Header from "../components/Header"; // ✅ Top page header component
import Footer from "../components/Footer"; // ✅ Footer component at the bottom
import AuthorizeView from "../components/AuthorizeView"; // ✅ Wrapper to protect the page with authorization
import UserManagement from "../components/userManagement.tsx"; // ✅ Main user management component (table, controls, etc.)
import { useNavigate } from "react-router-dom"; // ✅ Hook for programmatic navigation
import "./css/UserManagementPage.css"; // ✅ Styles specific to User Management Page

const UserManagementPage = () => {
  const navigate = useNavigate(); // ✅ Navigation function to move between routes

  return (
    <>
      <Header /> {/* ✅ Display header at the top of the page */}
      <AuthorizeView> {/* ✅ Ensure only authorized users can access this page */}
        <div className="container mt-4"> {/* ✅ Main container with top margin */}
          <div className="d-flex justify-content-between align-items-center mb-4"> {/* ✅ Flex container for title and back button */}
            <h1>User Management</h1> {/* ✅ Page title */}
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/adminPage")} // ✅ Navigate back to Admin Dashboard
            >
              ← Back to Admin Dashboard
            </button>
          </div>

          <UserManagement /> {/* ✅ User management component rendering user list and controls */}
        </div>
      </AuthorizeView>
      <Footer /> {/* ✅ Display footer at the bottom of the page */}
    </>
  );
};

export default UserManagementPage; // ✅ Export the component for routing and use in the app
