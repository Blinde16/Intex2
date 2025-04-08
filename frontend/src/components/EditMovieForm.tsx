import { useState } from "react";
import { Movie, GENRES } from "../types/Movie";
import { updateMovie } from "../api/movieAPI";
import AuthorizeView, { AuthorizedUser } from "./AuthorizeView";
import Logout from "./Logout";

export type MovieFormData = Movie & {
  genre?: (typeof GENRES)[number] | ""; // UI only
};

interface EditMovieFormProps {
  movie: Movie;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditMovieForm = ({ movie, onSuccess, onCancel }: EditMovieFormProps) => {
  const [formData, setFormData] = useState<MovieFormData>((): MovieFormData => {
    const initialGenre = GENRES.find((g) => movie[g] === 1);
    return {
      ...movie,
      genre: initialGenre ?? "", // ✅ now allowed
    };
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      // handle numeric field properly
      if (name === "release_year") {
        return { ...prev, [name]: parseInt(value) || 0 };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { genre, ...movieData } = formData;

    const finalPayload: Movie = {
      ...movieData,
      release_year: Number(formData.release_year),
    };

    await updateMovie(formData.show_id, finalPayload);
    onSuccess();
  };

  return (
    <AuthorizeView>
      <Logout>
        Logout <AuthorizedUser value="email" />
      </Logout>

      <form
        onSubmit={handleSubmit}
        className="bg-white text-black p-4 rounded shadow-lg max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4">✏️ Edit Movie</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className="form-control"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
          />
          <input
            className="form-control"
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Type"
          />
          <input
            className="form-control"
            type="text"
            name="director"
            value={formData.director}
            onChange={handleChange}
            placeholder="Director"
          />
          <input
            className="form-control"
            type="text"
            name="cast"
            value={formData.cast}
            onChange={handleChange}
            placeholder="Cast"
          />
          <input
            className="form-control"
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
          />
          <input
            className="form-control"
            type="number"
            name="release_year"
            value={formData.release_year}
            onChange={handleChange}
            placeholder="Release Year"
          />
          <input
            className="form-control"
            type="text"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            placeholder="Rating"
          />
          <input
            className="form-control"
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Duration"
          />
          <input
            className="form-control col-span-2"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
          />
        </div>

        <h4 className="mt-4 mb-2 font-semibold">🎭 Select Genre</h4>
        <select
          name="genre"
          className="form-control mb-4"
          value={formData.genre}
          onChange={(e) =>
            setFormData({
              ...formData,
              genre: e.target.value as MovieFormData["genre"],
              ...GENRES.reduce(
                (acc, g) => {
                  acc[g] = g === e.target.value ? 1 : 0;
                  return acc;
                },
                {} as Pick<Movie, (typeof GENRES)[number]>
              ),
            })
          }
        >
          <option value="">-- Choose a genre --</option>
          {GENRES.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <div className="mt-6 flex gap-4">
          <button type="submit" className="btn btn-primary">
            💾 Save Changes
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </AuthorizeView>
  );
};

export default EditMovieForm;
