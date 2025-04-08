import { useEffect, useState } from "react";
import { Movie, GENRES } from "../types/Movie";
import { deleteMovie, fetchMovies } from "../api/movieAPI";
import Pagination from "../components/pagination";
import NewMovieForm from "../components/NewMovieForm";
import EditMovieForm from "../components/EditMovieForm";
import AuthorizeView, { AuthorizedUser } from "../components/AuthorizeView";
import Logout from "../components/Logout";

const AdminPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
    const [addingNew, setAddingNew] = useState(false);
    const [error, setError] = useState<string>("");
  
    const getMovies = async () => {
      try {
        const data = await fetchMovies(50, 1, []);
        setMovies(data.movies);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError("Failed to load movies. Please try again later.");
      }
    };
  
    useEffect(() => {
      getMovies();
    }, []);
  
    const handleDelete = async (id: string) => {
      if (!window.confirm("Are you sure you want to delete this movie?")) return;
      try {
        await deleteMovie(id);
        getMovies();
      } catch (err) {
        console.error("Delete failed", err);
        alert("Delete failed.");
      }
    };
  
    return (
      <AuthorizeView>
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1>Admin Page</h1>
            <Logout>
              Logout <AuthorizedUser value="email" />
            </Logout>
          </div>
  
          <button
            className="btn btn-success mb-3"
            onClick={() => {
              setAddingNew(true);
              setEditingMovie(null);
            }}
          >
            Add New Movie
          </button>
  
          {addingNew && (
            <NewMovieForm
              onSuccess={() => {
                setAddingNew(false);
                getMovies();
              }}
              onCancel={() => setAddingNew(false)}
            />
          )}
  
          {editingMovie && (
            <EditMovieForm
              movie={editingMovie}
              onSuccess={() => {
                setEditingMovie(null);
                getMovies();
              }}
              onCancel={() => setEditingMovie(null)}
            />
          )}
  
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
                    <td>{GENRES.filter((genre) => p[genre]).join(", ")}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm w-100 mb-1"
                        onClick={() => {
                          setEditingMovie(p);
                          setAddingNew(false);
                        }}
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
        </div>
      </AuthorizeView>
    );
  };
  
  export default AdminPage;
