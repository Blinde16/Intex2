import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/EditUserPage.css";

const apiUrl = import.meta.env.VITE_API_URL;

type AdminUser = {
  id: string;
  email: string;
  roles: string[];
  twoFactorEnabled: boolean;
};

function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [role, setRole] = useState("");
  const [enable2FA, setEnable2FA] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Invalid user ID");
      return;
    }

    fetch(`${apiUrl}/register/users/${id}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: AdminUser) => {
        setUser(data);
        setRole(data.roles[0] || "");
        setEnable2FA(data.twoFactorEnabled);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${apiUrl}/register/users/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        userId: id,
        role,
        enable2FA,
      }),
    });

    if (res.ok) {
      navigate("/admin/users");
    } else {
      const msg = await res.text();
      setError(msg || "Failed to update user.");
    }
  };

  if (!user) return <p className="container mt-4">Loading...</p>;

  return (
    <div className="edit-user-container">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit} className="edit-user-form">
        <div className="form-group">
          <label>Email</label>
          <input className="form-control" type="email" value={user.email} disabled />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="AuthenticatedCustomer">AuthenticatedCustomer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="enable2FA"
            checked={enable2FA}
            onChange={(e) => setEnable2FA(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="enable2FA">
            Enable Two-Factor Authentication (2FA)
          </label>
        </div>

        {error && <p className="text-danger">{error}</p>}

        <div className="button-group">
          <button className="btn btn-primary me-2" type="submit">Save</button>
          <button className="btn btn-secondary" onClick={() => navigate("/admin/users")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default EditUserPage;
