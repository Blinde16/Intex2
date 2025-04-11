import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  const footerStyle: React.CSSProperties = {
    width: "100%",
    background: "linear-gradient(to right, #1e1822, #2a2137)",
    color: "#e0d7f5",
    padding: "1rem 0",
    textAlign: "center",
    marginTop: "auto",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    position: "relative",
    zIndex: 10,
  };

  const footerContentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.9rem",
  };

  const linkStyle: React.CSSProperties = {
    color: "#c4b5fd",
    textDecoration: "none",
    transition: "color 0.3s ease",
  };

  const linkHoverStyle: React.CSSProperties = {
    color: "#a78bfa",
  };

  return (
    <footer style={footerStyle}>
      <div style={footerContentStyle}>
        <p>© {year} CINENICHE. All rights reserved.</p>
        <div>
          <Link
            to="/PrivacyPage"
            style={linkStyle}
            onMouseEnter={(e) =>
              ((e.target as HTMLAnchorElement).style.color = linkHoverStyle.color!)
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLAnchorElement).style.color = linkStyle.color!)
            }
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
