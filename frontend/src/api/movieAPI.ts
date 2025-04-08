import { Movie } from "../types/Movie";

interface FetchMoviesResponse {
  movies: Movie[];
  totalNumberMovies: number;
}

const API_URL = `https://cineniche-intex2-410-dmage4djbadjbvbw.eastus-01.azurewebsites.net/Movie`;

export const fetchMovies = async (
  pageSize: number,
  pageNum: number,
  selectedCategories: string[]
): Promise<FetchMoviesResponse> => {
  try {
    const categoryParams = selectedCategories
      .map((cat) => `types=${encodeURIComponent(cat)}`)
      .join("&");

    const response = await fetch(
      `https://localhost:5000/Movie/GetAdminMovies?pageSize=${pageSize}&pageNumber=${pageNum}${
        selectedCategories.length ? `&${categoryParams}` : ""
      }`,
      {
        credentials: "include", // ✅ send cookie with request
      }
    );

    if (!response.ok) {
      throw new Error("failed to fetch Movies");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Movies", error);
    throw error;
  }
};

export const addMovie = async (newMovie: Movie): Promise<Movie> => {
  try {
    const response = await fetch(`https://localhost:5000/Movie/AddMovie`, {
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
    const response = await fetch(
      `https://localhost:5000/Movie/UpdateMovie/${show_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedMovie),
      }
    );

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
    const response = await fetch(
      `https://localhost:5000/Movie/DeleteMovie/${show_id}`,
      {
        method: "DELETE",
        credentials: "include", // ✅ send cookie
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete movie");
    }
  } catch (error) {
    console.error("Error deleting movie:", error);
    throw error;
  }
};
