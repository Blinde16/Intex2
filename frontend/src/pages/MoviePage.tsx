import AuthorizeView from '../components/AuthorizeView';
import ContainerFilter from '../components/ContainerFilter';
import Header from '../components/Header';
import MovieList from '../components/MovieList';
import SearchBar from '../components/SearchBar'; // ✅ Add this import
import { useState } from "react";
import './css/MoviePage.css';

function MoviePage() {
  const [selectedContainers, setSelectedContainers] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // ✅ New state for search term

  const clearAllFilters = () => {
    setSelectedContainers([]);
    setSelectedType(null);
    setSelectedGenres([]);
    setSearchTerm(""); // ✅ Also clear search
  };

  return (
    <AuthorizeView>
      <Header />
      <div className="container-fluid movie-page pt-3">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 filter-sidebar">
            <ContainerFilter
              selectedContainers={selectedContainers}
              setSelectedContainers={setSelectedContainers}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedGenres={selectedGenres}
              setSelectedGenres={setSelectedGenres}
              clearAllFilters={clearAllFilters}
            />
          </div>

          {/* Main Content */}
          <div className="col-md-9 movie-list-area">
            <SearchBar setSearchTerm={setSearchTerm} /> {/* ✅ Add SearchBar here */}
            <MovieList
              selectedContainers={selectedContainers}
              selectedType={selectedType}
              selectedGenres={selectedGenres}
              searchTerm={searchTerm} // ✅ Pass search term to MovieList
            />
          </div>
        </div>
      </div>
    </AuthorizeView>
  );
}

export default MoviePage;
