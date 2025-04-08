import { useEffect, useState, useRef } from "react";
import { Movie } from "../types/Movie";
import { useNavigate } from "react-router-dom";
import './css/movielist.css';
import Adventure from "./Adventure";

function MovieList({ selectedContainers }: { selectedContainers: string[] }) {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const navigate = useNavigate();
  const isInitialLoad = useRef(true);

  const fetchMovies = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const containerParams = selectedContainers
      .map((cont) => `containers=${encodeURIComponent(cont)}`)
      .join("&");

    const afterIdParam =
      movieList.length > 0
        ? `afterId=${movieList[movieList.length - 1].show_id}&`
        : "";

    const url = `https://localhost:5000/Movie/GetMovies?${afterIdParam}${containerParams}`;

    try {
      const response = await fetch(url, { credentials: "include" });

      if (!response.ok) {
        throw new Error(`Error fetching movies: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.brews.length === 0) {
        setHasMore(false);
      } else {
        setMovieList((prevMovies) => {
          const allMovies = [...prevMovies, ...data.brews];
          const uniqueMovies = Array.from(new Map(allMovies.map(m => [m.show_id, m])).values());
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
  }, [selectedContainers]);

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
  }, [movieList, hasMore, selectedContainers]); // ❌ Problem: these dependencies
  

  const getPosterUrl = (title: string) => {
    const cleanTitle = title
      .replace(/[()'":?!,&#.]/g, " ") 
      .replace(/\s+/g, " ")       
      .trim();                    
  
    const encodedTitle = encodeURIComponent(cleanTitle);
    const folderName = encodeURIComponent("Movie Posters");
    return `https://moviepostersintex2.blob.core.windows.net/movieposter/${folderName}/${encodedTitle}.jpg`;
  };
  

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
