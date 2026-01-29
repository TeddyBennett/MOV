import Rating from '@mui/material/Rating';
import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { BsPlusCircleFill, BsFillHeartFill, BsThreeDotsVertical, BsListStars, BsBookmarkFill, BsFillStarFill, BsDashCircleFill } from "react-icons/bs";
import { ListInfo } from '../types';

interface ComboboxDropdownMenuProps {
    movieID: number;
    isFavorite: boolean;
    isWatchlist: boolean;
    rating: number;
    currentRating: React.MutableRefObject<number>;
    movieLists: Map<number, ListInfo>;
    selectedList: React.MutableRefObject<number | string>;
    handleSaveFavorite: () => Promise<void>;
    handleSaveWatchlist: () => Promise<void>;
    handleSaveRating: () => Promise<void>;
    handleDelRating: () => Promise<void>;
    handleSaveMovieToList: () => Promise<void>;
    handleRemoveMovieFromList: () => Promise<void>;
    moviesInList: Map<number, Set<number>>;
}

export const ComboboxDropdownMenu: React.FC<ComboboxDropdownMenuProps> = ({
    movieID,
    isFavorite,
    isWatchlist,
    rating,
    currentRating,
    movieLists,
    selectedList,
    handleSaveFavorite,
    handleSaveWatchlist,
    handleSaveRating,
    handleDelRating,
    handleSaveMovieToList,
    handleRemoveMovieFromList,
    moviesInList
}) => {
    const [open, setOpen] = useState(false);
    const [showRating, setShowRating] = useState(false);

    return (
        <DropdownMenu open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
        }}>
            <DropdownMenuTrigger asChild>
                <button className="flex absolute top-4 right-4 items-center justify-center bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 rounded-full w-9 h-9 transition-all duration-300 group/trigger active:scale-90">
                    <BsThreeDotsVertical className='text-white/70 group-hover/trigger:text-white transition-colors' size='20' />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                side="bottom"
                align="end"
                sideOffset={8}
                collisionPadding={10}
                className="w-[240px] bg-[#1a1a2e]/95 backdrop-blur-2xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200"
            >
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center gap-3 py-3 px-4 focus:bg-white/10 data-[state=open]:bg-white/10 cursor-pointer transition-colors">
                            <BsListStars size={18} className="text-indigo-400" />
                            <span className="font-semibold text-gray-200 uppercase tracking-wider text-[11px]">Add to list</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent 
                                className="p-1 min-w-[220px] bg-[#1a1a2e]/98 backdrop-blur-2xl border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-left-2 duration-200"
                                collisionPadding={10}
                            >
                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Select List</span>
                                    </div>
                                    {movieLists && movieLists.size > 0 ? (
                                        Array.from(movieLists.entries()).map(([listID, list]) => {
                                            const listMovies = moviesInList.get(listID);
                                            const isMovieInList = listMovies ? listMovies.has(movieID) : false;

                                            return (
                                                <DropdownMenuItem
                                                    key={listID}
                                                    onSelect={(e) => {
                                                        e.preventDefault();
                                                        selectedList.current = listID;
                                                        if (isMovieInList) {
                                                            handleRemoveMovieFromList();
                                                        } else {
                                                            handleSaveMovieToList();
                                                        }
                                                    }}
                                                    className="flex flex-col items-start gap-0.5 py-2.5 px-3 focus:bg-indigo-600 focus:text-white rounded-md cursor-pointer transition-all group/item"
                                                >
                                                    <div className="flex items-center w-full justify-between">
                                                        <span className="font-bold text-sm text-gray-100 group-focus/item:text-white">{list.name}</span>
                                                        {isMovieInList ? (
                                                            <BsDashCircleFill className="text-red-400 group-focus/item:text-white" size={14} />
                                                        ) : (
                                                            <BsPlusCircleFill className="text-green-400 group-focus/item:text-white" size={14} />
                                                        )}
                                                    </div>
                                                    <span className="text-[9px] text-gray-500 group-focus/item:text-indigo-200 uppercase tracking-tighter font-bold">{list.item_count} Items</span>
                                                </DropdownMenuItem>
                                            );
                                        })
                                    ) : (
                                        <div className="py-6 px-4 text-center">
                                            <p className="text-xs text-gray-500 italic">No lists created yet.</p>
                                        </div>
                                    )}
                                </div>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator className="bg-white/5 mx-1" />
                    
                    <DropdownMenuItem 
                        onClick={handleSaveFavorite}
                        className="flex items-center gap-3 py-3 px-4 focus:bg-white/10 cursor-pointer transition-colors"
                    >
                        <BsFillHeartFill className={isFavorite ? 'text-pink-500' : 'text-gray-400'} size={16} />
                        <span className="font-semibold text-gray-200 uppercase tracking-wider text-[11px]">Favorite</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-white/5 mx-1" />
                    
                    <DropdownMenuItem 
                        onClick={handleSaveWatchlist}
                        className="flex items-center gap-3 py-3 px-4 focus:bg-white/10 cursor-pointer transition-colors"
                    >
                        <BsBookmarkFill className={isWatchlist ? 'text-orange-500' : 'text-gray-400'} size={16} />
                        <span className="font-semibold text-gray-200 uppercase tracking-wider text-[11px]">Watchlist</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-white/5 mx-1" />
                    
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            setShowRating(prev => !prev);
                        }}
                        className="flex items-center gap-3 py-3 px-4 focus:bg-white/10 cursor-pointer transition-colors"
                    >
                        <BsFillStarFill className={rating ? 'text-yellow-400' : 'text-gray-400'} size={16} />
                        <span className="font-semibold text-gray-200 uppercase tracking-wider text-[11px]">Rate Movie</span>
                    </DropdownMenuItem>
                    
                    {showRating && (
                        <div className="px-4 py-4 bg-white/5 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Your Score</span>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelRating();
                                    }}
                                    className="p-1.5 hover:bg-red-500/20 rounded-full transition-colors group/del"
                                >
                                    <BsDashCircleFill className='text-red-500/50 group-hover/del:text-red-500' size={14} />
                                </button>
                            </div>

                            <div className="flex justify-center bg-black/20 p-2 rounded-lg border border-white/5">
                                <Rating
                                    name="dropdown-rating"
                                    value={rating / 2}
                                    precision={0.5}
                                    onChange={(_e, newValue) => {
                                        if (newValue !== null) {
                                            const actualRating = newValue * 2;
                                            currentRating.current = actualRating;
                                            handleSaveRating();
                                        }
                                    }}
                                    sx={{
                                        '& .MuiRating-iconEmpty': { color: 'rgba(255,255,255,0.1)' },
                                        '& .MuiRating-iconFilled': { color: '#fbbf24' },
                                        '& .MuiRating-iconHover': { color: '#f59e0b' },
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu >
    );
};
