import React, { useRef } from 'react';
import { BsStarFill } from "react-icons/bs";
import { useDataContext } from '../data/DataContext';
import { ComboboxDropdownMenu } from './DropdownV2';
import { scoreFormat } from '../utils/movieUtils';
import { Link } from "react-router-dom";
import { useCustomToast } from '../hooks/useCustomToast';

interface MovieCardProps {
    movie: {
        id: number;
        posterUrl: string;
        movieTitle: string;
        score: number;
        originalLang: string;
        releaseDate: string;
        isFavorite: boolean;
        isWatchlist: boolean;
        rating?: number;
    };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const { movieDataOperations } = useDataContext();
    const currentRating = useRef<number>(0);
    const selectedList = useRef<number | string>(0);
    const { showCustomToast } = useCustomToast();

    const {
        id,
        posterUrl,
        movieTitle,
        score,
        originalLang,
        releaseDate,
        isFavorite,
        isWatchlist,
        rating
    } = movie;

    const handleSaveFavorite = async () => {
        try {
            const success = isFavorite
                ? await movieDataOperations.removeFromFavorites(id)
                : await movieDataOperations.addToFavorites(id);

            if (success) {
                const operation = isFavorite ? "removed from Favorite" : "added to Favorite";
                const variant = isFavorite ? "destructive" : "success";
                showCustomToast(movieTitle, operation, variant, "FAVORITE MOVIES");
            }
        } catch (error) {
            console.error('Error updating favorite:', error);
            showCustomToast(movieTitle, "could not be updated in your favorites", "warning", "FAVORITE MOVIES");
        }
    };

    const handleSaveWatchlist = async () => {
        try {
            const success = isWatchlist
                ? await movieDataOperations.removeFromWatchlist(id)
                : await movieDataOperations.addToWatchlist(id);

            if (success) {
                const operation = isWatchlist ? "removed from Watchlist" : "added to Watchlist";
                const variant = isWatchlist ? "destructive" : "success";
                showCustomToast(movieTitle, operation, variant, "WATCHLIST MOVIES");
            }
        } catch (error) {
            console.error('Error updating watchlist:', error);
            showCustomToast(movieTitle, "could not be updated in your watchlist", "warning", "WATCHLIST MOVIES");
        }
    };

    const handleSaveRating = async () => {
        try {
            const ratingValue = currentRating.current;
            const success = await movieDataOperations.rateMovie(id, ratingValue);

            if (success) {
                showCustomToast(movieTitle, "updated your rating", "success", "MOVIE'S RATING");
            }
        } catch (error) {
            console.error('Error saving movie rating:', error);
            showCustomToast(movieTitle, "could not be rated", "warning", "MOVIE'S RATING");
        }
    };

    const handleDelRating = async () => {
        try {
            const success = await movieDataOperations.deleteRating(id);

            if (success) {
                showCustomToast(movieTitle, "removed from your rating", "destructive", "MOVIE'S RATING");
            }
        } catch (error) {
            console.error('Error deleting rating:', error);
            showCustomToast(movieTitle, "could not be removed from your rating", "warning", "MOVIE'S RATING");
        }
    };

    const handleSaveMovieToList = async () => {
        try {
            const listID = selectedList.current;
            const success = await movieDataOperations.addMovieToList(listID as number, id);

            if (success) {
                showCustomToast(movieTitle, "added to your list", "success", "MOVIE TO LIST");
            } else {
                showCustomToast(movieTitle, "could not be added to your list", "warning", "MOVIE TO LIST");
            }
        } catch (error) {
            console.error('Error saving movie to list:', error);
            showCustomToast(movieTitle, "could not be added to your list", "warning", "MOVIE TO LIST");
        }
    };

    const handleRemoveMovieFromList = async () => {
        try {
            const listID = selectedList.current;
            const success = await movieDataOperations.removeMovieFromList(listID as number, id);

            if (success) {
                showCustomToast(movieTitle, "removed from your list", "destructive", "MOVIE FROM LIST");
            } else {
                showCustomToast(movieTitle, "could not be removed from your list", "warning", "MOVIE FROM LIST");
            }
        } catch (error) {
            console.error('Error removing movie from list:', error);
            showCustomToast(movieTitle, "could not be removed from your list", "warning", "MOVIE FROM LIST");
        }
    };

    return (
        <div className="movie-card relative group">
            <Link to={`/movie/${id}`} className="movie-link block overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="movie-image-container aspect-[2/3]  overflow-hidden">
                    <img
                        src={posterUrl}
                        className="movie-img object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                        title={movieTitle}
                        alt={movieTitle}
                    />
                </div>
                <div className="movie-data-container p-3 bg-gray-900/90 backdrop-blur-sm">
                    <div className="movie-title text-sm font-bold text-white truncate mb-1" title={movieTitle}>
                        {movieTitle}
                    </div>
                    <div className="movie-details  flex items-center gap-1 text-[10px] text-gray-400">
                        <span className="star-icon"><BsStarFill size={12} className="text-yellow-400" /></span>
                        <strong className="score text-white font-medium">{scoreFormat(score)}</strong>
                        <span>•</span>
                        <span className="language uppercase">{originalLang}</span>
                        <span>•</span>
                        <span className="year">{releaseDate}</span>
                    </div>
                </div>
            </Link>

            <ComboboxDropdownMenu
                movieID={id}
                isFavorite={isFavorite}
                isWatchlist={isWatchlist}
                rating={rating || 0}
                currentRating={currentRating}
                movieLists={movieDataOperations.getLists()}
                selectedList={selectedList}
                handleSaveFavorite={handleSaveFavorite}
                handleSaveWatchlist={handleSaveWatchlist}
                handleSaveRating={handleSaveRating}
                handleDelRating={handleDelRating}
                handleSaveMovieToList={handleSaveMovieToList}
                handleRemoveMovieFromList={handleRemoveMovieFromList}
                moviesInList={movieDataOperations.getMoviesInLists()}
            />
        </div >
    );
};

export default MovieCard;
