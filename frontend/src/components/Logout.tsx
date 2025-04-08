import { useNavigate } from "react-router-dom";

function Logout(props: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("https://localhost:5000/logout", {
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
