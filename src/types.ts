export interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    release_date: string;
    vote_average: number;
    original_language: string;
    // User specific data (added by processMovies)
    isFavorite?: boolean;
    isWatchlist?: boolean;
    rating?: number;
}

export interface List {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    _count?: {
        listMovies: number;
    };
    listMovies?: {
        movieId: number;
    }[];
}

export interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
}

export interface Session {
    user: User;
    session: {
        id: string;
        expiresAt: string;
    };
}

export interface Rating {
    id: number;
    userId: string;
    movieId: number;
    rating: number;
}

export interface ProcessedMovie {
    id: number;
    posterUrl: string;
    movieTitle: string;
    score: number | string;
    originalLang: string;
    releaseDate: number | string;
    isFavorite: boolean;
    isWatchlist: boolean;
    rating: number;
}

export interface ListInfo {
    name: string;
    item_count: number;
}

export interface Genre {
    id: number;
    name: string;
}

export interface TrendingMovie {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
    release_date: string;
    count?: number;
}

export interface MovieDataOperations {
    addToFavorites: (movieId: number) => Promise<boolean>;
    removeFromFavorites: (movieId: number, title?: string) => Promise<boolean>;
    addToWatchlist: (movieId: number) => Promise<boolean>;
    removeFromWatchlist: (movieId: number, title?: string) => Promise<boolean>;
    rateMovie: (movieId: number, rating: number) => Promise<boolean>;
    deleteRating: (movieId: number) => Promise<boolean>;
    addMovieToList: (listId: number, movieId: number) => Promise<boolean>;
    removeMovieFromList: (listId: number, movieId: number) => Promise<boolean>;
    createList: (name: string) => Promise<boolean>;
    deleteList: (listId: number) => Promise<boolean>;
    getProcessedMovies: (movies: Partial<Movie>[], fallbackPosterUrl: string) => ProcessedMovie[];
    getFavorites: () => Set<number>;
    getWatchlist: () => Set<number>;
    getRatings: () => Map<number, number>;
    getLists: () => Map<number, ListInfo>;
    getMoviesInLists: () => Map<number, Set<number>>;
}

export interface DataContextType {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isInitializing: boolean;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    movies: Movie[];
    setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
    totalPages: number;
    setTotalPages: React.Dispatch<React.SetStateAction<number>>;
    trendMovies: TrendingMovie[];
    setTrendMovies: React.Dispatch<React.SetStateAction<TrendingMovie[]>>;
    userStatsVersion: number;
    genres: Genre[];
    updateTrendMovies: (firstIndexMovie: any) => Promise<void>;
    movieDataOperations: MovieDataOperations;
}
