import React, { useEffect, useState } from "react"; // ✅ Import React and hooks
import { useParams } from "react-router-dom"; // ✅ Hook to access route parameters
import Header from "../components/Header"; // ✅ Page header component
import axios from "axios"; // ✅ Axios for API requests
import MovieRecommendation from "../components/MovieDetailsRecommender"; // ✅ Movie recommendation component
import Footer from "../components/Footer"; // ✅ Footer component
import AuthorizeView from "../components/AuthorizeView"; // ✅ Authorization wrapper component

// ✅ Movie interface defining expected movie properties
interface Movie {
  show_id: string;
  title: string;
  director?: string;
  cast?: string;
  country?: string;
  release_year: number;
  rating?: string;
  duration?: string;
  description?: string;
  [key: string]: any; // ✅ Allow additional dynamic keys
}

const apiUrl = import.meta.env.VITE_API_URL; // ✅ API base URL from environment variables
const blobUrl = import.meta.env.VITE_BLOB_API_URL; // ✅ Blob storage base URL from environment variables

// ✅ Function to generate poster image URL based on movie title
const getPosterUrl = (title: string) => {
  if (!title || title.trim() === "") {
    return `${blobUrl}/placeholder.jpg`; // ✅ Fallback placeholder image
  }

  const removals = /[()'".,?!:#"\-]/g; // ✅ Characters to remove from title

  let cleanTitle = title
    .normalize("NFKD")
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "") // ✅ Remove smart quotes
    .replace(/\s*([&/])\s*/g, "␣␣") // ✅ Replace spaces around & and /
    .replace(removals, "")
    .replace(/\s+/g, " ")
    .replace(/␣␣/g, "  ")
    .trim();

  const encodedTitle = encodeURIComponent(cleanTitle); // ✅ Encode cleaned title for URL
  const folderName = encodeURIComponent("Movie Posters"); // ✅ Encode folder name

  return `${blobUrl}/${folderName}/${encodedTitle}.jpg`; // ✅ Full URL to poster image
};

