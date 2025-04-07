import { Movie } from "../types/Movie";

interface FetchMoviesResponse {
  movies: Movie[];
  totalNumberMovies: number;
}

const API_URL = `https://localhost:5000/Movie`;

export const fetchMovies = async (
  pageSize: number,
  pageNumber: number,
  selectedCategories: string[]
): Promise<FetchMoviesResponse> => {
  try {
    const categoryParams = selectedCategories
      .map((cat) => `categories=${encodeURIComponent(cat)}`)
      .join("&");
    const response = await fetch(
      `${API_URL}/GetMovies?pageSize=${pageSize}&pageNumber=${pageNumber}${selectedCategories.length ? `&${categoryParams}` : ""}`
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
    const response = await fetch(`${API_URL}/AddMovie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMovie),
    });

    if (!response.ok) {
      throw new Error("failed to fetch Movies");
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding Movie", error);
    throw error;
  }
};

export const updateBook = async (
  show_id: string,
  updatedMovie: Movie
): Promise<Movie> => {
  try {
    const response = await fetch(`${API_URL}/UpdateMovie/${show_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
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
    const response = await fetch(`${API_URL}/DeleteMovie/${show_id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete movie");
    }
  } catch (error) {
    console.error("Error deleting movie:", error);
  }
};
