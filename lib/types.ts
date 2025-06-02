// lib/types.ts

export interface MovieDetails {
  movieId: string;
  title: string;
  tconst?: string; // IMDb ID sin 'tt'
  genres: string[];
  actors: string[];
  directors: string[];
  // Puedes añadir más campos si los obtienes de la API
}

export interface Recommendation {
  movieId: string;
  score: number; // Para recomendaciones híbridas
}

export interface NewUserRecommendation {
  movieId: string;
  title: string; // Ya viene de la API de new_user
  rating_count: number; // Ya viene de la API de new_user
}