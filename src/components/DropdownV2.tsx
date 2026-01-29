import Rating from '@mui/material/Rating';
import React, { useState } from 'react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../components/ui/command"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
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
                <button className="flex absolute top-5 right-4 items-center justify-center bg-transparent border-none p-0 m-0">
                    <BsThreeDotsVertical className='favorite-movies cursor-pointer' size='28' color='black' />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                side="bottom"
                align="end"
                sideOffset={15}
                alignOffset={-10}
                className="w-[250px]"
            >
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger><BsListStars size={35} />Add to list</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="p-0">
                            <Command>
                                <CommandInput
                                    placeholder="Filter List"
                                    autoFocus={true}
                                    className="h-9"
                                />
                                <CommandList>
                                    <CommandEmpty>No label found.</CommandEmpty>
                                    <CommandGroup>
                                        {Array.from(movieLists.entries()).map(([listID, list]) => {
                                            const listMovies = moviesInList.get(listID);
                                            const isMovieInList = listMovies ? listMovies.has(movieID) : false;

                                            return (
                                                <CommandItem
                                                    key={listID}
                                                    value={String(listID)}
                                                    onSelect={() => {
                                                        selectedList.current = listID;
                                                        if (isMovieInList) {
                                                            handleRemoveMovieFromList();
                                                        } else {
                                                            handleSaveMovieToList();
                                                        }
                                                    }}
                                                >
                                                    <span className="font-bold">{list.name}</span>
                                                    <span className="text-small">{list.item_count} Items</span>
                                                    {isMovieInList ? (
                                                        <BsDashCircleFill className="text-red-500 ml-auto" title="Remove from list" />
                                                    ) : (
                                                        <BsPlusCircleFill className="text-green-500 ml-auto" title="Add to list" />
                                                    )}
                                                </CommandItem>
                                            );
                                        })}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSaveFavorite}>
                        <BsFillHeartFill color={isFavorite ? 'pink' : 'black'} /> Favorite
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSaveWatchlist}>
                        <BsBookmarkFill color={isWatchlist ? 'orangered' : 'black'} /> Watchlist
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            setShowRating(prev => !prev);
                        }}
                    >
                        <BsFillStarFill className="text-[20px]" color={rating ? 'gold' : 'black'} />
                        <span className="ml-2">Rate</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    
                    {showRating && (
                        <div className="px-4 py-2">
                            <BsDashCircleFill className='inline-flex mb-4 mr-2 text-red-800' color='red-900'
                                onClick={handleDelRating}
                            />

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
                            />
                        </div>
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu >
    );
};
