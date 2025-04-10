import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
    fetch("https://localhost:5000/register/users", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: AdminUser[]) => {
        const match = data.find((u) => u.id === id);
        if (!match) throw new Error("User not found");
        setUser(match);
        setRole(match.roles[0]);
        setEnable2FA(match.twoFactorEnabled);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("https://localhost:5000/api/admin/users/update", {
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
    <div className="container mt-4">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit} className="w-50">
        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            type="email"
            value={user.email}
            disabled
          />
        </div>

        <div className="mb-3">
          <label>Role</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="AuthenticatedCustomer">AuthenticatedCustomer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="form-check mb-3">
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

        <button className="btn btn-primary me-2" type="submit">
          Save
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/users")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditUserPage;
