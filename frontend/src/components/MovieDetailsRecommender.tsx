// MovieDetailsRecommender.tsx (aka MovieRecommendation)
import React, { useEffect, useState } from "react";
import { Movie } from "../types/Movie"; // Make sure your type is correctly defined
import { useNavigate } from "react-router-dom";

interface Props {
  show_id: string;
}

const MovieRecommendation: React.FC<Props> = ({ show_id }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const getPosterUrl = (title: string) => {
    const cleanTitle = title
      .replace(/[()'":?!,&#.]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encodedTitle = encodeURIComponent(cleanTitle);
    const folderName = encodeURIComponent("Movie Posters");
    return `https://moviepostersintex2.blob.core.windows.net/movieposter/${folderName}/${encodedTitle}.jpg`;
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/Movie/recommendations/${show_id}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            credentials: "include", // <-- Sends cookies (auth info)
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch recommendations: ${response.status}`
          );
        }

        const data: Movie[] = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, [show_id]);

  if (!movies.length)
    return (
      <p className="text-muted-foreground px-8">No similar movies found.</p>
    );

  return (
    <div className="max-w-7xl mx-auto px-8 py-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">
        You might also like
      </h2>
      <div className="flex overflow-x-auto space-x-4">
        {movies.map((movie) => (
          <div
            key={movie.show_id}
            className="min-w-[200px] bg-muted rounded-xl p-4 shadow-lg hover:shadow-xl transition-transform hover:scale-105"
          >
            <img
              src={getPosterUrl(movie.title)}
              alt={movie.title}
              className="w-full h-64 object-cover rounded-lg mb-3"
              onClick={() => navigate(`/movie/${movie.show_id}`)}
            />
            <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
            <p className="text-sm text-muted-foreground">
              {movie.release_year}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {movie.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieRecommendation;
