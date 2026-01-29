/**
 * Utility function to cap the total pages at 500 as per TMDB API limits
 * @param totalPages - The total pages from the API response
 * @returns The capped total pages (maximum 500)
 */
export function capTotalPages(totalPages: number): number {
  return Math.min(totalPages, 500);
}
