import { useEffect, useState } from "react";
import { Movie } from "../types/Movie";
import { deleteMovie, fetchMovies } from "../api/movieAPI";
import Pagination from "../components/pagination";
import NewMovieForm from "../components/NewMovieForm";
import EditMovieForm from "../components/EditMovieForm";

const AdminProjectsPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchMovies(pageSize, pageNumber, []);
        setMovies(data.movies);
        setTotalPages(Math.ceil(data.totalNumberMovies / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [pageSize, pageNumber]);

  const handleDelete = async (show_id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    try {
      await deleteMovie(show_id);
      setMovies(movies.filter((p) => p.show_id !== show_id));
    } catch (error) {
      alert("failed to delete movie. Please try again. ");
    }
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p className="text-red 500">Error: {error}</p>;

  return (
    <div>
      <h1>Admin - Books</h1>
      {!showForm}
      <button
        className="btn btn-success mb-3"
        onClick={() => setShowForm(true)}
      >
        Add Book
      </button>
      {showForm && (
        <NewMovieForm
          onSuccess={() => {
            setShowForm(false);
            fetchMovies(pageSize, pageNumber, []).then((data) =>
              setMovies(data.movies)
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
      {editingMovie && (
        <EditMovieForm
          movie={editingMovie}
          onSuccess={() => {
            setEditingMovie(null);
            fetchMovies(pageSize, pageNumber, []).then((data) =>
              setMovies(data.movies)
            );
          }}
          onCancel={() => setEditingMovie(null)}
        />
      )}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Show_id</th>
            <th>Type</th>
            <th>Title</th>
            <th>Director</th>
            <th>Cast</th>
            <th>Country</th>
            <th>release_year</th>
            <th>rating</th>
            <th>duration</th>
            <th>Genre</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {movies.map((p) => (
            <tr key={p.show_id}>
              <td>{p.show_id}</td>
              <td>{p.type}</td>
              <td>{p.title}</td>
              <td>{p.director}</td>
              <td>{p.cast}</td>
              <td>{p.country}</td>
              <td>{p.release_year}</td>
              <td>{p.rating}</td>
              <td>{p.duration}</td>
              <td>{p.Action}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm w-100 mb-1"
                  onClick={() => setEditingMovie(p)}
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
          ))}
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
  );
};

export default AdminProjectsPage;
