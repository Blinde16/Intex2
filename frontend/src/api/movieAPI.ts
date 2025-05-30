import { Movie } from "../types/Movie";
interface FetchMoviesResponse {
  movies: Movie[];
  totalNumberMovies: number;
}
const apiUrl = import.meta.env.VITE_API_URL;

export const fetchMovies = async (
  pageSize: number,
  pageNum: number,
  selectedCategories: string[],
  searchTerm: string,
  releaseYear?: number,
  selectedGenres: string[] = []
): Promise<FetchMoviesResponse> => {
  try {
    const categoryParams = selectedCategories
      .map((cat) => `types=${encodeURIComponent(cat)}`)
      .join("&");

    const params = new URLSearchParams();
    params.append("pageSize", pageSize.toString());
    params.append("pageNum", pageNum.toString());

    selectedCategories.forEach((cat) => {
      params.append("types", cat);
    });

    if (searchTerm) {
      params.append("searchTerm", searchTerm);
    }

    if (releaseYear) {
      params.append("releaseYear", releaseYear.toString());
    }

    selectedGenres.forEach((genre) => {
      params.append("genres", genre);
    });

    const url = `${apiUrl}/Movie/GetAdminMovies?pageSize=${pageSize}&pageNum=${pageNum}${
      selectedCategories.length ? `&${categoryParams}` : ""
    }${searchTerm ? `&searchTerm=${encodeURIComponent(searchTerm)}` : ""}`;

    const response = await fetch(url, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Movies");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Movies", error);
    throw error;
  }
};

export const addMovie = async (newMovie: Movie): Promise<Movie> => {
  try {
    const response = await fetch(`${apiUrl}/Movie/AddMovie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ✅ send cookie
      body: JSON.stringify(newMovie),
    });

    if (!response.ok) {
      throw new Error("failed to add Movie");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding Movie", error);
    throw error;
  }
};

export const updateMovie = async (
  show_id: string,
  updatedMovie: Movie
): Promise<Movie> => {
  try {
    const response = await fetch(`${apiUrl}/Movie/UpdateMovie/${show_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatedMovie),
    });

    if (!response.ok) {
      throw new Error("Failed to update Movie");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating Movie", error);
    throw error;
  }
};

export const deleteMovie = async (show_id: string): Promise<void> => {
  try {
    const response = await fetch(`${apiUrl}/Movie/DeleteMovie/${show_id}`, {
      method: "DELETE",
      credentials: "include", // ✅ send cookie
    });

    if (!response.ok) {
      throw new Error("Failed to delete movie");
    }
  } catch (error) {
    console.error("Error deleting movie:", error);
    throw error;
  }
};

export const fetchMovieById = async (id: string): Promise<Movie> => {
  const res = await fetch(`${apiUrl}/Movie/GetMovieById/${id}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch movie by ID");

  return res.json();
};
