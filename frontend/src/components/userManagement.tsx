import { useEffect, useState } from "react";

type AdminUser = {
  id: string;
  email: string;
  roles: string[];
  twoFactorEnabled: boolean;

  // Custom user data
  name: string;
  phone: string;
  age: number;
  gender: string;
  city: string;
  state: string;
  zip: number;

  // Subscriptions
  netflix: number;
  amazon_Prime: number;
  disney: number;
  paramount: number;
  max: number;
  hulu: number;
  apple_TV: number;
  peacock: number;
};

function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://localhost:5000/register/users", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users.");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin User Management</h2>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && users.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Location</th>
                <th>Roles</th>
                <th>2FA</th>
                <th>Subscriptions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.name}</td>
                  <td>{u.phone}</td>
                  <td>{u.age}</td>
                  <td>{u.gender}</td>
                  <td>
                    {u.city}, {u.state} {u.zip}
                  </td>
                  <td>{u.roles.join(", ")}</td>
                  <td>{u.twoFactorEnabled ? "✅" : "❌"}</td>
                  <td>
                    {[
                      u.netflix && "Netflix",
                      u.amazon_Prime && "Prime",
                      u.disney && "Disney",
                      u.paramount && "Paramount",
                      u.max && "Max",
                      u.hulu && "Hulu",
                      u.apple_TV && "Apple TV",
                      u.peacock && "Peacock",
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && users.length === 0 && <p>No users found.</p>}
    </div>
  );
}

export default UserManagement;
