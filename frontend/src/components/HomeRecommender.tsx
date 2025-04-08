import React, { useEffect, useState } from "react";
import { Movie } from "../types/Movie";
import "./css/Recommender.css"; // bring in the custom CSS

const genreFields = [
  "action",
  "adventure",
  "anime_Series_International_TV_Shows",
  "british_TV_Shows_Docuseries_International_TV_Shows",
  "children",
  "comedies",
  "comedies_Dramas_International_Movies",
  "comedies_International_Movies",
  "comedies_Romantic_Movies",
  "crime_TV_Shows_Docuseries",
  "documentaries",
  "documentaries_International_Movies",
  "docuseries",
  "dramas",
  "dramas_International_Movies",
  "dramas_Romantic_Movies",
  "family_Movies",
  "fantasy",
  "horror_Movies",
  "international_Movies_Thrillers",
  "international_TV_Shows_Romantic_TV_Shows_TV_Dramas",
  "kids_TV",
  "language_TV_Shows",
  "musicals",
  "nature_TV",
  "reality_TV",
  "spirituality",
  "tV_Action",
  "tV_Comedies",
  "tV_Dramas",
  "talk_Shows_TV_Comedies",
  "thrillers",
];

const Adventure: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://localhost:5000/Movie/adventure", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
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
      .then((data) => {
        console.log("Fetched movies:", data); // ← log them!
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

  // Group movies by genre
  const genreToMoviesMap: { [genre: string]: Movie[] } = {};

  genreFields.forEach((genre) => {
    genreToMoviesMap[genre] = Array.from(
      new Map(
        movies
          .filter((movie) => (movie as any)[genre] === 1)
          .map((movie) => [movie.show_id, movie]) // map by unique show_id
      ).values()
    );
  });

  const getPosterUrl = (title: string) => {
    const cleanTitle = title
      .replace(/[()'":?!,&#.]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encodedTitle = encodeURIComponent(cleanTitle);
    const folderName = encodeURIComponent("Movie Posters");
    return `https://moviepostersintex2.blob.core.windows.net/movieposter/${folderName}/${encodedTitle}.jpg`;
  };

  console.log("Genre map:", genreToMoviesMap);
  const renderedMovieIds = new Set<string>();

  return (
    <div className="p-6">
      {Object.entries(genreToMoviesMap).map(([genre, genreMovies]) => {
        if (!genreMovies || genreMovies.length < 5) return null;

        const overlapCount = genreMovies.filter((movie) =>
          renderedMovieIds.has(movie.show_id)
        ).length;

        if (overlapCount >= 5) return null; // ❌ skip this section if 3+ repeats

        // ✅ add this genre's movies to the global set
        genreMovies.forEach((movie) => renderedMovieIds.add(movie.show_id));

        return (
          <div key={genre} className="mb-10">
            <h1 className="text-2xl font-bold text-white mb-4">
              {genre
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
              Movies You Might Like
            </h1>
            <div className="movie-grid">
              {genreMovies.map((movie) => (
                <div key={movie.show_id} className="movie-card">
                  <img
                    src={getPosterUrl(movie.title)}
                    alt={movie.title}
                    className="movie-poster"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <p>
                      {movie.type} • {movie.release_year} • {movie.rating}
                    </p>
                    <p>{movie.duration}</p>
                    <p>{movie.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Adventure;
