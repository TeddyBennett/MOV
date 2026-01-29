// src/utils/movieUtils.ts
// Single Responsibility: Provide utility functions for movie data processing

import { Movie, ProcessedMovie } from '../types';

/**
 * Format score to one decimal place
 * @param score - The score to format
 * @returns Formatted score
 */
export function scoreFormat(score: number | string | undefined | null): string | number {
  if (score === undefined || score === null) return "N/A";
  if (typeof score === 'number' && Number.isFinite(score)) {
      return score.toFixed(1);
  }
  return score;
}

/**
 * Get poster URL for a movie
 * @param posterPath - The poster path from the API
 * @param fallbackUrl - Fallback URL if poster path is null
 * @returns Full poster URL
 */
export function getPosterUrl(posterPath: string | null | undefined, fallbackUrl: string): string {
  return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : fallbackUrl;
}

/**
 * Extract year from release date
 * @param releaseDate - Release date string
 * @returns Year or "N/A" if invalid
 */
export function extractYear(releaseDate: string | null | undefined): number | string {
  return releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
}

/**
 * Process raw movie data with user status
 * @param movies - Raw movie data from API
 * @param favorites - Set of favorite movie IDs
 * @param watchlist - Set of watchlist movie IDs
 * @param ratings - Map of movie ratings
 * @param fallbackPosterUrl - Fallback poster URL
 * @returns Processed movie data with user status
 */
export function processMoviesWithUserStatus(
  movies: Partial<Movie>[],
  favorites: Set<number>,
  watchlist: Set<number>,
  ratings: Map<number, number>,
  fallbackPosterUrl: string
): ProcessedMovie[] {
  return movies.map((movie) => {
    if (!movie.id) throw new Error("Movie ID is missing");
    
    const posterUrl = getPosterUrl(movie.poster_path, fallbackPosterUrl);
    const movieTitle = movie.title || "N/A";
    const score = movie.vote_average || "N/A";
    const originalLang = movie.original_language || "N/A";
    const releaseDate = extractYear(movie.release_date);

    const isFavorite = favorites.has(movie.id);
    const isWatchlist = watchlist.has(movie.id);
    const rating = ratings.has(movie.id) ? ratings.get(movie.id) || 0 : 0;

    return {
      id: movie.id,
      posterUrl,
      movieTitle,
      score,
      originalLang,
      releaseDate,
      isFavorite,
      isWatchlist,
      rating,
    };
  });
}