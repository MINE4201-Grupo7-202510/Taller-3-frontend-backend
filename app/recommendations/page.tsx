// app/recommendations/page.tsx
"use client"

import { Suspense } from "react"
import RecommendationsContent from "@/components/recommendations-content" // Asegúrate que el path sea correcto
import { Film, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"


function LoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="text-center">
        <Film className="w-16 h-16 text-purple-600 animate-pulse mx-auto mb-4" /> {/* Cambiado a pulse para diferenciar del progress */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Cargando recomendaciones...</h2>
        <p className="text-gray-500">Estamos buscando las mejores películas para ti.</p>
        {/* Puedes mantener el Progress si quieres o quitarlo si el de recommendations-content es suficiente */}
        {/* <Progress value={30} className="w-64 mx-auto mt-4" />  */}
      </div>
    </div>
  );
}


export default function RecommendationsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RecommendationsContent />
    </Suspense>
  )
}