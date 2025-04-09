import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import MovieRecommendation from "../components/MovieDetailsRecommender";

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

const ProductDetail: React.FC = () => {
  const { show_id } = useParams<{ show_id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [userRating, setUserRating] = useState<number>(0);

  useEffect(() => {
    axios
      .get(`https://localhost:5000/Movie/GetMovieById/${show_id}`, {
        withCredentials: true,
      })
      .then((response) => setMovie(response.data))
      .catch((error) => console.error("Error fetching movie:", error));
  }, [show_id]);

  if (!movie) {
    return (
      <div className="text-white text-center mt-16 text-lg">
        Loading movie details...
      </div>
    );
  }

  const encodedTitle = encodeURIComponent(movie.title);
  const imageUrl = `https://moviepostersintex2.blob.core.windows.net/movieposter/Movie Posters/${encodedTitle}.jpg`;

  const genreList = Object.entries(movie)
    .filter(([key, value]) => typeof value === "number" && value === 1)
    .map(([key]) => key.replace(/_/g, " "))
    .join(", ");

  const handleStarClick = (rating: number) => {
    setUserRating(rating);
    console.log(`User rated: ${rating} stars`);
  };

  console.log("Current show_id:", show_id);
  return (
    <div className="bg-background min-h-screen text-foreground">
      {/* Header */}
      <Header />

      {/* Main Hero Section: Poster + Info */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-10 px-8 py-12 animate-fadeIn">
        {/* Poster */}
        <div className="flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500">
          <img
            src={imageUrl}
            alt={movie.title}
            className="w-full max-w-xs h-[500px] object-cover rounded-2xl"
          />
        </div>

        {/* Movie Info */}
        <div className="flex flex-col justify-start space-y-4 text-left w-full max-w-xl">
          <h1 className="text-5xl font-extrabold">{movie.title}</h1>
          <p className="text-muted-foreground text-sm">
            {movie.release_year} • {movie.duration} • {movie.rating}
          </p>

          <div>
            <h2 className="text-xl font-semibold mb-1">Overview</h2>
            <p className="text-muted-foreground">{movie.description}</p>
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">Starring:</span>{" "}
              {movie.cast}
            </p>
            <p>
              <span className="font-semibold text-foreground">Director:</span>{" "}
              {movie.director}
            </p>
            <p>
              <span className="font-semibold text-foreground">Genre:</span>{" "}
              {genreList || "Unknown"}
            </p>
          </div>

          {/* Star Rating */}
          <div>
            <p className="font-semibold mb-2 text-foreground">Your Rating:</p>
            <div className="flex space-x-1 text-yellow-400 text-2xl cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className={`transition-transform ${userRating >= star ? "scale-125" : ""}`}
                >
                  {userRating >= star ? "⭐" : "☆"}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder Sections (Now at the bottom!) */}

      <MovieRecommendation show_id={show_id!} />
      <div className="space-y-8 max-w-7xl mx-auto px-8 pb-12">
        {["User Reviews", "Trailers & Behind the Scenes"].map(
          (section, index) => (
            <div
              key={index}
              className="bg-muted rounded-2xl p-6 shadow-xl transform hover:-translate-y-1 transition duration-300"
            >
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {section}
              </h3>
              <p className="text-muted-foreground">Content coming soon...</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
