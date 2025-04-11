import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthorizeView from "../components/AuthorizeView";
import "../pages/css/UserForm.css";

function EditUserPage() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("AuthenticatedCustomer");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${apiUrl}/register/users/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch user.");

        const user = await res.json();
        setEmail(user.email);
        setRole(user.roles.includes("Admin") ? "Admin" : "AuthenticatedCustomer");
        setTwoFactorEnabled(user.twoFactorEnabled);
      } catch (err) {
        console.error(err);
        setError("❌ Failed to load user data.");
      }
    };

    fetchUser();
  }, [id, apiUrl]);

  const validateForm = () => {
    if (!email) {
      setError("❌ Email is required.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await fetch(`${apiUrl}/register/users/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: id,
          role,
          enable2FA: twoFactorEnabled,
        }),
      });

      if (res.ok) {
        navigate("/admin/users");
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
      setError("❌ An unexpected error occurred.");
    }
  };

  return (
    <>
      <Header />
      <AuthorizeView>
        <div className="user-form-container">
          <h2 className="form-title">🖊️ Edit User</h2>
          <form onSubmit={handleSubmit}>

            <div className="form-grid">
              <input
                className="form-control"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="AuthenticatedCustomer">Authenticated Customer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <h4 className="form-section-title mt-6">🔐 Security Settings</h4>
            <div className="checkbox-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                />
                Enable Two-Factor Authentication
              </label>
            </div>

            {error && <p className="text-danger">{error}</p>}

            <div className="flex mt-6">
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
      <Footer />
    </>
  );
}

export default EditUserPage;
