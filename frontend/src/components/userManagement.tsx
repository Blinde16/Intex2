import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/pagination";
import SearchBar from "../components/SearchBar";

const apiUrl = import.meta.env.VITE_API_URL;

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

function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPageNumber(1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/register/users?page=${pageNumber}&pageSize=${pageSize}&search=${debouncedSearch}`,
        { credentials: "include" }
      );

      if (!res.ok) {
        throw new Error("Failed to load users.");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setUsers(data);
        setTotalUsers(data.length < pageSize ? (pageNumber - 1) * pageSize + data.length : pageNumber * pageSize + 1);
      } else if (data.users && typeof data.totalCount === "number") {
        setUsers(data.users);
        setTotalUsers(data.totalCount);
      } else {
        console.error("Unexpected API response", data);
        setUsers([]);
        setTotalUsers(0);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to load users. Please try again later.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    const res = await fetch(`${apiUrl}/api/admin/users/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      fetchUsers();
    } else {
      alert("Failed to delete user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pageSize, pageNumber, debouncedSearch]);

  const totalPages = Math.ceil(totalUsers / pageSize);

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

      <div className="mb-3">
        <SearchBar setSearchTerm={setSearchTerm} />
      </div>

      {error && <p className="alert alert-danger">{error}</p>}

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
            {users.length > 0 ? (
              users.map((u) => (
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
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pageNumber}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNumber}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNumber(1);
        }}
      />
    </div>
  );
}

export default UserManagement;
