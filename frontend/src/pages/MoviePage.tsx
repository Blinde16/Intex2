import AuthorizeView from '../components/AuthorizeView';
import ContainerFilter from '../components/ContainerFilter';
import Header from '../components/Header';
import MovieList from '../components/MovieList';
import { useState } from "react";
import './css/MoviePage.css';

function MoviePage() {
  const [selectedContainers, setSelectedContainers] = useState<string[]>([]); // Optional if keeping containers
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const clearAllFilters = () => {
    setSelectedContainers([]);
    setSelectedType(null);
    setSelectedGenres([]);
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
            <MovieList
              selectedContainers={selectedContainers}
              selectedType={selectedType}
              selectedGenres={selectedGenres}
            />
          </div>
        </div>
      </div>
    </AuthorizeView>
  );
}

export default MoviePage;
