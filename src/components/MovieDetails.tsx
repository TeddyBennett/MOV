import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiService } from '../services/apiService';
import noPosterH from '../assets/No-Poster-h.png';
import { BsStarFill, BsFillHeartFill, BsFillBookmarkPlusFill, BsChevronLeft, BsCalendar, BsClock, BsTag, BsBookmarkFill } from 'react-icons/bs';
import { useDataContext } from '../data/DataContext';
import { useCustomToast } from '../hooks/useCustomToast';
import { Genre, Movie } from '../types';

interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

interface ProductionCompany {
    id: number;
    name: string;
}

interface MovieDetailsData extends Movie {
    runtime: number;
    tagline: string;
    production_companies: ProductionCompany[];
    budget: number;
    revenue: number;
    genres: Genre[];
    credits?: {
        cast: CastMember[];
    };
    recommendations?: {
        results: Movie[];
    };
}

const MovieDetailsSkeleton = () => (
    <div className="relative z-10 mb-8 animate-pulse max-w-[1248px] mx-auto overflow-hidden rounded-xl">
        {/* Hero Section Skeleton */}
        <div className="w-full min-h-[500px] md:h-[600px] bg-gray-800 relative flex items-end">
            <div className="relative z-10 w-full p-6 md:p-10">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-end">
                    <div className="md:mr-8 mb-6 md:mb-0">
                        <div className="w-48 h-72 bg-gray-700 rounded-lg shadow-2xl"></div>
                    </div>
                    <div className="flex-1 text-center md:text-left w-full">
                        <div className="h-10 bg-gray-700 rounded w-3/4 mb-4 mx-auto md:mx-0"></div>
                        <div className="h-6 bg-gray-700 rounded w-1/2 mb-6 mx-auto md:mx-0"></div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <div className="h-8 bg-gray-700 rounded-full w-24"></div>
                            <div className="h-8 bg-gray-700 rounded-full w-20"></div>
                            <div className="h-8 bg-gray-700 rounded-full w-28"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* Main Content Skeleton */}
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
                    <div className="h-24 bg-gray-700 rounded mb-8"></div>
                    <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="text-center">
                                <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-2"></div>
                                <div className="h-4 bg-gray-700 rounded w-20 mx-auto"></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
                        <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
                        <div className="h-12 bg-gray-700 rounded mb-4"></div>
                        <div className="h-12 bg-gray-700 rounded mb-4"></div>
                        <div className="h-12 bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const MovieDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { movieDataOperations } = useDataContext();
    const { showCustomToast, showErrorToast } = useCustomToast();
    const navigate = useNavigate();
    const [movie, setMovie] = useState<MovieDetailsData | null>(null);
    const [cast, setCast] = useState<CastMember[]>([]);
    const [recommended, setRecommended] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // When ID changes, reset the state to show loading skeleton immediately
        setMovie(null);
        setCast([]);
        setRecommended([]);
        setError(null);
        setIsLoading(true);

        const fetchMovieDetails = async () => {
            if (!id) return;
            try {
                // Fetch movie details via proxy
                const movieData = await ApiService.fetchMovieDetails(id, {
                    append_to_response: 'credits,recommendations'
                });

                setMovie(movieData);

                // Fetch cast members (top 10)
                if (movieData.credits?.cast) {
                    setCast(movieData.credits.cast.slice(0, 10));
                }

                // Fetch recommended movies
                if (movieData.recommendations?.results) {
                    setRecommended(movieData.recommendations.results.slice(0, 6));
                }
            } catch (err: any) {
                setError(err.message);
                showErrorToast("Failed to load movie details. Please try again.", "LOAD ERROR");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id, showErrorToast]);

    const handleGoBack = () => {
        navigate(-1);
    };

    if (isLoading) {
        return <MovieDetailsSkeleton />;
    }

    if (error) {
        return (
            <div className="relative z-10 mb-8 error max-w-[1248px] mx-auto overflow-hidden rounded-xl">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center text-white">
                        <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Movie</h2>
                        <p className="text-gray-400 mb-6">{error}</p>
                        <button
                            onClick={handleGoBack}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center mx-auto"
                        >
                            <BsChevronLeft className="mr-2" /> Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="relative z-10 mb-8 max-w-[1248px] mx-auto overflow-hidden rounded-xl">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-300 mb-4">Movie Not Found</h2>
                        <button
                            onClick={handleGoBack}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center mx-auto"
                        >
                            <BsChevronLeft className="mr-2" /> Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

  const {
    title,
    poster_path,
    backdrop_path,
    overview,
    release_date,
    runtime,
    vote_average,
    genres,
    tagline,
    production_companies,
    budget,
    revenue
  } = movie;

  const imageUrl = backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${backdrop_path}`
    : poster_path
      ? `https://image.tmdb.org/t/p/w1280${poster_path}`
      : noPosterH;


  const isFavorite = movieDataOperations.getFavorites().has(Number(id));
  const isWatchlist = movieDataOperations.getWatchlist().has(Number(id));

  async function handleFavoriteClick() {
    if (!movie) return;
    try {
      const success = isFavorite
        ? await movieDataOperations.removeFromFavorites(movie.id)
        : await movieDataOperations.addToFavorites(movie.id);

      if (success) {
        const operation = isFavorite ? "removed from Favorite" : "added to Favorite";
        const variant = isFavorite ? "destructive" : "success";
        showCustomToast(movie.title, operation, variant, "FAVORITE MOVIES");
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      showCustomToast(
        movie.title,
        "could not be updated in your favorites",
        "warning",
        "FAVORITE MOVIES"
      );
    }
  }

  async function handleWatchlistClick() {
    if (!movie) return;
    try {
      const success = isWatchlist
        ? await movieDataOperations.removeFromWatchlist(movie.id)
        : await movieDataOperations.addToWatchlist(movie.id);

      if (success) {
        const operation = isWatchlist ? "removed from Watchlist" : "added to Watchlist";
        const variant = isWatchlist ? "destructive" : "success";
        showCustomToast(movie.title, operation, variant, "WATCHLIST MOVIES");
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
      showCustomToast(
        movie.title,
        "could not be updated in your watchlist",
        "warning",
        "WATCHLIST MOVIES"
      );
    }
  }
  return (
    <div className="relative z-10 mb-8 max-w-[1248px] mx-auto overflow-hidden rounded-xl">
      {/* Hero Section */}
      <div className="relative z-10">
        <div
          className="w-full min-h-[500px] md:h-[600px] bg-cover bg-center relative overflow-hidden flex items-end"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f10] via-[#0f0f10]/40 to-transparent z-0"></div>
          <div className="relative z-10 w-full p-6 md:p-10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-end">
              <div className="md:mr-8 mb-6 md:mb-0">
                <img
                  src={poster_path ? `https://image.tmdb.org/t/p/w300${poster_path}` : noPosterH}
                  alt={title}
                  className="w-48 h-72 object-cover rounded-lg shadow-2xl relative z-20 border border-white/10"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = noPosterH;
                  }}
                />
              </div>

              <div className="flex-1 text-center md:text-left text-white relative z-20">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-3 drop-shadow-lg tracking-tight">{title}</h1>

                {tagline && (
                  <p className="italic text-gray-300 mb-6 text-lg md:text-xl font-medium">"{tagline}"</p>
                )}

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                  {vote_average > 0 && (
                    <div className="flex items-center bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 px-4 py-1.5 rounded-full">
                      <BsStarFill className="text-yellow-400 mr-2" />
                      <span className="font-bold text-yellow-500">{vote_average.toFixed(1)}</span>
                    </div>
                  )}

                  {release_date && (
                    <div className="flex items-center text-gray-300 font-medium">
                      <BsCalendar className="mr-2 text-indigo-400" />
                      <span>{new Date(release_date).getFullYear()}</span>
                    </div>
                  )}

                  {runtime && (
                    <div className="flex items-center text-gray-300 font-medium">
                      <BsClock className="mr-2 text-indigo-400" />
                      <span>{runtime} min</span>
                    </div>
                  )}
                </div>

                {genres && (genres as Genre[]).length > 0 && (
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                    {(genres as Genre[]).map((genre) => (
                      <span
                        key={genre.id}
                        className="px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold tracking-wider text-gray-300"
                      >
                        {genre.name.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <button
                    onClick={handleFavoriteClick}
                    className={`${isFavorite ? 'bg-red-600 shadow-red-600/20' : 'bg-white/10 hover:bg-red-600 shadow-black/20'} backdrop-blur-md px-8 py-3 rounded-xl flex items-center transition-all duration-300 font-bold text-sm shadow-xl hover:scale-105 active:scale-95`}
                  >
                    <BsFillHeartFill className={`mr-2 ${isFavorite ? 'text-white' : 'text-red-500'}`} />
                    {isFavorite ? 'REMOVE' : 'FAVORITE'}
                  </button>
                  <button
                    onClick={handleWatchlistClick}
                    className={`${isWatchlist ? 'bg-indigo-600 shadow-indigo-600/20' : 'bg-white/10 hover:bg-indigo-600 shadow-black/20'} backdrop-blur-md px-8 py-3 rounded-xl flex items-center transition-all duration-300 font-bold text-sm shadow-xl hover:scale-105 active:scale-95`}
                  >
                    {isWatchlist ? (
                      <BsBookmarkFill className="mr-2 text-white" />
                    ) : (
                      <BsFillBookmarkPlusFill className="mr-2 text-indigo-400" />
                    )}
                    {isWatchlist ? 'WATCHED' : 'WATCHLIST'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Overview and Details */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{overview}</p>
            </div>

            {/* Cast Section */}
            {cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {cast.map((person) => (
                    <div key={person.id} className="text-center group">
                      <img
                        src={person.profile_path
                          ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                          : noPosterH}
                        alt={person.name}
                        className="w-24 h-24 object-cover rounded-full mx-auto mb-2 border-2 border-gray-700 group-hover:border-blue-500 transition-all duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = noPosterH;
                        }}
                      />

                      <h3 className="text-white font-medium truncate group" title={person.name}>{person.name}</h3>

                      <p className="text-gray-400 text-sm truncate" title={person.character}>{person.character}</p>

                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Movie Details</h3>

              {budget > 0 && (
                <div className="mb-3">
                  <div className="flex items-center text-gray-300">
                    <BsTag className="mr-2" />
                    <span className="font-medium">Budget:</span>
                  </div>
                  <p className="text-white">${budget.toLocaleString()}</p>
                </div>
              )}

              {revenue > 0 && (
                <div className="mb-3">
                  <div className="flex items-center text-gray-300">
                    <BsTag className="mr-2" />
                    <span className="font-medium">Revenue:</span>
                  </div>
                  <p className="text-white">${revenue.toLocaleString()}</p>
                </div>
              )}

              {production_companies && production_companies.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center text-gray-300">
                    <BsTag className="mr-2" />
                    <span className="font-medium">Production Companies:</span>
                  </div>
                  <div className="mt-2">
                    {production_companies.slice(0, 3).map((company) => (
                      <p key={company.id} className="text-white">{company.name}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommended Movies */}
        {recommended.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Recommended Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recommended.map((recMovie) => (
                <div
                  key={recMovie.id}
                  className="cursor-pointer group"
                  onClick={() => navigate(`/movie/${recMovie.id}`)}
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={recMovie.poster_path
                        ? `https://image.tmdb.org/t/p/w300${recMovie.poster_path}`
                        : noPosterH}
                      alt={recMovie.title}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = noPosterH;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-white font-semibold truncate">{recMovie.title}</h3>
                      <div className="flex items-center text-yellow-400 text-sm">
                        <BsStarFill className="mr-1" />
                        <span>{recMovie.vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-4 pb-8">
        <button
          onClick={handleGoBack}
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center"
        >
          <BsChevronLeft className="mr-2" /> Back to Movies
        </button>
      </div>
    </div>
  );
}

export default MovieDetails;
