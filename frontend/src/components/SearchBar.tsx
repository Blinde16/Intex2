import { useState, useEffect } from "react";
import "./css/SearchBar.css"; // ✅ Create a new CSS for search bar

interface SearchBarProps {
  setSearchTerm: (term: string) => void;
}

function SearchBar({ setSearchTerm }: SearchBarProps) {
  const [input, setInput] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchTerm(input.trim());
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
        placeholder="Search by movie title..."
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
