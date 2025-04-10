import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type AdminUser = {
  id: string;
  email: string;
  roles: string[];
  twoFactorEnabled: boolean;
  name: string;
  phone: string;
  age: number;
  gender: string;
  city: string;
  state: string;
  zip: number;
  netflix: number;
  amazon_Prime: number;
  disney: number;
  paramount: number;
  max: number;
  hulu: number;
  apple_TV: number;
  peacock: number;
};

const PAGE_SIZE = 10;

function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const res = await fetch(
      `https://localhost:5000/register/users?page=${page}&pageSize=${PAGE_SIZE}`,
      {
        credentials: "include",
      }
    );

    if (!res.ok) {
      setError("Failed to load users.");
      return;
    }

    const data = await res.json();
    if (data.length < PAGE_SIZE) setHasMore(false);

    setUsers((prev) => [...prev, ...data]);
    setPage((prev) => prev + 1);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;

    const res = await fetch(
      `https://localhost:5000/api/admin/users/delete/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      alert("Failed to delete user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>User Management</h2>
        <button
          className="btn btn-success"
          onClick={() => navigate("/admin/users/add")}
        >
          ➕ Add User
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}

      <InfiniteScroll
        dataLength={users.length}
        next={fetchUsers}
        hasMore={hasMore}
        loader={<p>Loading more users...</p>}
        endMessage={<p className="text-muted">No more users to load.</p>}
      >
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Role</th>
                <th>2FA</th>
                <th>Subscriptions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.name}</td>
                  <td>{u.phone}</td>
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
                      u.hulu && "Hulu",
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => navigate(`/admin/users/edit/${u.id}`)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(u.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default UserManagement;
