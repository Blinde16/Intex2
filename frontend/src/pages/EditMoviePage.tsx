import EditMovieForm from "../components/EditMovieForm";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthorizeView from "../components/AuthorizeView";
import { useEffect, useState } from "react";
import { fetchMovieById } from "../api/movieAPI";
import { Movie } from "../types/Movie";

const EditMoviePage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) return;
      try {
        const data = await fetchMovieById(movieId);
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      }
    };
    fetchMovie();
  }, [movieId]);

  if (!movie) {
    return (
      <div className="bg-background min-h-screen text-white flex items-center justify-center">
        <p className="text-lg">Loading movie data...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <AuthorizeView>
        <div className="bg-background min-h-screen text-white flex flex-col items-center justify-start py-12 px-4">
          <div className="w-full max-w-4xl flex flex-col md:flex-row gap-10">
            {/* Form Section */}
            <div className="flex flex-col justify-start space-y-4 w-full">
              <EditMovieForm
                movieId={movieId!}
                onSuccess={() => navigate("/adminPage")}
                onCancel={() => navigate("/adminPage")}
              />
            </div>
          </div>
        </div>
      </AuthorizeView>
      <Footer />
    </>
  );
};

export default EditMoviePage;
