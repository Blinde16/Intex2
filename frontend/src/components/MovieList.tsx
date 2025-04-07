import { useEffect, useState, useRef, useCallback } from "react";
import { Movie } from "../types/Movie";
import { useNavigate } from "react-router-dom";

function MovieList({ selectedContainers }: { selectedContainers: string[] }) {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [pageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const fetchMovies = useCallback(async () => {
    const containerParams = selectedContainers
      .map((cont) => `containers=${encodeURIComponent(cont)}`)
      .join("&");

    const response = await fetch(
      `https://localhost:5000/Movie/GetMovies?pageSize=${pageSize}&pageNum=${pageNum}${selectedContainers.length ? `&${containerParams}` : ""}`,
      {
        credentials: "include",
      }
    );

    const data = await response.json();

    setMovieList((prev) => [...prev, ...data.brews]);
    setHasMore(data.brews.length === pageSize);
  }, [pageSize, pageNum, selectedContainers]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore]);

  return (
    <>
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
