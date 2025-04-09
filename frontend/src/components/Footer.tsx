import { Link } from "react-router-dom";
import './css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-bar">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} CINENICHE. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/PrivacyPage">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
