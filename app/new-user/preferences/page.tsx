// app/new-user/preferences/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Sparkles, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000"

export default function NewUserPreferencesPage() {
  const [availableGenres, setAvailableGenres] = useState<string[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingGenres, setIsFetchingGenres] = useState(true)
  const [fetchGenresError, setFetchGenresError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchGenres = async () => {
      setIsFetchingGenres(true)
      setFetchGenresError(null)
      try {
        const res = await fetch(`${FASTAPI_URL}/genres`)
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.detail || `Error fetching genres: ${res.statusText}`)
        }
        const data = await res.json()
        setAvailableGenres(data.genres || [])
      } catch (error: any) {
        console.error("Failed to fetch genres:", error)
        setFetchGenresError(error.message || "Could not load genres. Please try again later.")
        setAvailableGenres([])
      } finally {
        setIsFetchingGenres(false)
      }
    }
    fetchGenres()
  }, [])

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  const handleSubmit = async () => {
    if (selectedGenres.length === 0) {
      return
    }

    setIsLoading(true)
    
    const params = new URLSearchParams({
      type: "new",
      genres: selectedGenres.join(","),
    })
    
    // La página de recomendaciones se encargará de la lógica de la API
    router.push(`/recommendations?${params.toString()}`)
  }

  const canSubmit = selectedGenres.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              Volver
            </Link>
            <div className="flex items-center gap-3 ml-4">
              <Sparkles className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Configura tus Preferencias</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Selecciona tus Géneros Favoritos
              </CardTitle>
              <CardDescription>
                Elige al menos un género para personalizar tus recomendaciones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isFetchingGenres && (
                <div className="flex items-center text-gray-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cargando géneros...
                </div>
              )}
              {fetchGenresError && !isFetchingGenres && (
                <p className="text-red-500">{fetchGenresError}</p>
              )}
              {!isFetchingGenres && !fetchGenresError && availableGenres.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableGenres.map((genre) => (
                    <Badge
                      key={genre}
                      variant={selectedGenres.includes(genre) ? "default" : "outline"}
                      className={`cursor-pointer text-center py-2 px-4 transition-colors ${
                        selectedGenres.includes(genre)
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "hover:bg-green-50 hover:border-green-300 text-green-700 border-green-200"
                      }`}
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}
              {!isFetchingGenres && !fetchGenresError && availableGenres.length === 0 && (
                 <p className="text-gray-500">No hay géneros disponibles para seleccionar en este momento.</p>
              )}
              <p className="text-sm text-gray-600 mt-4">Géneros seleccionados: {selectedGenres.length}</p>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isLoading || isFetchingGenres}
              className="bg-green-600 hover:bg-green-700 text-lg py-3 px-8"
            >
              {isLoading ? (
                 <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando Recomendaciones...
                  </>
              ) : "Generar Recomendaciones"}
            </Button>
            {!canSubmit && !isLoading && (
              <p className="text-sm text-red-500 mt-2">
                Selecciona al menos un género para continuar.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}