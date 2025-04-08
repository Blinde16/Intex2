import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import ContainerFilter from '../components/ContainerFilter';
import Header from '../components/Header';
import Logout from '../components/Logout';
import MovieList from '../components/MovieList';
import { useState } from "react";
import './css/MoviePage.css';

function MoviePage() {
  const [selectedContainers, setSelectedContainers] = useState<string[]>([]);

  return (
    <AuthorizeView>
      <Header />
      <div className="container-fluid movie-page pt-3">
        <div className="d-flex justify-content-end mb-3">
          <Logout>
            Logout <AuthorizedUser value="email" />
          </Logout>
        </div>

        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 filter-sidebar">
            <ContainerFilter
              selectedContainers={selectedContainers}
              setSelectedContainers={setSelectedContainers}
            />
          </div>

          {/* Main Content */}
          <div className="col-md-9 movie-list-area">
            <div className="recommendation-placeholder mb-4">🎥 Recommender 1 Placeholder</div>
            <div className="recommendation-placeholder mb-4">🎥 Recommender 2 Placeholder</div>
            <div className="recommendation-placeholder mb-4">🎥 Recommender 3 Placeholder</div>
            <div className="recommendation-placeholder mb-4">🎥 Recommender 4 Placeholder</div>
            <div className="recommendation-placeholder mb-4">🎥 Recommender 5 Placeholder</div>

            {/* Infinite Scroll Movie List */}
            <MovieList selectedContainers={selectedContainers} />
          </div>
        </div>
      </div>
    </AuthorizeView>
  );
}

export default MoviePage;
