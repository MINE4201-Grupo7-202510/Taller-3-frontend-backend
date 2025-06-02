import { NextResponse } from 'next/server'

const TMDB_API_KEY = process.env.TMDB_API_KEY // Este es tu token v4
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

export async function GET(request: Request) {
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB API token not configured' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  let imdbId = searchParams.get('imdbId')

  if (!imdbId) {
    return NextResponse.json({ error: 'imdbId query parameter is required' }, { status: 400 })
  }

  if (!imdbId.startsWith('tt')) {
    imdbId = `tt${imdbId}`
  }

  try {
    // Removido api_key del query string
    const searchUrl = `${TMDB_BASE_URL}/find/${imdbId}?external_source=imdb_id&language=es-ES,en-US,null`; // Agregado language para mejorar resultados
    
    console.log(`Fetching TMDB: ${searchUrl} with token starting with: ${TMDB_API_KEY.substring(0, 10)}...`);

    const tmdbRes = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_API_KEY}` // Usar el token v4 en el header
      }
    });

    const responseText = await tmdbRes.text(); // Leer el texto para depuración
    // console.log(`TMDB Response Status: ${tmdbRes.status}`);
    // console.log(`TMDB Response Text: ${responseText}`);


    if (!tmdbRes.ok) {
      console.error(`TMDB API error for imdbId ${imdbId}: ${tmdbRes.status} ${responseText}`)
      return NextResponse.json({ error: 'Failed to fetch data from TMDB', details: tmdbRes.statusText, responseBody: responseText }, { status: tmdbRes.status })
    }

    const tmdbData = JSON.parse(responseText); // Parsear el texto a JSON

    if (tmdbData.movie_results && tmdbData.movie_results.length > 0) {
      const movie = tmdbData.movie_results[0]
      if (movie.poster_path) {
        console.log(`Found movie poster for ${imdbId}: ${movie.poster_path}`);
        return NextResponse.json({ imageUrl: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` })
      }
    } else if (tmdbData.tv_results && tmdbData.tv_results.length > 0) {
        const tvShow = tmdbData.tv_results[0];
        if (tvShow.poster_path) {
            console.log(`Found TV show poster for ${imdbId}: ${tvShow.poster_path}`);
            return NextResponse.json({ imageUrl: `${TMDB_IMAGE_BASE_URL}${tvShow.poster_path}` });
        }
    }

    console.log(`No image found for imdbId ${imdbId} in TMDB response.`);
    return NextResponse.json({ imageUrl: null, message: 'No image found or movie/show not found in TMDB' }, { status: 404 })

  } catch (error: any) {
    console.error(`Error fetching from TMDB API for imdbId ${imdbId}:`, error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

// No necesitas este export default aquí, ya que es una API Route Handler
// export default function Loading() {
//   return null
// }