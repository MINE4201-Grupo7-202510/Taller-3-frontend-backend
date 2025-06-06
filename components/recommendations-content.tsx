// components/recommendations-content.tsx
"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, Film, ThumbsUp, Tag as TagIcon, 
  UserCircle, BarChart2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { MovieDetails, Recommendation, NewUserRecommendation } from "@/lib/types"
import MovieDetailsModal from "@/components/MovieDetailsModal" // Importar el nuevo modal

const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000"

// Tipos enriquecidos con los nuevos campos de TMDB
interface EnrichedRecommendation extends Recommendation {
  details?: MovieDetails | null
  imageUrl?: string
  overview?: string // <-- Añadido
}

interface EnrichedNewUserRecommendation extends NewUserRecommendation {
  details?: MovieDetails | null
  imageUrl?: string
  overview?: string // <-- Añadido
}

// Tipo para la respuesta de nuestra API Route de TMDB
interface TmdbDetails {
  imageUrl?: string | null;
  overview?: string | null;
}

// Función para obtener detalles de la película desde FastAPI
async function fetchMovieDetails(movieId: string): Promise<MovieDetails | null> {
  try {
    const res = await fetch(`${FASTAPI_URL}/movies/${movieId}`)
    if (!res.ok) {
      console.error(`Error fetching details for movie ${movieId}: ${res.statusText}`)
      return null
    }
    return res.json()
  } catch (error) {
    console.error(`Network error fetching details for movie ${movieId}:`, error)
    return null
  }
}

// Función para obtener imagen y sinopsis desde nuestra API Route
async function fetchTmdbDetails(imdbId: string | undefined): Promise<TmdbDetails> {
  if (!imdbId) return { imageUrl: undefined, overview: undefined }
  try {
    const res = await fetch(`/api/tmdb/image?imdbId=${imdbId}`)
    if (!res.ok) {
      console.error(`Error fetching TMDB details for imdbId ${imdbId}: ${res.statusText}`)
      return { imageUrl: undefined, overview: undefined }
    }
    const data = await res.json()
    return { imageUrl: data.imageUrl, overview: data.overview }
  } catch (error) {
    console.error(`Network error fetching TMDB details for imdbId ${imdbId}:`, error)
    return { imageUrl: undefined, overview: undefined }
  }
}

