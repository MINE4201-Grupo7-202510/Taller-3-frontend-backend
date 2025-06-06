// components/MovieDetailsModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Calendar, Clapperboard } from "lucide-react";

// Tipo local para simplificar las props del modal.
// Coincide con los datos que se le pasarán desde `recommendations-content`.
interface EnrichedMovie {
  details?: {
    title?: string;
    genres: string[];
  } | null;
  imageUrl?: string;
  overview?: string;
  explanation?: string;
}

interface MovieDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: EnrichedMovie | null;
}

export default function MovieDetailsModal({ isOpen, onClose, movie }: MovieDetailsModalProps) {
  if (!movie) {
    return null;
  }

  // Extrae el año del título, ej: "Toy Story (1995)" -> "Toy Story" y "1995"
  let displayTitle = movie.details?.title || "Título no disponible";
  let year = "";
  const yearMatch = displayTitle.match(/\s\((\d{4})\)$/);
  if (yearMatch) {
    year = yearMatch[1];
    displayTitle = displayTitle.replace(yearMatch[0], "").trim();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Columna de la Imagen */}
          <div className="md:col-span-1">
            {movie.imageUrl ? (
              <img
                src={movie.imageUrl}
                alt={`Póster de ${displayTitle}`}
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
                <Clapperboard className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Columna de Detalles */}
          <div className="md:col-span-2 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold">{displayTitle}</DialogTitle>
              {year && (
                <div className="flex items-center text-lg text-gray-500 mt-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  {year}
                </div>
              )}
            </DialogHeader>

            {/* Géneros */}
            {movie.details?.genres && movie.details.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.details.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            {/* Sinopsis */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Sinopsis</h3>
              <DialogDescription className="text-base text-gray-700 leading-relaxed">
                {movie.overview || "La sinopsis no está disponible."}
              </DialogDescription>
            </div>

            {/* Explicación de la Recomendación */}
            {movie.explanation && (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold mb-2 flex items-center text-purple-800">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                  ¿Por qué te la recomendamos?
                </h3>
                <p className="text-purple-900">{movie.explanation}</p>
              </div>
            )}

            <DialogFooter>
              <Button onClick={onClose} className="mt-4">Cerrar</Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}