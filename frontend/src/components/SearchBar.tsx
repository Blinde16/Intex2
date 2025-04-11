import { useState, useEffect } from "react";
import "./css/SearchBar.css"; // ✅ Create a new CSS for search bar

//this is a search bar that is used on both the movie page and the admin page to lookup movies and users. 

interface SearchBarProps {
  setSearchTerm: (term: string) => void;
}

function SearchBar({ setSearchTerm }: SearchBarProps) {
  const [input, setInput] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      // Convert the search term to lowercase
      setSearchTerm(input.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [input, setSearchTerm]);

  const clearInput = () => {
    setInput("");
    setSearchTerm("");
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="search-input"
      />
      {input && (
        <button className="search-clear-button" onClick={clearInput}>
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBar;