export default function RecommendationsContent() {
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId")
  const type = searchParams.get("type")
  const genresParam = searchParams.get("genres")

  const [recommendations, setRecommendations] = useState<(EnrichedRecommendation | EnrichedNewUserRecommendation)[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("")

  // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<EnrichedRecommendation | EnrichedNewUserRecommendation | null>(null);

  useEffect(() => {
    const getRecommendations = async () => {
      setIsLoading(true)
      setError(null)
      let rawRecommendations: (Recommendation[] | NewUserRecommendation[]) = []

      try {
        if (type === "existing" && userId) {
          setUserName(`Usuario ${userId}`)
          const res = await fetch(`${FASTAPI_URL}/recommend/hybrid/${userId}?top_n=10&alpha=0.6`)
          if (!res.ok) throw new Error(`Failed to fetch recommendations for existing user: ${res.statusText}`)
          const data = await res.json()
          rawRecommendations = data.recommendations || []
        } else if (type === "new" && genresParam) {
          const selectedGenres = genresParam.split(",")
          setUserName("Nuevo Usuario")
          if (selectedGenres.length > 0) {
            const firstGenre = selectedGenres[0]
            const res = await fetch(`${FASTAPI_URL}/recommend/new_user/${encodeURIComponent(firstGenre)}?top_n=10`)
            if (!res.ok) throw new Error(`Failed to fetch recommendations for new user: ${res.statusText}`)
            const data = await res.json()
            rawRecommendations = data.recommendations || []
          } else {
            throw new Error("No genres selected for new user.")
          }
        } else {
          throw new Error("Invalid parameters for recommendations.")
        }
        
        if (rawRecommendations.length === 0) {
          setRecommendations([])
          setIsLoading(false)
          return
        }

        const enrichedRecsPromises = rawRecommendations.map(async (rec) => {
          const details = await fetchMovieDetails(rec.movieId)
          const { imageUrl, overview } = details ? await fetchTmdbDetails(details.tconst) : { imageUrl: undefined, overview: undefined }
          return { ...rec, details, imageUrl: imageUrl || undefined, overview: overview || undefined } 
        })

        const enrichedRecs = await Promise.all(enrichedRecsPromises)
        setRecommendations(enrichedRecs.filter(rec => rec.details !== null))

      } catch (err: any) {
        console.error("Error fetching recommendations:", err)
        setError(err.message || "An unknown error occurred.")
      } finally {
        setIsLoading(false)
      }
    }

    getRecommendations()
  }, [userId, type, genresParam])

  // Handlers para el modal
  const handleMovieClick = (movie: EnrichedRecommendation | EnrichedNewUserRecommendation) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="text-center">
          <Film className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Generando tus recomendaciones...</h2>
          <p className="text-gray-500">Esto puede tardar unos segundos.</p>
          <Progress value={50} className="w-64 mx-auto mt-4" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
       <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4">
        <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-10">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Volver al Inicio
          </Link>
        </header>
        <main className="flex-grow flex flex-col items-center justify-center text-center pt-20">
          <UserCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-red-700 mb-2">Oops! Algo salió mal.</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link href="/">
            <Button variant="destructive">Intentar de Nuevo</Button>
          </Link>
        </main>
      </div>
    )
  }
  
  if (recommendations.length === 0 && !isLoading) {
     return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-10">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Volver al Inicio
          </Link>
        </header>
        <main className="flex-grow flex flex-col items-center justify-center text-center pt-20">
          <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No hay recomendaciones disponibles.</h2>
          <p className="text-gray-500 mb-6">
            No pudimos generar recomendaciones con los criterios actuales. Intenta ajustar tus preferencias.
          </p>
          <Link href={type === "existing" ? "/existing-user" : "/new-user/preferences"}>
            <Button>Ajustar Preferencias</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Film className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Tus Recomendaciones de Películas</h1>
          </div>
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Volver al Inicio
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 p-6 bg-white rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <UserCircle className="w-10 h-10 text-purple-600" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Recomendaciones para {userName}
              </h2>
              <p className="text-sm text-gray-500">
                {type === "existing"
                  ? "Basadas en tu historial y perfiles similares (modelo híbrido)."
                  : `Basadas en tu preferencia por el género: ${genresParam?.split(",")[0] || "seleccionado"} (populares en el género).`}
              </p>
            </div>
          </div>
           <p className="text-sm text-gray-600 mt-1">
            Mostrando las {recommendations.length} mejores recomendaciones. Haz clic en una película para ver todos los detalles.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recommendations.map((rec, index) => (
            <Card
              key={rec.movieId + "_" + index}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer"
              onClick={() => handleMovieClick(rec)}
            >
              <CardHeader className="p-0">
                {rec.imageUrl ? (
                  <img
                    src={rec.imageUrl}
                    alt={`Póster de ${rec.details?.title || "Película"}`}
                    className="w-full h-80 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; 
                      target.src = "/placeholder.svg"; 
                      target.classList.add("object-contain");
                    }}
                  />
                ) : (
                  <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
                    <Film className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <CardTitle className="text-lg mb-1 line-clamp-2">{rec.details?.title || "Título no disponible"}</CardTitle>
                  <CardDescription className="text-sm text-gray-600 mb-2">
                    Película ID: {rec.movieId}
                  </CardDescription>
                  
                  <div className="space-y-1 mb-3">
                    {rec.details?.genres && rec.details.genres.length > 0 && (
                      <div className="flex items-center text-xs text-gray-500">
                        <TagIcon className="w-3 h-3 mr-1.5 text-purple-500" />
                        {rec.details.genres.slice(0, 3).join(", ")}
                      </div>
                    )}
                    {type === 'existing' && 'score' in rec && typeof rec.score === 'number' && (
                      <div className="flex items-center text-xs text-gray-500">
                        <BarChart2 className="w-3 h-3 mr-1.5 text-blue-500" />
                        Puntuación: {rec.score.toFixed(3)}
                      </div>
                    )}
                    {type === 'new' && 'rating_count' in rec && (
                      <div className="flex items-center text-xs text-gray-500">
                        <ThumbsUp className="w-3 h-3 mr-1.5 text-green-500" />
                        Popularidad: {rec.rating_count} calif.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Renderizar el modal */}
      <MovieDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        movie={selectedMovie}
      />
    </div>
  )
}