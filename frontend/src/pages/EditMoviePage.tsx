import EditMovieForm from "../components/EditMovieForm";
import { useNavigate, useParams } from "react-router-dom";

const EditMoviePage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  if (!movieId) return <p style={{ color: "white" }}>Invalid movie ID.</p>;

  return (
    <div className="movie-details-container">
      <div className="movie-info">
        <h2>Edit Movie</h2>
        <EditMovieForm
          movieId={movieId}
          onSuccess={() => navigate("/adminPage")}
          onCancel={() => navigate("/adminPage")}
        />
      </div>
    </div>
  );
};

export default EditMoviePage;
