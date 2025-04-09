import AuthorizeView from '../components/AuthorizeView';
import ContainerFilter from '../components/ContainerFilter';
import Header from '../components/Header';
import MovieList from '../components/MovieList';
import SearchBar from '../components/SearchBar';
import { useState } from "react";
import './css/MoviePage.css';
import Adventure from '../components/HomeRecommender';
import StickyFooter from '../components/StickyFooter';


function MoviePage() {
  const [selectedContainers, setSelectedContainers] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const clearAllFilters = () => {
    setSelectedContainers([]);
    setSelectedType(null);
    setSelectedGenres([]);
    setSearchTerm("");
  };

  return (
    <AuthorizeView>
      <div className="movie-page-wrapper">
        <Header />
        <Adventure />
        <div className="movie-page-content">
          <div className="page-layout">
            <div className="filter-sidebar">
              <ContainerFilter
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedGenres={selectedGenres}
                setSelectedGenres={setSelectedGenres}
                clearAllFilters={clearAllFilters}
              />
            </div>
            <div className="movie-list-area">
              <SearchBar setSearchTerm={setSearchTerm} />
              <MovieList
                selectedContainers={selectedContainers}
                selectedType={selectedType}
                selectedGenres={selectedGenres}
                searchTerm={searchTerm}
              />
            </div>
          </div>
        </div>
        <StickyFooter /> {/* ✅ Always visible at the bottom of the screen */}
      </div>
    </AuthorizeView>
  );
}

export default MoviePage;
