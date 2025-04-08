export interface Movie {
  show_id: string;
  type: string;
  title: string;
  director: string;
  cast: string;
  country: string;
  release_year: string;
  rating: string;
  duration: string;
  description: string;
  genre: string;
  Action: boolean;
  Adventure: boolean;
  Anime_Series_International_TV_Shows: boolean;
  British_TV_Shows_Docuseries_International_TV_Shows: boolean;
  Children_Family_Movies: boolean;
  Children: boolean;
  Comedies: boolean;
  Comedies_Dramas_International_Movies: boolean;
  Comedies_International_Movies: boolean;
  Comedies_Romantic_Movies: boolean;
  Crime_TV_Shows_Docuseries: boolean;
  Documentaries: boolean;
  Documentaries_International_Movies: boolean;
  Docuseries: boolean;
  Dramas: boolean;
  Dramas_International_Movies: boolean;
  Dramas_Romantic_Movies: boolean;
  Family_Movies: boolean;
  Fantasy: boolean;
  Horror_Movies: boolean;
  International_Movies_Thrillers: boolean;
  International_TV_Shows_Romantic_TV_Shows_TV_Dramas: boolean;
  Kids_TV: boolean;
  Language_TV_Shows: boolean;
  Musicals: boolean;
  Nature_TV: boolean;
  Reality_TV: boolean;
  Spirituality: boolean;
  TV_Action: boolean;
  TV_Comedies: boolean;
  TV_Dramas: boolean;
  Talk_Shows_TV_Comedies: boolean;
  Thrillers: boolean;
}

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
  | "genre"
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
