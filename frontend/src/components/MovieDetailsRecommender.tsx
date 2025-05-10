import React, { useEffect, useState } from "react";
import { Movie } from "../types/Movie";
import { useNavigate } from "react-router-dom";

//This is a recommender that takes the JSON passed and gives 5 recommendations that are similar to the movie
//that is displayed on the movie details page.

interface Props {
  show_id: string;
}

const MovieRecommendation: React.FC<Props> = ({ show_id }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const blobUrl = import.meta.env.VITE_BLOB_API_URL;

  const getPosterUrl = (title: string) => {
    const cleanTitle = title
      .replace(/[()'":?!,&#.]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encodedTitle = encodeURIComponent(cleanTitle);
    const folderName = encodeURIComponent("Movie Posters");
    return `${blobUrl}/${folderName}/${encodedTitle}.jpg`;
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
            credentials: "include",
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
      <p className="text-muted-foreground px-6 w-full">
        No similar movies found.
      </p>
    );

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-6 overflow-hidden">
      <h2 className="text-2xl font-bold text-foreground mb-4">
        You might also like
      </h2>
      <div className="flex overflow-x-auto space-x-4 w-full snap-x snap-mandatory scroll-smooth">
        {movies.map((movie) => (
          <div
            key={movie.show_id}
            className="flex-shrink-0 w-44 bg-muted rounded-xl p-4 shadow-lg hover:shadow-xl transition-transform hover:scale-105 snap-start"
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
