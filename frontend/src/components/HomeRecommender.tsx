import React, { useEffect, useState } from "react";
import { Movie } from "../types/Movie";
import "./css/Recommender.css";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const blobUrl = import.meta.env.VITE_BLOB_API_URL;

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/Movie/adventure`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
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

  const genreToMoviesMap: { [genre: string]: Movie[] } = {};
  genreFields.forEach((genre) => {
    genreToMoviesMap[genre] = Array.from(
      new Map(
        movies
          .filter((movie) => (movie as any)[genre] === 1)
          .map((movie) => [movie.show_id, movie])
      ).values()
    );
  });

  const getPosterUrl = (title: string) => {
    if (!title || title.trim() === "") {
      return `${blobUrl}/placeholder.jpg`;
    }

    const removals = /[()'".,?!:#"\-]/g; // Symbols to remove (basic ones)

    let cleanTitle = title
      .normalize("NFKD") // Normalize special characters (like smart quotes)
      .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "") // Remove smart quotes (single)
      .replace(/\s*([&/])\s*/g, "␣␣") // Remove spaces around & and /
      .replace(removals, "") // Remove decorative characters
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .replace(/␣␣/g, "  ") // Replace placeholder with real double space
      .trim();

    const encodedTitle = encodeURIComponent(cleanTitle);
    const folderName = encodeURIComponent("Movie Posters");

    return `${blobUrl}/${folderName}/${encodedTitle}.jpg`;
  };

  const scroll = (containerId: string, direction: "left" | "right") => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = container.clientWidth / 1.2;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const renderedMovieIds = new Set<string>();

  return (
    <div className="recommender-wrapper">
      {Object.entries(genreToMoviesMap).map(([genre, genreMovies], index) => {
        // ✅ Add your missing condition back:
        if (!genreMovies || genreMovies.length < 5) return null;

        const overlapCount = genreMovies.filter((movie) =>
          renderedMovieIds.has(movie.show_id)
        ).length;
        if (overlapCount >= 5) return null;

        genreMovies.forEach((movie) => renderedMovieIds.add(movie.show_id));

        const containerId = `scroll-container-${index}`;

        return (
          <div key={genre} className="carousel-section">
            <h1 className="carousel-title">
              {genre
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
              you might like…
            </h1>
            <div className="carousel-container">
              <button
                className="carousel-button left"
                onClick={() => scroll(containerId, "left")}
              >
                ‹
              </button>
              <div className="carousel-scroll" id={containerId}>
                {genreMovies.map((movie) => (
                  <div
                    key={movie.show_id}
                    className="carousel-card"
                    onClick={() => navigate(`/movie/${movie.show_id}`)}
                  >
                    <img
                      src={getPosterUrl(movie.title)}
                      alt={movie.title}
                      className="carousel-poster"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <div className="carousel-title-under">{movie.title}</div>
                  </div>
                ))}
              </div>
              <button
                className="carousel-button right"
                onClick={() => scroll(containerId, "right")}
              >
                ›
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Adventure;
