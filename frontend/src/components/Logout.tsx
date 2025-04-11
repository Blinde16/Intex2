import { useNavigate } from "react-router-dom";

// this logout button removes authentication and returns to the home page.

function Logout(props: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const handleLogout = async () => {
    try {
      const response = await fetch(`${apiUrl}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        navigate("/login");
      } else {
        console.error("Logout failed:", response.status);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button
      className="logout btn btn-link p-0"
      onClick={handleLogout}
      style={{
        textDecoration: "none",
        color: "inherit",
        background: "none",
        border: "none",
      }}
    >
      {props.children}
    </button>
  );
}

export default Logout;
