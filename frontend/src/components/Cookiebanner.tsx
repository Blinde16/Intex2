import React, { useEffect, useState } from "react";

const COOKIE_NAME = "cookie_consent";

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consentGiven = localStorage.getItem(COOKIE_NAME);
    if (!consentGiven) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_NAME, "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div style={styles.banner}>
      <span>This site uses cookies to enhance your experience.</span>
      <button onClick={acceptCookies} style={styles.button}>
        Accept
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  banner: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    backgroundColor: "#1e1822",
    color: "white",
    padding: "40px",
    display: "block",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 9999,
  },
  button: {
    backgroundColor: "#8C00D7",
    border: "none",
    cursor: "pointer",
    color: "white",
    padding: "10px",
  },
};

export default CookieBanner;
