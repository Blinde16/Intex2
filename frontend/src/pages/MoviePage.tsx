// MoviePage.tsx
// ✅ This is the main page component for displaying movies, filters, and layout structure.

import AuthorizeView from "../components/AuthorizeView"; // Handles authorization view wrapper
import ContainerFilter from "../components/ContainerFilter"; // Sidebar filters for types and genres
import Header from "../components/Header"; // Top header of the page
import MovieList from "../components/MovieList"; // The main grid list of movies
import SearchBar from "../components/SearchBar"; // Search bar component for movie search
import { useState } from "react"; // React hook for state management
import "./css/MoviePage.css"; // Styles for the movie page layout
import Adventure from "../components/HomeRecommender"; // Home recommender component (renamed to Adventure)
import StickyFooter from "../components/StickyFooter"; // Footer of the page
import HeroBanner from "../components/HeroBanner"; // Hero banner for top-rated movies

function MoviePage() {
  // ✅ State to manage selected container filters (currently unused in UI)
  const [selectedContainers, setSelectedContainers] = useState<string[]>([]);

  // ✅ State to manage the selected type filter (Movies, TV Shows, etc.)
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // ✅ State to manage selected genres filters (Action, Comedy, etc.)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // ✅ State to manage search term from the search bar
  const [searchTerm, setSearchTerm] = useState<string>("");

  // ✅ Function to clear all filters and search terms
  const clearAllFilters = () => {
    setSelectedContainers([]); // Clears container filters
    setSelectedType(null); // Resets type filter
    setSelectedGenres([]); // Resets genre filters
    setSearchTerm(""); // Clears search term
  };

  return (
    <AuthorizeView> {/* ✅ Wrap entire page in authorization view to protect route */}
      <div className="movie-page-wrapper"> {/* ✅ Main wrapper div for the page */}
        <Header /> {/* ✅ Header at the top of the page */}
        <div className="hero-fade-top"></div> {/* ✅ Optional visual fade effect at the top */}
        <HeroBanner /> {/* ✅ Hero banner component for showcasing top movies */}
        <Adventure /> {/* ✅ Home recommender section below the hero banner */}

        <div className="movie-page-content"> {/* ✅ Container for main page content */}
          <div className="page-layout"> {/* ✅ Layout wrapper for sidebar and movie list */}
            <div className="filter-sidebar"> {/* ✅ Left sidebar for filters */}
              <ContainerFilter
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedGenres={selectedGenres}
                setSelectedGenres={setSelectedGenres}
                clearAllFilters={clearAllFilters} // ✅ Pass function to clear filters
              />
            </div>

            <div className="movie-list-area"> {/* ✅ Right side for search bar and movie list */}
              <SearchBar setSearchTerm={setSearchTerm} /> {/* ✅ Search bar for movie search */}
              <MovieList
                selectedContainers={selectedContainers}
                selectedType={selectedType}
                selectedGenres={selectedGenres}
                searchTerm={searchTerm}
              /> {/* ✅ Movie list, receives filters and search term */}
            </div>
          </div>
        </div>

        <StickyFooter /> {/* ✅ Sticky footer at the bottom of the page */}
      </div>
    </AuthorizeView>
  );
}

export default MoviePage; // ✅ Export component for use in routing
