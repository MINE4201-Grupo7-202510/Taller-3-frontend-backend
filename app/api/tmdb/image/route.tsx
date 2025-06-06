// app/api/tmdb/image/route.ts
import { NextResponse } from 'next/server'

const TMDB_API_KEY = process.env.TMDB_API_KEY
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
    const searchUrl = `${TMDB_BASE_URL}/find/${imdbId}?external_source=imdb_id&language=es-ES,en-US,null`;
    
    console.log(`Fetching TMDB: ${searchUrl}`);

    const tmdbRes = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_API_KEY}`
      }
    });

    if (!tmdbRes.ok) {
      const responseText = await tmdbRes.text();
      console.error(`TMDB API error for imdbId ${imdbId}: ${tmdbRes.status} ${responseText}`)
      return NextResponse.json({ error: 'Failed to fetch data from TMDB', details: tmdbRes.statusText, responseBody: responseText }, { status: tmdbRes.status })
    }

    const tmdbData = await tmdbRes.json();

    const processResults = (results: any[]) => {
      if (results && results.length > 0) {
        const item = results[0];
        const imageUrl = item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : null;
        const overview = item.overview || "No hay sinopsis disponible.";
        
        console.log(`Found TMDB data for ${imdbId}: ${item.title || item.name}`);
        return NextResponse.json({ imageUrl, overview });
      }
      return null;
    };
    
    // Prioriza resultados de películas, luego de series de TV
    let response = processResults(tmdbData.movie_results);
    if (response) return response;

    response = processResults(tmdbData.tv_results);
    if (response) return response;

    console.log(`No image or overview found for imdbId ${imdbId} in TMDB response.`);
    return NextResponse.json({ imageUrl: null, overview: null, message: 'No item found in TMDB' }, { status: 404 })

  } catch (error: any) {
    console.error(`Error fetching from TMDB API for imdbId ${imdbId}:`, error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}