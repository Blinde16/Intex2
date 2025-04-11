import React from 'react'; // ✅ Import React library
import './css/Homepage.css'; // ✅ Import CSS for Homepage styling
import { useNavigate } from "react-router-dom"; // ✅ Hook for navigation between routes
import Footer from "../components/Footer"; // ✅ Import Footer component

// ✅ Define subscription tiers with title, price, and features
const subscriptionTiers = [
  { title: 'Basic Plan', price: '$3.99/month', features: ['1 Screen', 'SD Quality', 'Limited Catalog'] },
  { title: 'Standard Plan', price: '$7.99/month', features: ['2 Screens', 'HD Quality', 'Full Catalog'] },
  { title: 'Premium Plan', price: '$12.99/month', features: ['4 Screens', 'Ultra HD', 'Full Catalog + Extras'] },
];

const Homepage: React.FC = () => {
  const imageNames = Array.from({ length: 18 }, (_, index) => `${index + 1}.jpg`); // ✅ Generate image filenames for background matrix

  // ✅ Map image names to img elements
  const images = imageNames.map((name, idx) => (
    <img
      key={idx}
      src={`/pictures/homepage/${name}`}
      alt={`Movie Poster ${idx + 1}`}
      className="matrix-image"
    />
  ));

  const navigate = useNavigate(); // ✅ Hook to navigate between routes

  // ✅ Randomize subscription tiers for dynamic display
  const randomTiers = [...subscriptionTiers].sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <div className="page-container"> {/* ✅ Main page container */}
      {/* Header */}
      <header className="header"> {/* ✅ Page header with logo */}
        <div className="logo">
          <img className="logo-img" src="/logo.png" alt="Intex Logo" />
        </div>
      </header>

      {/* Background Matrix */}
      <div className="matrix-container"> {/* ✅ Matrix effect background container */}
        {images} {/* ✅ Render matrix background images */}
        <div className="overlay"> {/* ✅ Overlay with promotional content */}
          <h1>Unlimited, Independent Movies & Originals</h1>
          <p>Enjoy hundreds of titles anytime, anywhere. Starting at just $3.99/month.</p>
          <div className="buttons"> {/* ✅ Call-to-action buttons */}
            <button
              className="sign-in"
              onClick={() => navigate('/login', { state: { mode: 'login' } })} // ✅ Navigate to login page
            >
              Sign In
            </button>
            <button
              className="register"
              onClick={() => navigate('/register')} // ✅ Navigate to register page
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <section className="welcome-section"> {/* ✅ Welcome message section */}
        <h2>Welcome to CineNiche</h2>
        <p>Experience a world of cinema with curated collections of independent films, cult classics, and hidden gems. Discover new favorites every week, and enjoy exclusive CineNiche Originals.</p>
      </section>

      {/* Dummy Data Sections */}
      <section className="features-section"> {/* ✅ Features of the service */}
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
      <section className="tiers-container"> {/* ✅ Subscription tiers section */}
        {randomTiers.map((tier) => (
          <div key={tier.title} className="tier-box"> {/* ✅ Individual subscription tier */}
            <h2>{tier.title}</h2>
            <p className="price">{tier.price}</p>
            <ul>
              {tier.features.map((feature) => (
                <li key={`${tier.title}-${feature}`}>{feature}</li> // ✅ List subscription features
              ))}
            </ul>
          </div>
        ))}
      </section>

      <Footer /> {/* ✅ Footer component */}
    </div>
  );
};

export default Homepage; // ✅ Export the component for routing