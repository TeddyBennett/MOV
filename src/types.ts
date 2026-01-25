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
