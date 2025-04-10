import { useEffect, useState } from "react";
import { Movie, GENRES } from "../types/Movie";
import { deleteMovie, fetchMovies } from "../api/movieAPI";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/pagination";
import AuthorizeView from "../components/AuthorizeView";
import Header from "../components/Header";
import "./css/AdminPage.css";
import Footer from "../components/Footer";
import ContainerFilter from "../components/ContainerFilter";

const AdminPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | "">("");
  const navigate = useNavigate();

  // Debounce searchTerm to reduce API spam
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPageNumber(1); // reset to page 1 when search changes
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const getMovies = async () => {
    try {
      const data = await fetchMovies(
        pageSize,
        pageNumber,
        selectedType ? [selectedType] : [],
        debouncedSearch,
        selectedYear ? Number(selectedYear) : undefined,
        selectedGenres
      );
      setMovies(data.movies);
      setTotalPages(Math.ceil(data.totalNumberMovies / pageSize));
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      setError("Failed to load movies. Please try again later.");
    }
  };

  useEffect(() => {
    getMovies();
  }, [
    pageSize,
    pageNumber,
    debouncedSearch,
    selectedType,
    selectedGenres,
    selectedYear,
  ]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await deleteMovie(id);
      getMovies();
    } catch (err) {
      console.error("Delete failed again", err);
      alert("Delete failed.");
    }
  };

  const clearAllFilters = () => {
    setSelectedType(null);
    setSelectedGenres([]);
    setSelectedYear("");
    setPageNumber(1);
  };

  function getActiveGenres(movie: Movie): string[] {
    return GENRES.filter(
      (g) =>
        movie[g] === 1 || movie[g.toLowerCase() as keyof typeof movie] === 1
    );
  }

  return (
    <>
      <Header />
      <AuthorizeView>
        <div className="container-fluid py-4">
          <div className="row">
            {/* Filter sidebar on the left */}
            <div className="col-auto mb-4">
              <ContainerFilter
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedGenres={selectedGenres}
                setSelectedGenres={setSelectedGenres}
                clearAllFilters={clearAllFilters}
              />
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Filter by Year"
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(
                      e.target.value ? parseInt(e.target.value) : ""
                    );
                    setPageNumber(1);
                  }}
                />
              </div>
            </div>
            {/* Main content area */}
            <div className="col-md-9">
              {/* Everything else goes here — search bar, button, tables, etc */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Admin Page</h1>
              </div>

              {/* Search Bar */}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title, Director, or Cast..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                className="btn btn-success mb-3"
                onClick={() => navigate("/admin/new")}
              >
                Add New Movie
              </button>

              {error && <div className="alert alert-danger">{error}</div>}

              <table className="table table-striped table-bordered table-sm">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Director</th>
                    <th>Cast</th>
                    <th>Country</th>
                    <th>Year</th>
                    <th>Rating</th>
                    <th>Duration</th>
                    <th>Genres</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(movies) && movies.length > 0 ? (
                    movies.map((p) => (
                      <tr key={p.show_id}>
                        <td>{p.show_id}</td>
                        <td>{p.type ?? "—"}</td>
                        <td>{p.title ?? "—"}</td>
                        <td>{p.director ?? "—"}</td>
                        <td>{p.cast ?? "—"}</td>
                        <td>{p.country ?? "—"}</td>
                        <td>{p.release_year}</td>
                        <td>{p.rating ?? "—"}</td>
                        <td>{p.duration ?? "—"}</td>
                        <td>
                          {getActiveGenres(p).map((g) => (
                            <span key={g} className="badge bg-secondary me-1">
                              {g.replace(/_/g, " ")}
                            </span>
                          ))}
                        </td>

                        <td>
                          <button
                            className="btn btn-primary btn-sm w-100 mb-1"
                            onClick={() => navigate(`/admin/edit/${p.show_id}`)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm w-100"
                            onClick={() => handleDelete(p.show_id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="text-center">
                        No movies found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <Pagination
                currentPage={pageNumber}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setPageNumber}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setPageNumber(1);
                }}
              />
            </div>
          </div>
        </div>
      </AuthorizeView>
      <Footer />
    </>
  );
};

export default AdminPage;
