import NewMovieForm from "../components/NewMovieForm";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthorizeView from "../components/AuthorizeView";

const NewMoviePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <AuthorizeView>
        <div className="bg-background min-h-screen text-white flex flex-col items-center justify-start py-12 px-4">
          <div className="w-full max-w-3xl">
            <h1 className="text-4xl font-extrabold text-purple-400 mb-8">
              🎬 Add New Movie
            </h1>
            <NewMovieForm
              onSuccess={() => navigate("/adminPage")}
              onCancel={() => navigate("/adminPage")}
            />
          </div>
        </div>
      </AuthorizeView>
      <Footer />
    </>
  );
};

export default NewMoviePage;
