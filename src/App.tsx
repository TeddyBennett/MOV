import { useEffect, useRef, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Content from './components/Content';
import { useDebounce } from 'use-debounce';
import Pagination from './components/Pagination';
import { useDataContext } from './data/DataContext';
import NavMenu from './components/NavMenu';
import { Routes, Route, useLocation } from 'react-router-dom';
import MovieGrid from './components/MovieGrid';
import { Toaster } from "./components/ui/toaster";
import FavoritesPage from './components/FavoritesPage';
import WatchlistPage from './components/WatchlistPage';
import RatedMoviesPage from './components/RatedMoviesPage';
import Trendingmovie from './components/trendingmoviepage';
import ListPage from './components/ListPage';
import { ApiService } from './services/apiService';
import { logError } from './utils/errorHandler';
import MovieDetails from './components/MovieDetails';
import React from 'react';
import { Movie } from './types';

const App: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
    const [selectedCategory, setSelectedCategory] = useState<number | string>("AllMovie");
    const loadedPages = useRef<number>(0);
    const filteredMovieRef = useRef<Movie[]>([]);
    const loadPerPage = 5;
    const moviesPerPage = 20;
    const location = useLocation();
    const isFirstRender = useRef<boolean>(true);

    const {
        movies,
        setMovies,
        currentPage,
        setCurrentPage,
        setIsLoading,
        totalPages,
        setTotalPages,
        trendMovies,
        updateTrendMovies,
        genres
    } = useDataContext();

    const updateDisplayedMoviesForGenreSearchTerm = (allMovies: Movie[]) => {
        const startIndex = (currentPage - 1) * moviesPerPage;
        setMovies(allMovies.slice(startIndex, startIndex + moviesPerPage));
    };

    const fetchMovie = async () => {
        try {
            setIsLoading(true);
            const response = debouncedSearchTerm
                ? await ApiService.searchMovies(debouncedSearchTerm, currentPage)
                : await ApiService.fetchPopularMovies(currentPage);

            if (debouncedSearchTerm && response.results.length > 0) {
                updateTrendMovies(response.results[0]);
            }

            setMovies(response.results);
            setTotalPages(response.total_pages);
        } catch (error) {
            logError('fetchMovie', error);
            console.error("Error fetching movie data: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMoviesByGenre = async (genreId: number | string) => {
        try {
            setIsLoading(true);

            if (!debouncedSearchTerm) {
                const data = await ApiService.fetchMoviesByGenre(genreId as number, currentPage);
                setMovies(data.results || []);
                setTotalPages(data.total_pages);
                setIsLoading(false);
                return;
            }

            let page = loadedPages.current + 1;
            let targetPage = page + loadPerPage - 1;

            if (filteredMovieRef.current.length > 0 && currentPage < totalPages - 1) {
                setIsLoading(false);
                return;
            }

            let newMovies: Movie[] = [];
            let count = 0;

            while (page <= targetPage) {
                const data = await ApiService.fetchMoviesByGenre(genreId as number, page);
                if (data.results) newMovies = [...newMovies, ...data.results];
                if (page >= data.total_pages) break;
                page++;
                count++;
            }

            const filteredResults = newMovies.filter(movie =>
                movie.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );

            filteredMovieRef.current = [...filteredMovieRef.current, ...filteredResults];
            setMovies(filteredMovieRef.current);
            setTotalPages(Math.ceil(filteredMovieRef.current.length / moviesPerPage));
            updateDisplayedMoviesForGenreSearchTerm(filteredMovieRef.current);
            loadedPages.current += count;
        } catch (error) {
            logError('fetchMoviesByGenre', error);
            console.error("Fetching Data Failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetState = () => {
        setMovies([]);
        setCurrentPage(1);
        filteredMovieRef.current = [];
        loadedPages.current = 0;
    };

    useEffect(() => {
        resetState();
    }, [debouncedSearchTerm, selectedCategory]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (debouncedSearchTerm && selectedCategory && selectedCategory !== "AllMovie") {
            fetchMoviesByGenre(selectedCategory);
        } else if (debouncedSearchTerm) {
            fetchMovie();
        } else if (selectedCategory && selectedCategory !== "AllMovie") {
            fetchMoviesByGenre(selectedCategory);
        } else {
            fetchMovie();
        }
    }, [debouncedSearchTerm, selectedCategory, currentPage]);

    useEffect(() => {
        if (filteredMovieRef.current.length > 0) {
            updateDisplayedMoviesForGenreSearchTerm(filteredMovieRef.current);
        }
    }, [currentPage]);

    const prevPathname = useRef<string>(location.pathname);

    useEffect(() => {
        if (prevPathname.current !== location.pathname) {
            resetState();
            prevPathname.current = location.pathname;
        }

        if (location.pathname === '/') {
            fetchMovie();
        }
    }, [location]);


    return (
        <>
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <NavMenu />
            {location.pathname === '/' && (
                <Content
                    trendMovies={trendMovies}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    genres={genres}
                />
            )}
            <Routes>
                <Route path="/" element={<MovieGrid />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
                <Route path="/rated-movies" element={<RatedMoviesPage />} />
                <Route path="/trending-day" element={<Trendingmovie time="day" />} />
                <Route path="/trending-week" element={<Trendingmovie time="week" />} />
                <Route path="/list/:id" element={<ListPage />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
            </Routes>

            {movies && movies.length > 0 && (
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    handlePageChange={setCurrentPage}
                />
            )}

            <Toaster />
        </>
    );
};

export default App;
