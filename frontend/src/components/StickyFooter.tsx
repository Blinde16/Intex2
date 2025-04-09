import { Link } from 'react-router-dom';
import './css/StickyFooter.css';

const StickyFooter = () => {
  return (
    <div className="sticky-footer">
      <p>
        © 2025 CineNiche •{" "}
        <Link to="/PrivacyPage" className="footer-link">Privacy Policy</Link>
      </p>
    </div>
  );
};

export default StickyFooter;
