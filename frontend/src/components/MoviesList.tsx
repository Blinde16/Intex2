import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Movie } from "../types/Movie";

function MoviesList({ selectedTypes }: { selectedTypes: string[] }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompetition = async () => {
      const containerParams = selectedTypes
        .map((cont) => `containers=${encodeURIComponent(cont)}`)
        .join("&");

      const response = await fetch(
        `https://localhost:5000/Competition/GetRootbeers?pageSize=${pageSize}&pageNum=${pageNum}${selectedTypes.length ? `&${containerParams}` : ""}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      setMovies(data.brews);
      setTotalItems(data.totalNumProjects);
      setTotalPages(Math.ceil(totalItems / pageSize));
    };
    fetchCompetition();
  }, [pageSize, pageNum, totalItems, selectedTypes]);
}
