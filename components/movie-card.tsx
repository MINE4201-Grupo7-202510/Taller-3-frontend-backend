import Image from "next/image"
import { Star, TrendingUp, ThumbsUp, ThumbsDown } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Movie {
  id: number
  title: string
  year: number
  genres: string[]
  poster: string
  explanation: string
  relevanceScore: number
}

interface MovieCardProps {
  movie: Movie
  rank: number
}

export default function MovieCard({ movie, rank }: MovieCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src={movie.poster || "/placeholder.svg"}
            alt={`Póster de ${movie.title}`}
            width={200}
            height={300}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-2 left-2">
            <Badge className="bg-purple-600 text-white font-bold">#{rank}</Badge>
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/90 text-gray-900">
              {(movie.relevanceScore * 100).toFixed(0)}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Movie Info */}
          <div>
            <h3 className="font-bold text-lg line-clamp-2">{movie.title}</h3>
            <p className="text-gray-600 text-sm">{movie.year}</p>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1">
            {movie.genres.map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>

          {/* Explanation */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800 leading-relaxed">{movie.explanation}</p>
            </div>
          </div>

          {/* Relevance Score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">Relevancia: {(movie.relevanceScore * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* Feedback Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1 text-green-600 hover:bg-green-50">
              <ThumbsUp className="w-4 h-4 mr-1" />
              Relevante
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:bg-red-50">
              <ThumbsDown className="w-4 h-4 mr-1" />
              No relevante
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
