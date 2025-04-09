import { useEffect, useState, useRef } from "react";
import { Movie } from "../types/Movie";
import { useNavigate } from "react-router-dom";
import "./css/movielist.css";

function MovieList({
  selectedContainers,
  selectedType,
  selectedGenres,
  searchTerm, // ✅ Add this prop
}: {
  selectedContainers: string[];
  selectedType: string | null;
  selectedGenres: string[];
  searchTerm: string; // ✅ Add this type
}) {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const isInitialLoad = useRef(true);

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

  const fetchMovies = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const params = new URLSearchParams();

    if (selectedContainers.length > 0) {
      selectedContainers.forEach((container) =>
        params.append("containers", container)
      );
    }

    if (selectedGenres.length > 0) {
      selectedGenres.forEach((genre) => params.append("genres", genre));
    }

    if (selectedType) {
      params.append("type", selectedType);
    }

    if (searchTerm.trim()) {
      params.append("title", searchTerm.trim()); // ✅ Add search term to query params
    }

    if (movieList.length > 0) {
      params.append("afterId", movieList[movieList.length - 1].show_id);
    }

    const url = `https://localhost:5000/Movie/GetMovies?${params.toString()}`;

    try {
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok)
        throw new Error(`Error fetching movies: ${response.statusText}`);

      const data = await response.json();

      if (data.brews.length === 0) {
        setHasMore(false);
      } else {
        setMovieList((prevMovies) => {
          const allMovies = [...prevMovies, ...data.brews];
          const uniqueMovies = Array.from(
            new Map(allMovies.map((m) => [m.show_id, m])).values()
          );
          return uniqueMovies;
        });
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMovieList([]);
    setHasMore(true);
    isInitialLoad.current = true;
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContainers, selectedType, selectedGenres, searchTerm]); // ✅ Add searchTerm dependency

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        fetchMovies();
      }
    };

    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    movieList,
    hasMore,
    selectedContainers,
    selectedType,
    selectedGenres,
    searchTerm,
  ]);

  return (
    <div>
      <div className="movie-grid">
        {movieList.map((m) => (
          <div
            key={m.show_id}
            className="movie-card"
            onClick={() => navigate(`/movie/${m.show_id}`)}
          >
            <img
              src={getPosterUrl(m.title)}
              alt={m.title}
              className="movie-poster"
              onError={(e) =>
                (e.currentTarget.src =
                  "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=")
              }
            />
            <div className="movie-info">
              <h3>{m.title}</h3>
              <p>{m.release_year}</p>
            </div>
          </div>
        ))}
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {!hasMore && !loading && (
        <p style={{ textAlign: "center" }}>No more movies to show.</p>
      )}
    </div>
  );
}

export default MovieList;
