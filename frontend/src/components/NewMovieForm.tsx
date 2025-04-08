import { useState } from "react";
import { Movie, GENRES } from "../types/Movie";
import { addMovie } from "../api/movieAPI";
import AuthorizeView, { AuthorizedUser } from "./AuthorizeView";
import Logout from "./Logout";

interface NewMovieFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewMovieForm = ({ onSuccess, onCancel }: NewMovieFormProps) => {
  const genreDefaults = GENRES.reduce(
    (acc, genre) => {
      acc[genre] = false;
      return acc;
    },
    {} as Record<string, boolean>
  );

  const [formData, setFormData] = useState<Movie>({
    show_id: "",
    type: "",
    title: "",
    director: "",
    cast: "",
    country: "",
    release_year: new Date().getFullYear().toString(),
    rating: "",
    duration: "",
    description: "",
    genre: "",
    Action: false,
    Adventure: false,
    Anime_Series_International_TV_Shows: false,
    British_TV_Shows_Docuseries_International_TV_Shows: false,
    Children_Family_Movies: false,
    Comedies: false,
    Crime_TV_Shows: false,
    Cult_Movies: false,
    Documentaries: false,
    Dramas: false,
    Faith_Spirituality: false,
    Fantasy: false,
    Horror: false,
    Independent_Movies: false,
    International_Movies: false,
    International_TV_Shows: false,
    LGBTQ_Movies: false,
    Music_Musicals: false,
    Reality_TV: false,
    Romantic_Movies: false,
    Romantic_TV_Shows: false,
    Sci_Fi: false,
    Stand_Up_Comedy: false,
    Thrillers: false,
    TV_Dramas: false,
    TV_Horror: false,
    TV_Mysteries: false,
    TV_Sci_Fi_Fantasy: false,
    TV_Shows: false,
    ...genreDefaults,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMovie(formData);
    onSuccess();
  };

  return (
    <AuthorizeView>
      <Logout>
        Logout <AuthorizedUser value="email" />
      </Logout>

      <form onSubmit={handleSubmit}>
        <h2>Add New Movie</h2>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <input
          type="text"
          name="director"
          value={formData.director}
          onChange={handleChange}
          placeholder="Director"
        />
        <input
          type="text"
          name="cast"
          value={formData.cast}
          onChange={handleChange}
          placeholder="Cast"
        />
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
        />
        <input
          type="text"
          name="release_year"
          value={formData.release_year}
          onChange={handleChange}
          placeholder="Release Year"
        />
        <input
          type="text"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          placeholder="Rating"
        />
        <input
          type="text"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="Duration"
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <h4>Genres</h4>
        {GENRES.map((genre) => (
          <label key={genre} style={{ display: "block" }}>
            <input
              type="checkbox"
              name={genre}
              checked={formData[genre]}
              onChange={handleChange}
            />
            {genre}
          </label>
        ))}

        <br />
        <button type="submit">Add Movie</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </AuthorizeView>
  );
};

export default NewMovieForm;
