import React, { useEffect, useState } from "react";
import { Movie } from "../types/Movie"; // make sure this type matches actual field names

const Adventure: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    fetch("https://localhost:5000/Movie/adventure", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(movies),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(`Failed to load adventure movies: ${err.message}`);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="p-4 text-white">Loading adventure movies...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (movies.length === 0)
    return <div className="p-4 text-white">No adventure movies found.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {movies.map((movie) => (
        <div
          key={movie.show_id}
          className="bg-gray-900 text-white p-4 rounded-lg shadow-lg border border-gray-700 hover:shadow-xl transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-1">{movie.title}</h2>
          <p className="text-sm text-gray-400 mb-2">
            {movie.type} • {movie.release_year} • {movie.rating}
          </p>
          <p className="text-gray-300 mb-2">{movie.duration}</p>
          <p className="text-sm text-gray-200">{movie.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Adventure;
