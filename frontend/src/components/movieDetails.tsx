import React from 'react';
import './css/movieDetails.css'
interface MovieDetailsProps {
  title: string;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ title }) => {
  const encodedTitle = encodeURIComponent(title);
  const imageUrl = `https://moviepostersintex2.blob.core.windows.net/movieposter/Movie Posters/${encodedTitle}.jpg`;

  return (
    <div className="movie-details-container">
      {/* Movie Poster */}
      <img 
        src={imageUrl} 
        alt={title} 
        className="movie-poster"
        onError={(e) => e.currentTarget.src = '/fallback.jpg'} // Optional fallback
      />

      {/* Movie Info */}
      <div className="movie-info">
        <h2>{title}</h2>
        <p><strong>Director:</strong> Jane Doe</p>
        <p><strong>Release Year:</strong> 2024</p>
        <p><strong>Genre:</strong> Drama, Action</p>
        <p><strong>Description:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
    </div>
  );
};

export default MovieDetails;
