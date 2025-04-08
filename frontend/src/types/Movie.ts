export interface Movie {
  show_id: string;
  type: string;
  title: string;
  director: string;
  cast: string;
  country: string;
  release_year: number;
  rating: string;
  duration: string;
  description: string;
  // No genre field, it's just for UI
  Action: number;
  Adventure: number;
  Anime_Series_International_TV_Shows: number;
  British_TV_Shows_Docuseries_International_TV_Shows: number;
  Children: number;
  Comedies: number;
  Comedies_Dramas_International_Movies: number;
  Comedies_International_Movies: number;
  Comedies_Romantic_Movies: number;
  Crime_TV_Shows_Docuseries: number;
  Documentaries: number;
  Documentaries_International_Movies: number;
  Docuseries: number;
  Dramas: number;
  Dramas_International_Movies: number;
  Dramas_Romantic_Movies: number;
  Family_Movies: number;
  Fantasy: number;
  Horror_Movies: number;
  International_Movies_Thrillers: number;
  International_TV_Shows_Romantic_TV_Shows_TV_Dramas: number;
  Kids_TV: number;
  Language_TV_Shows: number;
  Musicals: number;
  Nature_TV: number;
  Reality_TV: number;
  Spirituality: number;
  TV_Action: number;
  TV_Comedies: number;
  TV_Dramas: number;
  Talk_Shows_TV_Comedies: number;
  Thrillers: number;
}

// Export GENRES list
export const GENRES: (keyof Omit<
  Movie,
  | "show_id"
  | "type"
  | "title"
  | "director"
  | "cast"
  | "country"
  | "release_year"
  | "rating"
  | "duration"
  | "description"
>)[] = [
  "Action",
  "Adventure",
  "Anime_Series_International_TV_Shows",
  "British_TV_Shows_Docuseries_International_TV_Shows",
  "Children",
  "Comedies",
  "Comedies_Dramas_International_Movies",
  "Comedies_International_Movies",
  "Comedies_Romantic_Movies",
  "Crime_TV_Shows_Docuseries",
  "Documentaries",
  "Documentaries_International_Movies",
  "Docuseries",
  "Dramas",
  "Dramas_International_Movies",
  "Dramas_Romantic_Movies",
  "Family_Movies",
  "Fantasy",
  "Horror_Movies",
  "International_Movies_Thrillers",
  "International_TV_Shows_Romantic_TV_Shows_TV_Dramas",
  "Kids_TV",
  "Language_TV_Shows",
  "Musicals",
  "Nature_TV",
  "Reality_TV",
  "Spirituality",
  "TV_Action",
  "TV_Comedies",
  "TV_Dramas",
  "Talk_Shows_TV_Comedies",
  "Thrillers",
];
