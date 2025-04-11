import { useEffect, useState } from "react"; // ✅ React hooks for state management and side effects
import { Movie, GENRES } from "../types/Movie"; // ✅ Movie type and genre list
import { deleteMovie, fetchMovies } from "../api/movieAPI"; // ✅ API functions for fetching and deleting movies
import { useNavigate } from "react-router-dom"; // ✅ Hook for navigation
import Pagination from "../components/pagination"; // ✅ Pagination component
import AuthorizeView from "../components/AuthorizeView"; // ✅ Authorization wrapper
import Header from "../components/Header"; // ✅ Header component
import "./css/AdminPage.css"; // ✅ Styles for Admin Page
import Footer from "../components/Footer"; // ✅ Footer component
import ContainerFilter from "../components/ContainerFilter"; // ✅ Filter component for movie types and genres

const AdminPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]); // ✅ Movie list state
  const [error, setError] = useState<string>(""); // ✅ Error message state
  const [pageSize, setPageSize] = useState<number>(10); // ✅ Movies per page
  const [pageNumber, setPageNumber] = useState<number>(1); // ✅ Current page number
  const [totalPages, setTotalPages] = useState<number>(0); // ✅ Total number of pages
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search input state
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm); // ✅ Debounced search term
  const [selectedType, setSelectedType] = useState<string | null>(null); // ✅ Selected movie type filter
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]); // ✅ Selected genres filter
  const [selectedYear, setSelectedYear] = useState<number | "">(""); // ✅ Selected release year filter
  const navigate = useNavigate(); // ✅ Hook to navigate between routes

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm); // ✅ Debounce search term after typing
      setPageNumber(1); // ✅ Reset to first page on new search
    }, 500);
    return () => clearTimeout(timeout); // ✅ Cleanup timeout
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
      setMovies(data.movies); // ✅ Update movies state
      setTotalPages(Math.ceil(data.totalNumberMovies / pageSize)); // ✅ Calculate total pages
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      setError("Failed to load movies. Please try again later."); // ✅ Set error message
    }
  };

  useEffect(() => {
    getMovies(); // ✅ Fetch movies when dependencies change
  }, [
    pageSize,
    pageNumber,
    debouncedSearch,
    selectedType,
    selectedGenres,
    selectedYear,
  ]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return; // ✅ Confirm before delete
    try {
      await deleteMovie(id); // ✅ Delete movie
      getMovies(); // ✅ Refresh movie list
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed."); // ✅ Show delete failure message
    }
  };

  const clearAllFilters = () => {
    setSelectedType(null); // ✅ Clear type filter
    setSelectedGenres([]); // ✅ Clear genres filter
    setSelectedYear(""); // ✅ Clear year filter
    setPageNumber(1); // ✅ Reset to first page
  };

  function getActiveGenres(movie: Movie): string[] {
    return GENRES.filter(
      (g) =>
        movie[g] === 1 || movie[g.toLowerCase() as keyof typeof movie] === 1
    ); // ✅ Get genres from movie object
  }

  return (
    <>
      <Header /> {/* ✅ Page header */}
      <AuthorizeView> {/* ✅ Authorization wrapper */}
        <div className="container-fluid pt-4 pb-4 bg-white"> {/* ✅ Page container */}
          <div className="row"> {/* ✅ Grid row */}
            <div className="col-auto mb-4"> {/* ✅ Filter sidebar */}
              <ContainerFilter
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedGenres={selectedGenres}
                setSelectedGenres={setSelectedGenres}
                clearAllFilters={clearAllFilters}
              />
              <div className="mb-3"> {/* ✅ Year filter input */}
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

            <div className="col-md-9"> {/* ✅ Main content area */}
              <div className="d-flex justify-content-between align-items-center mb-3"> {/* ✅ Page title */}
                <h1>Admin Page</h1>
              </div>

              <div className="d-flex gap-2 mb-3"> {/* ✅ Action buttons */}
                <button
                  className="btn btn-success"
                  onClick={() => navigate("/admin/new")}
                >
                  ➕ Add New Movie
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/admin/users")}
                >
                  👥 Manage Users
                </button>
              </div>

              <div className="mb-3"> {/* ✅ Search input */}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title, Director, or Cast..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>} {/* ✅ Error alert */}

              <table className="table table-striped table-bordered table-sm"> {/* ✅ Movies table */}
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
              /> {/* ✅ Pagination controls */}
            </div>
          </div>
        </div>
      </AuthorizeView>
      <Footer /> {/* ✅ Page footer */}
    </>
  );
};

export default AdminPage; // ✅ Export component for routing