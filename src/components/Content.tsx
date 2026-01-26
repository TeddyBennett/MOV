import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import noPosterH from '../assets/No-Poster-h.png';
import React from 'react';

interface Genre {
    id: number | string;
    name: string;
}

interface TrendingMovie {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
    release_date: string;
    count?: number;
}

interface ContentProps {
    trendMovies: TrendingMovie[];
    selectedCategory: number | string;
    setSelectedCategory: (category: number | string) => void;
    genres: Genre[];
}

const Content: React.FC<ContentProps> = ({
    trendMovies,
    selectedCategory,
    setSelectedCategory,
    genres
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const hasTrendingMovies = trendMovies && trendMovies.length > 0;
    const trendTopMovies = hasTrendingMovies
        ? [...trendMovies].sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 10)
        : [];

    return (
        <main className="main-flex-container">
            <div className="trend-movies-container">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Top Trending Now</h2>
                    {location.pathname === "/" && (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                className="bg-gray-800/80 backdrop-blur-md text-white px-6 py-2.5 rounded-xl border border-gray-700 flex items-center gap-2 hover:bg-gray-700 transition-all font-medium text-sm"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {selectedCategory === "AllMovie" ? "All Movies" : genres.find(g => g.id === selectedCategory)?.name}
                                <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                            </button>

                            {isOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50 py-1 max-h-80 overflow-y-auto">
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600 hover:text-white transition-colors"
                                        onClick={() => { setSelectedCategory("AllMovie"); setIsOpen(false); }}
                                    >
                                        All Movies
                                    </button>
                                    {genres.map((genre) => (
                                        <button
                                            key={genre.id}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600 hover:text-white transition-colors"
                                            onClick={() => { setSelectedCategory(genre.id); setIsOpen(false); }}
                                        >
                                            {genre.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </header>

                {!hasTrendingMovies ? (
                    <div className="bg-gray-900/50 border border-dashed border-gray-800 rounded-3xl py-16 text-center">
                        <div className="text-6xl mb-4">🎬</div>
                        <h3 className="text-xl font-bold text-white">No Trending Movies Yet</h3>
                        <p className="text-gray-400 max-w-xs mx-auto">Check back later to see what's trending across the platform!</p>
                    </div>
                ) : (
                    <ul className="trend-movies-grid">
                        {trendTopMovies.map((movie, index) => {
                            const imgUrl = movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : noPosterH;

                            return (
                                <Link key={`${movie.id}-${index}`} to={`/movie/${movie.id}`} className="group relative block transition-all hover:scale-105">
                                    <li className="trend-movie-card bg-gray-900/40 rounded-2xl overflow-hidden border border-gray-800/50 hover:border-indigo-500/50 transition-colors">
                                        <div className="absolute top-3 left-3 z-20 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-600/30">
                                            {index + 1}
                                        </div>
                                        <div className="trend-movie-poster overflow-hidden">
                                            <img
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                src={imgUrl}
                                                alt={movie.title}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = noPosterH;
                                                }}
                                            />
                                        </div>
                                        <div className="p-4 bg-gradient-to-b from-gray-900/80 to-black">
                                            <h3 className="text-sm font-bold text-white truncate mb-2" title={movie.title}>
                                                {movie.title}
                                            </h3>
                                            <div className="flex items-center gap-3 text-[10px] text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-yellow-400 text-xs">⭐</span>
                                                    <span className="text-white font-medium">{movie.vote_average.toFixed(1)}</span>
                                                </div>
                                                <span>•</span>
                                                <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                                            </div>
                                        </div>
                                    </li>
                                </Link>
                            );
                        })}
                    </ul>
                )}
            </div>
        </main>
    );
};

export default Content;
