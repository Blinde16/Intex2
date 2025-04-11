import { Link } from "react-router-dom";
import "./css/Header.css";
import Logout from "./Logout";
import { useContext } from "react";
import { UserContext } from "./AuthorizeView"; // make sure to import UserContext

function Header() {
  const user = useContext(UserContext); // Get user info from context

  const isAdmin = user?.email === "admin@nichemovies.com"; // Replace with your actual admin email
  const username = user?.email; // Assuming email is being used as username

  return (
    <div className="header-bar">
      <Link to="/movie">
        <img src="/logo.png" className="header-image" />
      </Link>
      <h1 className="header-title">{username ? `Welcome, ${username}` : "Welcome"}</h1>{" "}
      {/* Display username */}
      <div className="button-container">
        <Link to="/movie">
          <button className="logout-button">Home</button>
        </Link>
        {isAdmin && (
          <Link to="/AdminPage">
            <button className="logout-button">Admin</button>
          </Link>
        )}
        <Logout>
          <Link to="/">
            <button className="logout-button-1">Logout</button>
          </Link>
        </Logout>
      </div>
    </div>
  );
}

export default Header;
