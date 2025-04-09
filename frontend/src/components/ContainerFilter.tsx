import { useEffect, useState } from "react";
import "./css/ContainerFilter.css";

function ContainerFilter({
  selectedType,
  setSelectedType,
  selectedGenres,
  setSelectedGenres,
  clearAllFilters,
}: {
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  clearAllFilters: () => void;
}) {
  const [types, setTypes] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGeneralGenres, setSelectedGeneralGenres] = useState<string[]>([]);
  const [isTypeOpen, setIsTypeOpen] = useState(true);
  const [isGenreOpen, setIsGenreOpen] = useState(true);

  const genreBinMap: { [bin: string]: string[] } = {
    Action: ["Action", "TV_Action"],
    Adventure: ["Adventure"],
    Comedy: [
      "Comedies",
      "Comedies_Dramas_International_Movies",
      "Comedies_International_Movies",
      "Comedies_Romantic_Movies",
      "Talk_Shows_TV_Comedies",
      "TV_Comedies"
    ],
    Crime: ["Crime_TV_Shows_Docuseries"],
    Documentary: [
      "Documentaries",
      "Documentaries_International_Movies",
      "Docuseries",
      "British_TV_Shows_Docuseries_International_TV_Shows"
    ],
    Drama: [
      "Dramas",
      "Dramas_International_Movies",
      "Dramas_Romantic_Movies",
      "International_TV_Shows_Romantic_TV_Shows_TV_Dramas",
      "TV_Dramas"
    ],
    Family: ["Family_Movies", "Children", "Kids_TV"],
    Fantasy: ["Fantasy"],
    Horror: ["Horror_Movies"],
    International: [
      "International_Movies_Thrillers",
      "International_TV_Shows_Romantic_TV_Shows_TV_Dramas",
      "British_TV_Shows_Docuseries_International_TV_Shows",
      "Anime_Series_International_TV_Shows"
    ],
    Musical: ["Musicals"],
    Nature: ["Nature_TV"],
    Reality: ["Reality_TV"],
    Spiritual: ["Spirituality"],
    Thriller: ["Thrillers", "International_Movies_Thrillers"],
    Other: []
  };

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("https://localhost:5000/Movie/GetCategoryTypes", { credentials: "include" });
        const data = (await response.json()) as string[];
        setTypes([...new Set(data)]);
      } catch (error) {
        console.error("Error fetching types", error);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await fetch("https://localhost:5000/Movie/GetGenreTypes", { credentials: "include" });
        const data = (await response.json()) as string[];
        setGenres(data);
      } catch (error) {
        console.error("Error fetching genres", error);
      }
    };

    fetchTypes();
    fetchGenres();
  }, []);

  const handleGeneralGenreChange = ({ target }: { target: HTMLInputElement }) => {
    const generalGenre = target.value;

    let updatedGeneralGenres = [...selectedGeneralGenres];
    if (selectedGeneralGenres.includes(generalGenre)) {
      updatedGeneralGenres = updatedGeneralGenres.filter((g) => g !== generalGenre);
    } else {
      updatedGeneralGenres.push(generalGenre);
    }

    setSelectedGeneralGenres(updatedGeneralGenres);

    const expanded = updatedGeneralGenres.flatMap((general) => genreBinMap[general] || []);
    setSelectedGenres(expanded);
  };

  const removeFilter = (generalGenre: string) => {
    const updatedGeneralGenres = selectedGeneralGenres.filter((g) => g !== generalGenre);
    setSelectedGeneralGenres(updatedGeneralGenres);

    const expanded = updatedGeneralGenres.flatMap((general) => genreBinMap[general] || []);
    setSelectedGenres(expanded);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(selectedType === type ? null : type);
  };

  return (
    <div className="container-filter">
      <div className="filter-header">
        <h4>Filters</h4>
      </div>

      <div className="filter-summary">
        {selectedType && (
          <span className="tag">
            {selectedType}
            <button onClick={() => setSelectedType(null)} style={{ marginLeft: "4px", cursor: "pointer" }}>x</button>
          </span>
        )}
        {selectedGeneralGenres.map((general) => (
          <span key={general} className="tag">
            {general}
            <button onClick={() => removeFilter(general)} style={{ marginLeft: "4px", cursor: "pointer" }}>x</button>
          </span>
        ))}
        {!selectedType && selectedGeneralGenres.length === 0 && (
          <span className="tag">No filters selected</span>
        )}
      </div>

      <div className="accordion-section">
        <div className="accordion-header" onClick={() => setIsTypeOpen(!isTypeOpen)}>
          <h5>Type</h5>
          <span>{isTypeOpen ? "▲" : "▼"}</span>
        </div>
        {isTypeOpen && (
          <div className="container-list">
            {types.map((type) => (
              <label key={`type-${type}`} className="container-item">
                <input
                  type="radio"
                  name="type"
                  value={type}
                  checked={selectedType === type}
                  onChange={() => handleTypeChange(type)}
                  className="container-checkbox"
                />
                {type}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="accordion-section">
        <div className="accordion-header" onClick={() => setIsGenreOpen(!isGenreOpen)}>
          <h5>Genres</h5>
          <span>{isGenreOpen ? "▲" : "▼"}</span>
        </div>
        {isGenreOpen && (
          <div className="container-list">
            {Object.keys(genreBinMap).map((general) => (
              genreBinMap[general].length > 0 && (
                <label key={`general-${general}`} className="container-item">
                  <input
                    type="checkbox"
                    value={general}
                    checked={selectedGeneralGenres.includes(general)}
                    onChange={handleGeneralGenreChange}
                    className="container-checkbox"
                  />
                  {general}
                </label>
              )
            ))}
          </div>
        )}
      </div>

      <div className="filter-controls-bottom">
        <button className="clear-button" onClick={clearAllFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default ContainerFilter;
