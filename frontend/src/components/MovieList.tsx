import { useEffect, useState, useRef, useCallback } from "react";
import { Movie } from "../types/Movie";
import { useNavigate } from "react-router-dom";
import Adventure from "./Adventure";

function MovieList({ selectedContainers }: { selectedContainers: string[] }) {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [lastId, setLastId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const fetchMovies = useCallback(async () => {
    const containerParams = selectedContainers
      .map((cont) => `containers=${encodeURIComponent(cont)}`)
      .join("&");

    const url = `https://localhost:5000/Movie/GetMovies?${lastId ? `afterId=${lastId}&` : ""}${containerParams}`;

    const response = await fetch(url, { credentials: "include" });
    const data = await response.json();

    if (data.brews.length === 0) {
      setHasMore(false);
      return;
    }

    setMovieList((prev) => [...prev, ...data.brews]);
    setLastId(data.brews[data.brews.length - 1].show_id); // update lastId
  }, [selectedContainers, lastId]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMovies();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore, fetchMovies]);

  return (
    <>
    <Adventure />
      {movieList.map((m) => (
        <div id="rootbeerCard" className="card" key={m.show_id}>
          <h2 className="card-title">{m.title}</h2>
          <div className="card-body">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>Release Year:</strong> {m.release_year}
              </li>
              <li className="list-group-item">
                <strong>Description:</strong> {m.description}
              </li>
            </ul>
          </div>
        </div>
      ))}
      <div ref={loaderRef} style={{ height: "50px", textAlign: "center" }}>
        {hasMore ? "Loading more..." : "No more movies 👀"}
      </div>
    </>
  );
}

export default MovieList;
