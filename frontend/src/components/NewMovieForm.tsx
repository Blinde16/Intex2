import { useState, useRef } from "react";
import { Movie, GENRES } from "../types/Movie";
import AuthorizeView from "./AuthorizeView";
import "../pages/css/MovieForm.css";

type MovieFormData = Omit<Movie, keyof typeof GENRES> &
  Record<(typeof GENRES)[number], number> & {
    genre?: string;
  };

interface NewMovieFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewMovieForm = ({ onSuccess, onCancel }: NewMovieFormProps) => {
  const [formData, setFormData] = useState<MovieFormData>(() => ({
    show_id: "",
    type: "",
    title: "",
    director: "",
    cast: "",
    country: "",
    release_year: new Date().getFullYear(),
    rating: "",
    duration: "",
    description: "",
    genre: "",
    ...GENRES.reduce((acc, genre) => {
      acc[genre] = 0;
      return acc;
    }, {} as Record<(typeof GENRES)[number], number>),
  }));

  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "release_year" ? parseInt(value) || 0 : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { genre, ...movieData } = formData;

    const cleanTitleForFilename = movieData.title
      .replace(/[()'"`:?!,&#.]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const res = await fetch(`${apiUrl}/Movie/AddMovie`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...movieData,
        release_year: Number(movieData.release_year),
        ...GENRES.reduce(
          (acc, g) => ({ ...acc, [g]: formData[g] }),
          {} as Record<string, number>
        ),
      }),
      credentials: "include",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Backend error:", errorText);
      alert("Failed to add movie: " + errorText);
      return;
    }

    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append("image", imageFile);
      uploadData.append("filename", cleanTitleForFilename);

      const posterRes = await fetch(`${apiUrl}/Movie/UploadPoster`, {
        method: "POST",
        body: uploadData,
        credentials: "include",
      });

      if (!posterRes.ok) {
        alert("Movie details added, but poster failed to upload");
      }
    }

    onSuccess();
  };

  return (
    <AuthorizeView>
      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="form-title">🎬 Add New Movie</h2>

        <div className="form-grid">
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
            className="form-control"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
          />
        </div>

        <h4 className="form-section-title">🎬 Movie Poster</h4>
        <input
          className="form-control mb-4"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={imageInputRef}
        />

        <h4 className="form-section-title">🎭 Select Genre</h4>
        <select
          name="genre"
          className="form-control mb-4"
          value={formData.genre}
          onChange={(e) =>
            setFormData({
              ...formData,
              genre: e.target.value,
              ...GENRES.reduce(
                (acc, g) => ({ ...acc, [g]: g === e.target.value ? 1 : 0 }),
                {} as Record<string, number>
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

        <div className="flex mt-6">
          <button type="submit" className="btn btn-primary">
            ✅ Add Movie
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </AuthorizeView>
  );
};

export default NewMovieForm;
