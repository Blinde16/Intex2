import { useEffect, useRef, useState } from "react";
import { Movie, GENRES } from "../types/Movie";
import { updateMovie, fetchMovieById } from "../api/movieAPI";
import AuthorizeView from "./AuthorizeView";
import "../pages/css/MovieDetail.css";

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
  const [posterRemoved, setPosterRemoved] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const blobUrl = import.meta.env.BLOB_API_URL;

  useEffect(() => {
    const loadMovie = async () => {
      console.log("🎬 Fetching movie with ID:", movieId);
      try {
        const movie = await fetchMovieById(movieId);
        console.log("📦 Full movie object from backend:", movie);

        // Normalize genre flags from lowercase or PascalCase
        const genreFlagged = GENRES.filter(
          (g) =>
            movie[g] === 1 || movie[g.toLowerCase() as keyof typeof movie] === 1
        );
        console.log("🎭 Matched genres with flag = 1:", genreFlagged);

        const initialGenre = genreFlagged[0] ?? "";
        console.log("🎯 Selected initial genre for dropdown:", initialGenre);

        // Normalize all GENRES to ensure they're in PascalCase format
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
        console.error("❌ Error loading movie:", err);
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

  const handlePosterDelete = async () => {
    const res = await fetch(`${apiUrl}/Movie/DeletePoster`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: formData!.show_id }),
      credentials: "include",
    });

    if (res.ok) {
      alert("Poster deleted");
      setPosterRemoved(true);
    } else {
      alert("Failed to delete poster.");
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

        {!posterRemoved && (
          <div className="mb-4 mt-4">
            <h4 className="mt-6 font-semibold">🎞️ Current Poster</h4>
            <img
              src={getPosterUrl(formData.title)}
              alt="Current poster"
              className="w-40 h-auto rounded border border-gray-300 mb-2"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <button
              type="button"
              onClick={handlePosterDelete}
              className="btn btn-danger mt-2"
            >
              🗑️ Remove Poster
            </button>
          </div>
        )}

        {imageFile && (
          <div className="mb-4">
            <h4 className="mb-2 font-semibold">📂 New Image Preview</h4>
            <img
              src={URL.createObjectURL(imageFile)}
              alt="New Poster Preview"
              className="max-h-64 rounded shadow border"
            />
          </div>
        )}

        <h4 className="mt-4 mb-2 font-semibold">🎬 Upload New Poster</h4>
        <input
          className="form-control mb-4"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={imageInputRef}
        />

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
