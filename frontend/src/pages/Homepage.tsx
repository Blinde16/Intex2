import React from 'react';
import './css/Homepage.css';
import { useNavigate } from "react-router-dom";

const subscriptionTiers = [
  { title: 'Basic Plan', price: '$3.99/month', features: ['1 Screen', 'SD Quality', 'Limited Catalog'] },
  { title: 'Standard Plan', price: '$7.99/month', features: ['2 Screens', 'HD Quality', 'Full Catalog'] },
  { title: 'Premium Plan', price: '$12.99/month', features: ['4 Screens', 'Ultra HD', 'Full Catalog + Extras'] },
];

const Homepage: React.FC = () => {
  const imageNames = Array.from({ length: 18 }, (_, index) => `${index + 1}.jpg`);
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
      {/* Header */}
      <header className="header">
        <div className="logo">CineNiche</div>
      </header>

      {/* Background Matrix */}
      <div className="matrix-container">
        {images}
        <div className="overlay">
          <h1>Unlimited, Independent Movies & Originals</h1>
          <p>Enjoy hundreds of titles anytime, anywhere. Starting at just $3.99/month.</p>
          <div className="buttons">
            <button className="sign-in" onClick={() => navigate('/login', { state: { mode: 'login' } })}>
              Sign In
            </button>
            <button className="register" onClick={() => navigate('/register')}>
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <section className="welcome-section">
        <h2>Welcome to CineNiche</h2>
        <p>Experience a world of cinema with curated collections of independent films, cult classics, and hidden gems. Discover new favorites every week, and enjoy exclusive CineNiche Originals.</p>
      </section>

      {/* Dummy Data Sections */}
      <section className="features-section">
        <div className="feature-box">
          <h3>Watch Anywhere</h3>
          <p>Stream on your phone, tablet, laptop, and TV without paying more.</p>
        </div>
        <div className="feature-box">
          <h3>Curated for You</h3>
          <p>Handpicked titles from global creators and indie directors.</p>
        </div>
        <div className="feature-box">
          <h3>No Ads</h3>
          <p>Enjoy uninterrupted movie experiences with our premium plan.</p>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="tiers-container">
        {randomTiers.map((tier) => (
          <div key={tier.title} className="tier-box">
            <h2>{tier.title}</h2>
            <p className="price">{tier.price}</p>
            <ul>
              {tier.features.map((feature) => (
                <li key={`${tier.title}-${feature}`}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 CineNiche. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
