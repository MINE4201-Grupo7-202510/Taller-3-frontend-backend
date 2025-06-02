// app/existing-user/page.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000"

export default function ExistingUserPage() {
  const [userId, setUserId] = useState("")
  const [availableUserIds, setAvailableUserIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingUsers, setIsFetchingUsers] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUsers = async () => {
      setIsFetchingUsers(true)
      setFetchError(null)
      try {
        const res = await fetch(`${FASTAPI_URL}/users`)
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.detail || `Error fetching users: ${res.statusText}`)
        }
        const data = await res.json()
        setAvailableUserIds(data.user_ids || [])
      } catch (error: any) {
        console.error("Failed to fetch user IDs:", error)
        setFetchError(error.message || "Could not load user IDs. Please try again later or enter an ID manually.")
        setAvailableUserIds([]) // Asegurarse de que esté vacío en caso de error
      } finally {
        setIsFetchingUsers(false)
      }
    }
    fetchUsers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId.trim()) return

    setIsLoading(true)
    // No hay simulación, directamente se navega
    // La página de recomendaciones se encargará de llamar al API de FastAPI
    router.push(`/recommendations?userId=${userId}&type=existing`)
    // No es necesario setIsLoading(false) aquí debido a la redirección
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              Volver
            </Link>
            <div className="flex items-center gap-3 ml-4">
              <User className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Usuario Existente</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Ingresa o Selecciona tu ID de Usuario</CardTitle>
            <CardDescription>
              Proporciona tu ID de usuario del dataset MovieLens para obtener recomendaciones personalizadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-sm font-medium">
                  ID de Usuario MovieLens
                </Label>
                {isFetchingUsers && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cargando IDs de usuario...
                  </div>
                )}
                {fetchError && !isFetchingUsers && (
                   <p className="text-sm text-red-500">{fetchError}</p>
                )}

                {!isFetchingUsers && !fetchError && availableUserIds.length > 0 && (
                  <Select onValueChange={setUserId} value={userId}>
                    <SelectTrigger className="text-lg">
                      <SelectValue placeholder="Selecciona un ID de usuario o ingresa uno abajo" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUserIds.slice(0, 100).map((id) => ( // Limitar a 100 para no sobrecargar el dropdown
                        <SelectItem key={id} value={id}>
                          Usuario {id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Input
                  id="userId"
                  type="text"
                  placeholder="Ej: 1, 2, 3... (o selecciona de la lista)"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="text-lg mt-2"
                  required
                  disabled={isFetchingUsers && availableUserIds.length === 0}
                />
                <p className="text-sm text-gray-500">
                  {availableUserIds.length > 0 ? `Puedes seleccionar de la lista (mostrando primeros ${Math.min(100, availableUserIds.length)}) o ingresar un ID numérico.` : "Ingresa tu ID numérico del dataset MovieLens."}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">¿Qué obtendrás?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 5-10 recomendaciones de películas personalizadas</li>
                  <li>• Puntuación de relevancia para cada película</li>
                  <li>• Detalles como género y póster de la película</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                disabled={isLoading || !userId.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando Recomendaciones...
                  </>
                ) : (
                  "Obtener Recomendaciones"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes un ID de usuario?{" "}
                <Link href="/new-user/preferences" className="text-blue-600 hover:underline">
                  Comienza como nuevo usuario
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}