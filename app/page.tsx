import Link from "next/link"
import { Film, Users, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Film className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Sistema de Recomendación de Películas MINE4201</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-100 p-4 rounded-full">
              <Sparkles className="w-12 h-12 text-purple-600" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Descubre tu próxima película favorita</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nuestro sistema híbrido de recomendación combina filtrado colaborativo y análisis de grafos de conocimiento
            para ofrecerte recomendaciones personalizadas basadas en el dataset MovieLens enriquecido con DBpedia e
            IMDB.
          </p>
        </div>

        {/* Options Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Existing User Option */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-purple-200">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-900">Usuario Existente</CardTitle>
              <CardDescription className="text-gray-600">
                ¿Ya tienes un ID de usuario del dataset MovieLens? Obtén recomendaciones basadas en tu historial de
                calificaciones.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li>• Recomendaciones basadas en tu historial</li>
                <li>• Análisis de usuarios similares</li>
              </ul>
              <Link href="/existing-user">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Continuar como Usuario Existente</Button>
              </Link>
            </CardContent>
          </Card>

          {/* New User Option */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-purple-200">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Sparkles className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-900">Nuevo Usuario</CardTitle>
              <CardDescription className="text-gray-600">
                ¿Primera vez aquí? Configura tus preferencias para recibir recomendaciones personalizadas desde el
                primer momento.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li>• Selecciona géneros favoritos</li>
                <li>• Califica películas populares</li>
                <li>• Recomendaciones basadas en grafo de conocimiento</li>
              </ul>
              <Link href="/new-user/preferences">
                <Button className="w-full bg-green-600 hover:bg-green-700">Comenzar como Nuevo Usuario</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Características del Sistema</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Film className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Filtrado Colaborativo</h4>
              <p className="text-sm text-gray-600">Encuentra películas basándote en usuarios con gustos similares</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Grafo de Conocimiento</h4>
              <p className="text-sm text-gray-600">Recomendaciones basadas en actores, directores y relaciones</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Sistema Híbrido</h4>
              <p className="text-sm text-gray-600">Combina múltiples enfoques para mejores resultados</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>MINE4201 - Sistemas de Recomendación | Dataset MovieLens Latest</p>
            <p className="text-sm mt-2">Enriquecido con DBpedia e IMDB</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
