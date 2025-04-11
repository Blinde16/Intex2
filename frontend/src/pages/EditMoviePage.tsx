import EditMovieForm from "../components/EditMovieForm"; // ✅ Import the edit movie form component
import { useNavigate, useParams } from "react-router-dom"; // ✅ Hooks for navigation and route parameters
import Header from "../components/Header"; // ✅ Import header component
import Footer from "../components/Footer"; // ✅ Import footer component
import AuthorizeView from "../components/AuthorizeView"; // ✅ Authorization wrapper to protect the page
import { useEffect, useState } from "react"; // ✅ React hooks for side effects and state management
import { fetchMovieById } from "../api/movieAPI"; // ✅ API function to fetch movie details by ID
import { Movie } from "../types/Movie"; // ✅ Import Movie type definition

const EditMoviePage = () => {
  const { movieId } = useParams(); // ✅ Extract movieId from URL parameters
  const navigate = useNavigate(); // ✅ Hook to navigate between pages
  const [movie, setMovie] = useState<Movie | null>(null); // ✅ State to store fetched movie data

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) return; // ✅ Guard clause if no movieId is provided
      try {
        const data = await fetchMovieById(movieId); // ✅ Fetch movie data from API
        setMovie(data); // ✅ Update state with fetched movie
      } catch (error) {
        console.error("Failed to fetch movie:", error); // ✅ Log any fetch errors
      }
    };
    fetchMovie(); // ✅ Trigger data fetch on component mount
  }, [movieId]);

  if (!movie) {
    return (
      <div className="bg-background min-h-screen text-white flex items-center justify-center"> {/* ✅ Loading state */}
        <p className="text-lg">Loading movie data...</p>
      </div>
    );
  }

  return (
    <>
      <Header /> {/* ✅ Page header */}
      <AuthorizeView> {/* ✅ Ensure user is authorized to access this page */}
        <div className="bg-background min-h-screen text-white flex flex-col items-center justify-start py-12 px-4"> {/* ✅ Page layout container */}
          <div className="w-full max-w-4xl flex flex-col md:flex-row gap-10"> {/* ✅ Layout for the form */}
            {/* Form Section */}
            <div className="flex flex-col justify-start space-y-4 w-full"> {/* ✅ Form container */}
              <EditMovieForm
                movieId={movieId!} // ✅ Pass movieId as prop (non-null assertion)
                onSuccess={() => navigate("/adminPage")} // ✅ Navigate to admin page on successful edit
                onCancel={() => navigate("/adminPage")} // ✅ Navigate to admin page on cancel
              />
            </div>
          </div>
        </div>
      </AuthorizeView>
      <Footer /> {/* ✅ Page footer */}
    </>
  );
};

export default EditMoviePage; // ✅ Export component for routing
