import { Link } from "react-router-dom";
import "./css/Header.css";
import Logout from "./Logout";
import AuthorizeView from "./AuthorizeView";

function Header() {
  return (
    <>
      <AuthorizeView>
        <div className="header-bar">
          <img src="pictures/logo/CineNiche(2).png" className="header-image" />
          <h1></h1>
          <div className="button-container">
            <Link to="/AdminPage">
              <button className="admin-button"> Admin</button>
            </Link>
            <Logout>
              <Link to="/">
                <button className="logout-button"> Logout</button>
              </Link>
            </Logout>
          </div>
        </div>
      </AuthorizeView>
    </>
  );
}

export default Header;
