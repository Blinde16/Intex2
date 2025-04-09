import { Link } from "react-router-dom";
import "./css/Header.css";
import Logout from "./Logout";

function Header() {
  return (
    <>
      <div className="header-bar">
        <img src="/logo.png" className="header-image" />
        <h1></h1>
        <div className="button-container">
          <Link to="/movie">
            <button className="logout-button">Home</button>
          </Link>
          <Link to="/AdminPage">
            <button className="logout-button">Admin</button>
          </Link>
          <Logout>
            <Link to="/">
              <button className="logout-button"> Logout</button>
            </Link>
          </Logout>
        </div>
      </div>
    </>
  );
}

export default Header;
