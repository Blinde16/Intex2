import { Link } from "react-router-dom";
import "./css/Header.css";
import Logout from "./Logout";
import { useContext } from "react";
import { UserContext } from "./AuthorizeView"; // make sure to export UserContext from AuthorizeView.tsx

function Header() {
  const user = useContext(UserContext);

  const isAdmin = user?.email === "admin@nichemovies.com"; // Replace with your actual admin email

  return (
    <>
      <div className="header-bar">
        <img src="/logo.png" className="header-image" />
        <h1></h1>
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
              <button className="logout-button-1"> Logout</button>
            </Link>
          </Logout>
        </div>
      </div>
    </>
  );
}

export default Header;

