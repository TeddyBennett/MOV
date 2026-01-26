// src/utils/movieUtils.js
// Single Responsibility: Provide utility functions for movie data processing

/**
 * Format score to one decimal place
 * @param {number|string} score - The score to format
 * @returns {string|number} Formatted score
 */
export function scoreFormat(score) {
  return Number.isFinite(score) ? score.toFixed(1) : score;
}

/**
 * Get poster URL for a movie
 * @param {string|null} posterPath - The poster path from the API
 * @param {string} fallbackUrl - Fallback URL if poster path is null
 * @returns {string} Full poster URL
 */
export function getPosterUrl(posterPath, fallbackUrl) {
  return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : fallbackUrl;
}

/**
 * Extract year from release date
 * @param {string} releaseDate - Release date string
 * @returns {string|number} Year or "N/A" if invalid
 */
export function extractYear(releaseDate) {
  return releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
}

/**
 * Process raw movie data with user status
 * @param {Array} movies - Raw movie data from API
 * @param {Set} favorites - Set of favorite movie IDs
 * @param {Set} watchlist - Set of watchlist movie IDs
 * @param {Map} ratings - Map of movie ratings
 * @param {string} fallbackPosterUrl - Fallback poster URL
 * @returns {Array} Processed movie data with user status
 */
export function processMoviesWithUserStatus(movies, favorites, watchlist, ratings, fallbackPosterUrl) {
  return movies.map((movie) => {
    const posterUrl = getPosterUrl(movie.poster_path, fallbackPosterUrl);
    const movieTitle = movie.title || "N/A";
    const score = movie.vote_average || "N/A";
    const originalLang = movie.original_language || "N/A";
    const releaseDate = extractYear(movie.release_date);

    const isFavorite = favorites.has(movie.id);
    const isWatchlist = watchlist.has(movie.id);
    const rating = ratings.has(movie.id) ? ratings.get(movie.id) : 0;

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