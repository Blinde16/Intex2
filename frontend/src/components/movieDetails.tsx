import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./css/MovieDetails.css";
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
      .get(`${apiUrl}/Movie/GetMovieById/${show_id}`, { withCredentials: true })
      .then((response) => {
        setMovie(response.data);
      })
      .catch((error) => {
        console.error("Error fetching movie:", error);
      });
  }, [show_id]);

  const getPosterUrl = (title: string) => {
    if (!title || title.trim() === "") {
      return "https://moviepostersintex2.blob.core.windows.net/movieposter/placeholder.jpg";
    }
  
    const removals = /[()'".,?!:#"\-]/g; // Symbols to remove (basic ones)
  
    let cleanTitle = title
      .normalize("NFKD")                        // Normalize special characters (like smart quotes)
      .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "") // Remove smart quotes (single)
      .replace(/\s*([&/])\s*/g, "␣␣")          // Remove spaces around & and /
      .replace(removals, "")                    // Remove decorative characters
      .replace(/\s+/g, " ")                     // Collapse multiple spaces
      .replace(/␣␣/g, "  ")                    // Replace placeholder with real double space
      .trim();
  
    const encodedTitle = encodeURIComponent(cleanTitle);
    const folderName = encodeURIComponent("Movie Posters");
  
    return `https://moviepostersintex2.blob.core.windows.net/movieposter/${folderName}/${encodedTitle}.jpg`;
  };

  const imageUrl = movie
    ? getPosterUrl(movie.title)
    : "https://moviepostersintex2.blob.core.windows.net/movieposter/placeholder.jpg";

  const genreList = Object.entries(movie || {})
    .filter(([, value]) => typeof value === "number" && value === 1)
    .map(([key]) => key.replace(/_/g, " "))
    .join(", ");

  const handleStarClick = (rating: number) => {
    setUserRating(rating);
    console.log(`User rated: ${rating} stars`);
    // Later: send to backend!
  };

  if (!movie) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "40px" }}>
        Loading...
      </div>
    );
  }

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
