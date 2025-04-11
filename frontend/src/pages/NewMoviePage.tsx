import NewMovieForm from "../components/NewMovieForm"; // ✅ Import the form component for adding a new movie
import { useNavigate } from "react-router-dom"; // ✅ Hook for navigation between routes
import Header from "../components/Header"; // ✅ Page header component
import Footer from "../components/Footer"; // ✅ Page footer component
import AuthorizeView from "../components/AuthorizeView"; // ✅ Authorization wrapper to protect the page

const NewMoviePage = () => {
  const navigate = useNavigate(); // ✅ Navigation function to programmatically redirect users

  return (
    <>
      <Header /> {/* ✅ Page header at the top */}
      <AuthorizeView> {/* ✅ Ensure authorized access to this page */}
        <div className="bg-background min-h-screen text-white flex flex-col items-center justify-start py-12 px-4"> {/* ✅ Page layout and styling */}
          <div className="w-full max-w-3xl"> {/* ✅ Container for the form content */}
            <h1 className="text-4xl font-extrabold text-purple-400 mb-8"> {/* ✅ Page title */}
              🎬 Add New Movie
            </h1>
            <NewMovieForm
              onSuccess={() => navigate("/adminPage")} // ✅ Navigate back to admin page on successful submission
              onCancel={() => navigate("/adminPage")} // ✅ Navigate back to admin page on cancellation
            />
          </div>
        </div>
      </AuthorizeView>
      <Footer /> {/* ✅ Page footer at the bottom */}
    </>
  );
};

export default NewMoviePage; // ✅ Export the component for use in routing
