import NewMovieForm from "../components/NewMovieForm";
import { useNavigate } from "react-router-dom";

const NewMoviePage = () => {
  const navigate = useNavigate();

  return (
    <div className="movie-details-container">
      <div className="movie-info">
        <h2>Add New Movie</h2>
        <NewMovieForm
          onSuccess={() => navigate("/adminPage")}
          onCancel={() => navigate("/adminPage")}
        />
      </div>
    </div>
  );
};

export default NewMoviePage;
