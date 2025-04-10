import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddUserPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("AuthenticatedCustomer");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("https://localhost:5000/api/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, role }),
    });

    if (res.ok) {
      navigate("/admin/users");
    } else {
      const msg = await res.text();
      setError(msg || "Failed to create user.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit} className="w-50">
        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
        {error && <p className="text-danger">{error}</p>}
        <button className="btn btn-primary me-2" type="submit">
          Create
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

export default AddUserPage;
