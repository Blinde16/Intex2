import React, { useEffect, useState } from "react";
import '../App.css'; // Import your CSS file for styling

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
    <div className="cookie-banner">
      <span>This site uses cookies to enhance your experience.</span>
      <button onClick={acceptCookies} className="cookie-button">
        Accept
      </button>
    </div>
  );
};

export default CookieBanner;
