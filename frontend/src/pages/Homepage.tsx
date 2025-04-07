import React from 'react';
import './homepage/css/Homepage.css';
import { useNavigate } from "react-router-dom";

const subscriptionTiers = [
  { title: 'Basic Plan', price: '$3.99/month', features: ['1 Screen', 'SD Quality', 'Limited Catalog'] },
  { title: 'Standard Plan', price: '$7.99/month', features: ['2 Screens', 'HD Quality', 'Full Catalog'] },
  { title: 'Premium Plan', price: '$12.99/month', features: ['4 Screens', 'Ultra HD', 'Full Catalog + Extras'] },
];

const Homepage: React.FC = () => {
const imageNames = Array.from({ length: 18}, (_, index) => `${index + 1}.jpg`);
const images = imageNames.map((name, idx) => (
  <img
      key={idx}
      src={`/pictures/homepage/${name}`}
      alt={`Movie Poster ${idx + 1}`}
      className="matrix-image"
  />
  ));


  
  const navigate = useNavigate();

  const randomTiers = [...subscriptionTiers].sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <div className="page-container">
      <header className="header">
        <div className="logo">CineNiche</div>
      </header>

      <div className="matrix-container">
        {images}
        <div className="overlay">
          <h1>Independent, unique movies all in one place</h1>
          <p>Plan starts at $3.99 monthly</p>
          <div className="buttons">
          <button className="sign-in" onClick={() => navigate('/login', { state: { mode: 'login' } })}>
            Sign in
          </button>
          <button className="register" onClick={() => navigate('/login', { state: { mode: 'register' } })}>
            Register
          </button>

          </div>
        </div>
      </div>

      {/* Subscription Tiers */}
      <div className="tiers-container">
        {randomTiers.map((tier, index) => (
          <div key={index} className="tier-box">
            <h2>{tier.title}</h2>
            <p className="price">{tier.price}</p>
            <ul>
              {tier.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 CineNiche. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
