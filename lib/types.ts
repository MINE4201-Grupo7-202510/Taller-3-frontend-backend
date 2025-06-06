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
  explanation?: string; // Campo de explicación añadido
}

export interface NewUserRecommendation {
  movieId: string;
  title: string; // Ya viene de la API de new_user
  rating_count: number; // Ya viene de la API de new_user
  explanation?: string; // Campo de explicación añadido
}


// El resto del archivo (cn function, Movie interface, MovieCardProps) puede permanecer igual
// si MovieCard.tsx no se usa directamente para estas recomendaciones específicas.
// Si se fuera a usar, la interface Movie necesitaría también el campo explanation opcional.