const ProductDetail: React.FC = () => {
  const { show_id } = useParams<{ show_id: string }>(); // ✅ Get show_id from route params

  const [movie, setMovie] = useState<Movie | null>(null); // ✅ Movie data state
  const [userRating, setUserRating] = useState<number>(0); // ✅ User's rating state
  const [averageRating, setAverageRating] = useState<number | null>(null); // ✅ Average rating state
  const [userRatingLoaded, setUserRatingLoaded] = useState<boolean>(false); // ✅ Flag for user rating loading state

  useEffect(() => {
    if (!show_id) return; // ✅ Guard clause if no show_id is provided

    setUserRating(0);
    setUserRatingLoaded(false);

    // ✅ Fetch movie details by ID
    axios
      .get(`${apiUrl}/Movie/GetMovieById/${show_id}`, { withCredentials: true })
      .then((response) => setMovie(response.data))
      .catch((error) => console.error("Error fetching movie:", error));

    // ✅ Fetch average rating for the movie
    axios
      .get(`${apiUrl}/Movie/GetAverageRating/${show_id}`, { withCredentials: true })
      .then((response) => setAverageRating(Number(response.data.averageRating)))
      .catch((error) => console.error("Error fetching average rating:", error));

    // ✅ Fetch user's rating for the movie
    axios
      .get(`${apiUrl}/Movie/GetUserRating/${show_id}`, { withCredentials: true })
      .then((response) => {
        if (response.data && response.data.userRating !== null) {
          setUserRating(response.data.userRating);
        }
        setUserRatingLoaded(true);
      })
      .catch((error) => {
        console.error("Error fetching user rating:", error);
        setUserRatingLoaded(true);
      });
  }, [show_id]);

  // ✅ Submit user rating to the API
  const submitRating = (rating: number) => {
    axios
      .post(
        `${apiUrl}/Movie/RateMovie`,
        { show_id: show_id, rating: rating },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("Rating submitted successfully:", response.data);
        // ✅ Refresh average rating after submission
        axios
          .get(`${apiUrl}/Movie/GetAverageRating/${show_id}`, { withCredentials: true })
          .then((response) => setAverageRating(Number(response.data.averageRating)))
          .catch((error) => console.error("Error fetching average rating:", error));
      })
      .catch((error) => console.error("Error submitting rating:", error));
  };

  // ✅ Handle star click to submit rating
  const handleStarClick = (rating: number) => {
    setUserRating(rating); // ✅ Update local user rating state immediately
    submitRating(rating); // ✅ Submit rating to backend
    console.log(`User rated: ${rating} stars`);
  };

  if (!movie) {
    return (
      <div className="text-white text-center mt-16 text-lg">
        Loading movie details... {/* ✅ Show loading state if movie data is not ready */}
      </div>
    );
  }

  const imageUrl = getPosterUrl(movie.title); // ✅ Get movie poster URL

  // ✅ Generate genre list from movie data
  const genreList = Object.entries(movie)
    .filter(([, value]) => typeof value === "number" && value === 1)
    .map(([key]) => key.replace(/_/g, " "))
    .join(", ");

  return (
    <AuthorizeView> {/* ✅ Ensure authorized access to the product detail page */}
      <div className="bg-background min-h-screen text-foreground"> {/* ✅ Page background and text color */}
        <Header /> {/* ✅ Page header */}

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-10 px-8 py-12 animate-fadeIn"> {/* ✅ Main content layout */}
          <div className="flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500"> {/* ✅ Movie poster container */}
            <img
              src={imageUrl}
              alt={movie.title}
              className="w-full max-w-xs h-[500px] object-cover rounded-2xl"
            />
          </div>

          <div className="flex flex-col justify-start space-y-4 text-left w-full max-w-xl"> {/* ✅ Movie details container */}
            <h1 className="text-5xl font-extrabold">{movie.title}</h1> {/* ✅ Movie title */}
            <p className="text-muted-foreground text-sm">
              {movie.release_year} • {movie.duration} • {movie.rating} {/* ✅ Movie meta info */}
            </p>

            <div>
              <h2 className="text-xl font-semibold mb-1">Overview</h2>
              <p className="text-muted-foreground">{movie.description}</p> {/* ✅ Movie description */}
            </div>

            <div className="space-y-1 text-sm text-muted-foreground"> {/* ✅ Movie details list */}
              <p>
                <span className="font-semibold text-foreground">Starring:</span> {movie.cast}
              </p>
              <p>
                <span className="font-semibold text-foreground">Director:</span> {movie.director}
              </p>
              <p>
                <span className="font-semibold text-foreground">Genre:</span> {genreList || "Unknown"}
              </p>
              <p>
                <span className="font-semibold text-foreground">Average Rating:</span> {averageRating !== null && averageRating !== 0 ? `${averageRating.toFixed(2)} / 5` : "No ratings yet"}
              </p>
            </div>

            <div>
              <p className="font-semibold mb-2 text-foreground">Your Rating:</p>
              {userRatingLoaded ? (
                <div className="flex space-x-1 text-yellow-400 text-2xl cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => handleStarClick(star)}
                      className={`transition-transform ${userRating >= star ? "scale-125" : ""}`}
                    >
                      {userRating >= star ? "⭐" : "☆"}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Loading your rating...</p>
              )}
            </div>
          </div>
        </div>

        <MovieRecommendation show_id={show_id!} /> {/* ✅ Movie recommendation section */}

        <div className="space-y-8 max-w-7xl mx-auto px-8 pb-12"> {/* ✅ Additional sections container */}
          {["User Reviews", "Trailers & Behind the Scenes"].map((section, index) => (
            <div
              key={index}
              className="bg-muted rounded-2xl p-6 shadow-xl transform hover:-translate-y-1 transition duration-300"
            >
              <h3 className="text-2xl font-bold text-foreground mb-2">{section}</h3>
              <p className="text-muted-foreground">Content coming soon...</p>
            </div>
          ))}
        </div>

        <Footer /> {/* ✅ Page footer */}
      </div>
    </AuthorizeView>
  );
};

export default ProductDetail; // ✅ Export the component for use in routing
