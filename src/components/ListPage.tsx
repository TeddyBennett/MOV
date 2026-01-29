import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDataContext } from '../data/DataContext';
import { Trash2 } from 'lucide-react';
import { useCustomToast } from '../hooks/useCustomToast';
import MovieGrid from './MovieGrid';
import { BackendApiService } from '../services/backendApiService';
import { ApiService } from '../services/apiService';
import { logError } from '../utils/errorHandler';
import { Skeleton } from './ui/skeleton';
import { Movie, List } from '../types';

const ListSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 p-8">
        {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-3">
                <Skeleton className="h-[300px] w-full rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-4 w-[40%]" />
                </div>
            </div>
        ))}
    </div>
);

const ListPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { movieDataOperations, setMovies, isLoading, setIsLoading, setTotalPages } = useDataContext();
    const { showCustomToast } = useCustomToast();
    const [listDetails, setListDetails] = useState<{ id: number | null, name: string; description: string }>({
        id: null,
        name: '',
        description: '',
    });

    useEffect(() => {
        const fetchListData = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const listData: List = await BackendApiService.getListDetails(id);

                setListDetails({
                    id: listData.id,
                    name: listData.name,
                    description: listData.description || `Custom list created on ${new Date(listData.createdAt).toLocaleDateString()}`,
                });

                if (listData.listMovies) {
                    const moviePromises = listData.listMovies.map((lm) =>
                        ApiService.fetchMovieDetails(lm.movieId).catch(() => null)
                    );

                    const results = await Promise.all(moviePromises);
                    const validMovies: Movie[] = results.filter((m): m is Movie => m !== null);
                    setMovies(validMovies);
                } else {
                    setMovies([]);
                }

                setTotalPages(1);
            } catch (error) {
                logError(error, 'fetchListDetails');
            } finally {
                setIsLoading(false);
            }
        };

        fetchListData();
    }, [id, setIsLoading, setMovies, setTotalPages]);

    const handleDeleteList = async () => {
        if (!id) return;
        if (!window.confirm(`Are you sure you want to delete the list "${listDetails.name}"?`)) return;

        try {
            setIsLoading(true);
            // Convert the URL param id to number for the API call
            const listId = parseInt(id);
            const success = await movieDataOperations.deleteList(listId);
            if (success) {
                showCustomToast("List Deleted", `"${listDetails.name}" has been removed.`, "destructive", "CUSTOM LISTS");
                navigate('/');
            }
        } catch (error) {
            logError(error, 'deleteListUI');
            showCustomToast("Error", "Could not delete list. Please try again.", "destructive", "CUSTOM LISTS");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent mt-5">
            <header className="p-8 flex flex-col items-center">
                <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-4xl font-bold text-white">{listDetails.name || 'Loading List...'}</h1>
                    {listDetails.id && (
                        <button
                            onClick={handleDeleteList}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                            title="Delete List"
                        >
                            <Trash2 size={24} />
                        </button>
                    )}
                </div>
                <p className="text-gray-400">{listDetails.description}</p>
            </header>

            {isLoading ? (
                <ListSkeleton />
            ) : (
                <MovieGrid />
            )}
        </div>
    );
};

export default ListPage;
