import { useEffect, useRef, useState } from "react";
import { Movie, GENRES } from "../types/Movie";
import { updateMovie, fetchMovieById } from "../api/movieAPI";
import AuthorizeView from "./AuthorizeView";
import "../pages/css/MovieForm.css";

//this is a form to edit movies. this is only accessable in the admin page. It pulls up the movies current information
//as a placeholder and allows you to edit the information by calling a handleChange. It also allows you to upload a new
//movie poster if you want.

export type MovieFormData = Movie & {
  genre?: (typeof GENRES)[number] | "";
};

interface EditMovieFormProps {
  movieId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditMovieForm = ({
  movieId,
  onSuccess,
  onCancel,
}: EditMovieFormProps) => {
  const [formData, setFormData] = useState<MovieFormData | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const blobUrl = import.meta.env.VITE_BLOB_API_URL;

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const movie = await fetchMovieById(movieId);

        const genreFlagged = GENRES.filter(
          (g) =>
            movie[g] === 1 || movie[g.toLowerCase() as keyof typeof movie] === 1
        );

        const initialGenre = genreFlagged[0] ?? "";

        const normalizedMovie = GENRES.reduce(
          (acc, g) => {
            const value =
              movie[g] ?? movie[g.toLowerCase() as keyof typeof movie] ?? 0;
            return { ...acc, [g]: value };
          },
          { ...movie }
        );

        setFormData({
          ...normalizedMovie,
          genre: initialGenre,
        });
      } catch (err) {
        console.error("Error loading movie:", err);
      }
    };

    loadMovie();
  }, [movieId]);

  if (!formData) return <p>Loading movie...</p>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return null;
      if (name === "release_year") {
        return { ...prev, [name]: parseInt(value) || 0 };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { genre, ...movieData } = formData!;
    const finalPayload: Movie = {
      ...movieData,
      release_year: Number(formData!.release_year),
    };

    await updateMovie(formData!.show_id, finalPayload);

    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append("image", imageFile);
      uploadData.append("filename", formData!.title);

      const posterRes = await fetch(`${apiUrl}/Movie/UploadPoster`, {
        method: "POST",
        body: uploadData,
        credentials: "include",
      });

      if (!posterRes.ok) {
        alert("Movie updated, but poster failed to upload");
      }
    }

    onSuccess();
  };

  const getPosterUrl = (title: string) => {
    const cleanTitle = title
      .replace(/[()'":?!,&#.]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encodedTitle = encodeURIComponent(cleanTitle);
    const folderName = encodeURIComponent("Movie Posters");
    return `${blobUrl}/${folderName}/${encodedTitle}.jpg`;
  };

  return (
    <AuthorizeView>
      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="form-title">✏️ Edit Movie</h2>

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

        {/* Current poster, display only */}
        <div className="mb-4 mt-4 centered-container">
          <h4 className="form-section-title">🎞️ Current Poster</h4>
          <img
            src={getPosterUrl(formData.title)}
            alt="Current poster"
            className="w-40 rounded"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        {imageFile && (
          <div className="mb-4 centered-container">
            <h4 className="form-section-title">📂 New Image Preview</h4>
            <img
              src={URL.createObjectURL(imageFile)}
              alt="New Poster Preview"
              className="max-h-64 rounded"
            />
          </div>
        )}

        <h4 className="form-section-title">🎬 Upload New Poster</h4>
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

        <div className="flex mt-6">
          <button type="submit" className="btn btn-primary">
            💾 Save Changes
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

export default EditMovieForm;
