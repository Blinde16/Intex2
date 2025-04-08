import React, { useEffect, useState } from "react";
import { Movie } from "../types/Movie"; // adjust import path as needed
import AuthorizeView from "./AuthorizeView";

const Adventure: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching adventure movies with fetch API...");
    setLoading(true);

    fetch("https://localhost:5000/Movie/adventure", {
      method: "GET",
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Movies received:", data);
        if (Array.isArray(data)) {
          setMovies(data);
        } else {
          console.error("Expected array but got:", typeof data);
          setError("Received unexpected data format from server");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching adventure movies:", err);
        setError(`Failed to load adventure movies: ${err.message}`);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">Loading adventure movies...</div>;

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  if (movies.length === 0)
    return <div className="p-4">No adventure movies found.</div>;

  return (
    <AuthorizeView>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {movies.map((movie, index) => (
        <div
          key={movie.show_id || index}
          className="p-4 shadow-md rounded-lg bg-white border border-gray-200"
        >
          <h2 className="text-xl font-bold">{movie.title}</h2>
          <p className="text-gray-600">
            {movie.type} • {movie.release_year} • {movie.rating}
          </p>
          {movie.duration && <p className="text-gray-500">{movie.duration}</p>}
          <p className="mt-2">{movie.description}</p>
        </div>
      ))}
    </div>
    </AuthorizeView>
  );
};

export default Adventure;
