import { useState } from "react";
import { Movie } from "../types/Movie";
import { updateMovie } from "../api/movieAPI";

interface EditMovieFormProps {
  movie: Movie;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditMovieForm = ({ movie, onSuccess, onCancel }: EditMovieFormProps) => {
  const [formData, setFormData] = useState<Movie>({ ...movie });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMovie(formData.show_id, formData);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Movie</h2>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
      />
      <input
        type="text"
        name="director"
        value={formData.director}
        onChange={handleChange}
      />
      <input
        type="text"
        name="cast"
        value={formData.cast}
        onChange={handleChange}
      />
      <input
        type="text"
        name="country"
        value={formData.country}
        onChange={handleChange}
      />
      <input
        type="number"
        name="release_year"
        value={formData.release_year}
        onChange={handleChange}
      />
      <input
        type="text"
        name="rating"
        value={formData.rating}
        onChange={handleChange}
      />
      <input
        type="text"
        name="duration"
        value={formData.duration}
        onChange={handleChange}
      />
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />
      <label>
        Action:
        <input
          type="checkbox"
          name="Action"
          checked={formData.Action}
          onChange={handleChange}
        />
      </label>
      {/* Repeat for other genre flags */}
      <button type="submit">Update Movie</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default EditMovieForm;
