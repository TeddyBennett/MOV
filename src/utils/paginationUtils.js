/**
 * Utility function to cap the total pages at 500 as per TMDB API limits
 * @param {number} totalPages - The total pages from the API response
 * @returns {number} - The capped total pages (maximum 500)
 */
export function capTotalPages(totalPages) {
  return Math.min(totalPages, 500);
}