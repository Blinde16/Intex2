import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./css/MovieDetails.css"; // Assuming you have a CSS file for styling
import axios from "axios";

interface Movie {
  show_id: string;
  title: string;
  director?: string;
  cast?: string;
  country?: string;
  release_year: number;
  rating?: string;
  duration?: string;
  description?: string;
  [key: string]: any;
}

const MovieDetails: React.FC = () => {
  const { show_id } = useParams<{ show_id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/Movie/GetMovieById/${show_id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setMovie(response.data);
      })
      .catch((error) => {
        console.error("Error fetching movie:", error);
      });
  }, [show_id]);

  if (!movie) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "40px" }}>
        Loading...
      </div>
    );
  }

  const encodedTitle = encodeURIComponent(movie.title);
  const imageUrl = `https://moviepostersintex2.blob.core.windows.net/movieposter/Movie Posters/${encodedTitle}.jpg`;

  const genreList = Object.entries(movie)
    .filter(([, value]) => typeof value === "number" && value === 1)
    .map(([key]) => key.replace(/_/g, " "))
    .join(", ");

  const handleStarClick = (rating: number) => {
    setUserRating(rating);
    console.log(`User rated: ${rating} stars`);
    // Placeholder: Later you can send this rating to your backend!
  };

  return (
    <div className="movie-details-container">
      {/* Poster */}
      <div className="movie-poster-container">
        <img src={imageUrl} alt={movie.title} className="movie-poster" />
      </div>

      {/* Info */}
      <div className="movie-info">
        <h2>{movie.title}</h2>
        <p className="meta">
          {movie.release_year} | {movie.duration} | {movie.rating}
        </p>

        <div className="overview">
          <h3>Overview</h3>
          <p>{movie.description}</p>
        </div>

        <div className="details">
          <p>
            <strong>Starring:</strong> {movie.cast}
          </p>
          <p>
            <strong>Directed by:</strong> {movie.director}
          </p>
          <p>
            <strong>Genre:</strong> {genreList || "Unknown"}
          </p>
        </div>

        <div className="user-rating">
          <p>What’s your Rating?</p>
          <div className="stars-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleStarClick(star)}
                style={{
                  cursor: "pointer",
                  transform: userRating >= star ? "scale(1.2)" : "none",
                }}
              >
                {userRating >= star ? "⭐" : "☆"}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
