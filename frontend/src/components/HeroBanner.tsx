import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Movie } from "../types/Movie";
import "../pages/css/MoviePage.css";

const HeroBanner: React.FC = () => {
  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const [ratingsMap, setRatingsMap] = useState<
    Record<string, { avg: number; count: number }>
  >({});
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const blobUrl = import.meta.env.VITE_BLOB_API_URL;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/Movie/TopRatedMovies`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(async (movies: Movie[]) => {
        setHeroMovies(movies);

        const ratingData: Record<string, { avg: number; count: number }> = {};
        await Promise.all(
          movies.map(async (movie) => {
            const res = await fetch(
              `${import.meta.env.VITE_API_URL}/Movie/GetMovieRatingsCount/${movie.show_id}`,
              { credentials: "include" }
            );
            const json = await res.json();
            ratingData[movie.show_id] = {
              avg: json.averageRating,
              count: json.ratingCount,
            };
          })
        );
        setRatingsMap(ratingData);
      });
  }, []);

  const getPosterUrl = (title: string) => {
    if (!title || title.trim() === "") {
      return `${blobUrl}/placeholder.jpg`;
    }

    const removals = /[()'".,?!#"]/g;

    let cleanTitle = title
      .replace(/\s*([&:/-])\s*/g, "␣␣")
      .replace(removals, "")
      .replace(/\s+/g, " ")
      .replace(/␣␣/g, "  ")
      .trim();

    const encodedTitle = encodeURIComponent(cleanTitle);
    const folderName = encodeURIComponent("Movie Posters");

    return `${blobUrl}/${folderName}/${encodedTitle}.jpg`;
  };

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (heroMovies.length === 0) return null;

  return (
    <div className="hero-banner-container">
      <div className="hero-scroll" ref={scrollContainerRef}>
        {heroMovies.map((movie) => (
          <div
            key={movie.show_id}
            className="hero-banner"
            style={{ backgroundImage: `url(${getPosterUrl(movie.title)})` }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1 className="hero-title">{movie.title}</h1>
              <p className="hero-description">{movie.description}</p>
              <p className="hero-rating">
                ⭐ {ratingsMap[movie.show_id]?.avg ?? "?"} (
                {ratingsMap[movie.show_id]?.count ?? 0} ratings)
              </p>
              <div className="hero-buttons">
                <button onClick={() => navigate(`/movie/${movie.show_id}`)}>
                  Play
                </button>
                <button onClick={() => navigate(`/movie/${movie.show_id}`)}>
                  More Info
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Arrows */}
      <button className="hero-arrow left" onClick={() => scroll("left")}>
        ‹
      </button>
      <button className="hero-arrow right" onClick={() => scroll("right")}>
        ›
      </button>

      {/* Fade separator to next section */}
      <div className="hero-fade-bottom"></div>
    </div>
  );
};

export default HeroBanner;
