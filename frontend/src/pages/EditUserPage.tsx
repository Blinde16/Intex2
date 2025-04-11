import { useEffect, useState } from "react"; // ✅ React hooks for state and side effects
import { useNavigate, useParams } from "react-router-dom"; // ✅ Hooks for navigation and route parameters
import Header from "../components/Header"; // ✅ Import header component
import Footer from "../components/Footer"; // ✅ Import footer component
import AuthorizeView from "../components/AuthorizeView"; // ✅ Authorization wrapper to protect the page
import "../pages/css/UserForm.css"; // ✅ Import CSS for user form styling

function EditUserPage() {
  const apiUrl = import.meta.env.VITE_API_URL; // ✅ API base URL from environment variables
  const { id } = useParams(); // ✅ Get user ID from route parameters
  const navigate = useNavigate(); // ✅ Hook to navigate programmatically

  // ✅ State variables for user form fields
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("AuthenticatedCustomer");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${apiUrl}/register/users/${id}`, {
          credentials: "include", // ✅ Include cookies in the request
        });
        if (!res.ok) throw new Error("Failed to fetch user.");

        const user = await res.json(); // ✅ Parse user data
        setEmail(user.email); // ✅ Set email state
        setRole(user.roles.includes("Admin") ? "Admin" : "AuthenticatedCustomer"); // ✅ Set role state
        setTwoFactorEnabled(user.twoFactorEnabled); // ✅ Set two-factor authentication state
      } catch (err) {
        console.error(err);
        setError("❌ Failed to load user data."); // ✅ Error handling
      }
    };

    fetchUser(); // ✅ Fetch user data on component mount
  }, [id, apiUrl]);

  const validateForm = () => {
    if (!email) {
      setError("❌ Email is required."); // ✅ Validation error for missing email
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ Prevent default form submission

    if (!validateForm()) return; // ✅ Validate form before submitting

    try {
      const res = await fetch(`${apiUrl}/register/users/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ Include cookies in the request
        body: JSON.stringify({
          userId: id,
          role,
          enable2FA: twoFactorEnabled,
        }),
      });

      if (res.ok) {
        navigate("/admin/users"); // ✅ Navigate to user management page on success
      } else {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0 && data[0].description) {
            setError(`❌ ${data[0].description}`);
          } else if (typeof data === "string") {
            setError(`❌ ${data}`);
          } else {
            setError("❌ Failed to update user.");
          }
        } else {
          const msg = await res.text();
          setError(`❌ ${msg || "Failed to update user."}`);
        }
      }
    } catch (error) {
      console.error(error);
      setError("❌ An unexpected error occurred."); // ✅ Catch-all error handling
    }
  };

  return (
    <>
      <Header /> {/* ✅ Page header */}
      <AuthorizeView> {/* ✅ Authorization wrapper */}
        <div className="user-form-container"> {/* ✅ Container for user form */}
          <h2 className="form-title">🖊️ Edit User</h2>
          <form onSubmit={handleSubmit}> {/* ✅ Form element */}

            <div className="form-grid"> {/* ✅ Form grid layout */}
              <input
                className="form-control"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // ✅ Update email state
                required
              />
              <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)} // ✅ Update role state
              >
                <option value="AuthenticatedCustomer">Authenticated Customer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <h4 className="form-section-title mt-6">🔐 Security Settings</h4> {/* ✅ Section title for security */}
            <div className="checkbox-group"> {/* ✅ Checkbox group for 2FA */}
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)} // ✅ Toggle 2FA state
                />
                Enable Two-Factor Authentication
              </label>
            </div>

            {error && <p className="text-danger">{error}</p>} {/* ✅ Display error messages */}

            <div className="flex mt-6"> {/* ✅ Action buttons container */}
              <button type="submit" className="btn btn-primary">💾 Save Changes</button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/admin/users")}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      </AuthorizeView>
      <Footer /> {/* ✅ Page footer */}
    </>
  );
}

export default EditUserPage; // ✅ Export component for routing