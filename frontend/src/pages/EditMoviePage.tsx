import EditMovieForm from "../components/EditMovieForm";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { fetchMovieById } from "../api/movieAPI";
import { Movie } from "../types/Movie";

const formStyles = `
  input, textarea, select {
    background-color: #2a2a2a !important;
    color: white !important;
    border: 1px solid #444 !important;
    border-radius: 0.375rem !important;
    padding: 0.5rem 0.75rem !important;
  }
  input:focus, textarea:focus, select:focus {
    background-color: #3a3a3a !important;
    border-color: #6366f1 !important;
    outline: none !important;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3) !important;
  }
  ::placeholder {
    color: #9ca3af !important;
  }
  option {
    background-color: #2a2a2a !important;
    color: white !important;
  }
`;

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

  const encodedTitle = encodeURIComponent(movie.title);
  const posterUrl = `https://moviepostersintex2.blob.core.windows.net/movieposter/Movie Posters/${encodedTitle}.jpg`;

  return (
    <div className="bg-background min-h-screen text-white">
      <style>{formStyles}</style>
      <Header />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-10 px-8 py-12 animate-fadeIn">
        {/* Poster */}
        <div className="flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full max-w-xs h-[500px] object-cover rounded-2xl"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        {/* Form Section */}
        <div className="flex flex-col justify-start space-y-4 w-full max-w-xl bg-gray-900 p-6 rounded-2xl shadow-xl md:ml-6">
          <h1 className="text-4xl font-extrabold text-purple-400 mb-4">✏️ Edit Movie</h1>
          <EditMovieForm
            movieId={movieId!}
            onSuccess={() => navigate("/adminPage")}
            onCancel={() => navigate("/adminPage")}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditMoviePage;
