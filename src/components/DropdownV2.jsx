import Rating from '@mui/material/Rating';
import React from 'react';
import { useEffect } from 'react';
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { BsPlusCircleFill, BsStarFill, BsFillHeartFill, BsThreeDotsVertical, BsThreeDots, BsListStars, BsBookmarkFill, BsFillStarFill, BsDashCircleFill } from "react-icons/bs";

export function ComboboxDropdownMenu(props) {


    const [label, setLabel] = React.useState("feature");
    const [open, setOpen] = React.useState(false);
    const [showRating, setShowRating] = React.useState(false); // 👈 Add this
    const lists = [...props.movieLists.entries()];

    useEffect(() => {
        // console.log("moviesInList", props.moviesInList);
    }
        , [props.moviesInList]);


    return (
        // Inside your ComboboxDropdownMenu
        // <DropdownMenu open={open} onOpenChange={isOpen => {
        //     setOpen(isOpen);
        //     if (isOpen) {
        //         // ✅ Call your function here
        //     }
        // }}>
        //     <DropdownMenuTrigger asChild>
        //         {/* Add a dynamic z-index to the trigger or parent if needed */}
        //         <button className={`absolute top-5 right-4`}>
        //             <BsThreeDotsVertical size='24' color='white' />
        //         </button>
        //     </DropdownMenuTrigger>

        //     <DropdownMenuContent
        //         side="bottom"
        //         align="end"
        //         sideOffset={15}   // Pushes it 15px higher than the dots
        //         alignOffset={-10} // Shifts it 10px to the left
        //         className="w-[250px]">
        //         <DropdownMenuGroup>
        //             <DropdownMenuSub>
        //                 <DropdownMenuSubTrigger><BsListStars size={35} />Add to list</DropdownMenuSubTrigger>
        //                 <DropdownMenuSubContent className="p-0">
        //                     <Command>
        //                         <CommandInput
        //                             placeholder="Filter List"
        //                             autoFocus={true}
        //                             className="h-9"
        //                         />
        //                         <CommandList>
        //                             <CommandEmpty>No label found.</CommandEmpty>
        //                             <CommandGroup>
        //                                 {Array.from(props.movieLists.entries()).map(([listID, list]) => {
        //                                     const isMovieInList = props.moviesInList.has(listID) && props.moviesInList.get(listID).has(props.movieID);

        //                                     return (
        //                                         <CommandItem
        //                                             key={listID}
        //                                             value={listID}
        //                                             onSelect={() => {
        //                                                 props.selectedList.current = listID;
        //                                                 if (isMovieInList) {
        //                                                     props.handleRemoveMovieFromList(); // Call the remove function
        //                                                 } else {
        //                                                     props.handleSaveMovieToList(); // Call the add function
        //                                                 }
        //                                                 // setLabel(value)
        //                                                 // setOpen(false)
        //                                             }}
        //                                         >
        //                                             <span className="font-bold">{list.name}</span>
        //                                             <span className="text-small">
        //                                                 {list.description ? `(${list.description})` : ""}
        //                                             </span>
        //                                             <span className="text-small">{list.item_count} Items</span>
        //                                             {isMovieInList ? (
        //                                                 <BsDashCircleFill className="text-red-500 ml-auto" title="Remove from list" />
        //                                             ) : (
        //                                                 <BsPlusCircleFill className="text-green-500 ml-auto" title="Add to list" />
        //                                             )}
        //                                         </CommandItem>
        //                                     );

        //                                 })}
        //                             </CommandGroup>
        //                         </CommandList>
        //                     </Command>
        //                 </DropdownMenuSubContent>
        //             </DropdownMenuSub>
        //             <DropdownMenuSeparator />
        //             <DropdownMenuItem onClick={props.handleSaveFavorite}>
        //                 <BsFillHeartFill color={props.isFavorite ? 'pink' : 'black'} /> Favorite
        //             </DropdownMenuItem>

        //             <DropdownMenuSeparator />
        //             <DropdownMenuItem onClick={props.handleSaveWatchlist}>
        //                 <BsBookmarkFill color={props.isWatchlist ? 'orangered' : 'black'} /> Watchlist
        //             </DropdownMenuItem>

        //         </DropdownMenuGroup>
        //     </DropdownMenuContent>
        // </DropdownMenu>


        <DropdownMenu className='' open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (isOpen) {
                // ✅ Call your function here
            }
        }}>
            <DropdownMenuTrigger asChild>
                <button className="flex absolute top-5 right-4 items-center justify-center bg-transparent border-none p-0 m-0">
                    <BsThreeDotsVertical className='favorite-movies cursor-pointer' size='28' color='black' />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                // side="top"
                // align="end"
                // sideOffset={15}   // Pushes it 15px higher than the dots
                // alignOffset={-10} // Shifts it 10px to the left
                // className="w-[250px]"
                side="bottom"
                align="end"
                sideOffset={15}   // Pushes it 15px higher than the dots
                alignOffset={-10} // Shifts it 10px to the left
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
                                        {Array.from(props.movieLists.entries()).map(([listID, list]) => {
                                            const isMovieInList = props.moviesInList.has(listID) && props.moviesInList.get(listID).has(props.movieID);

                                            return (
                                                <CommandItem
                                                    key={listID}
                                                    value={listID}
                                                    onSelect={() => {
                                                        props.selectedList.current = listID;
                                                        if (isMovieInList) {
                                                            props.handleRemoveMovieFromList(); // Call the remove function
                                                        } else {
                                                            props.handleSaveMovieToList(); // Call the add function
                                                        }
                                                        // setLabel(value)
                                                        // setOpen(false)
                                                    }}
                                                >
                                                    <span className="font-bold">{list.name}</span>
                                                    <span className="text-small">
                                                        {list.description ? `(${list.description})` : ""}
                                                    </span>
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
                    <DropdownMenuItem onClick={props.handleSaveFavorite}>
                        <BsFillHeartFill color={props.isFavorite ? 'pink' : 'black'} /> Favorite
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={props.handleSaveWatchlist}>
                        <BsBookmarkFill color={props.isWatchlist ? 'orangered' : 'black'} /> Watchlist
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();              // Prevent dropdown from closing
                            setShowRating(prev => !prev);   // Toggle rating visibility
                        }}
                    >
                        <BsFillStarFill className="text-[20px]" color={props.rating ? 'gold' : 'black'} />
                        <span className="ml-2">Rate</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/* 👇 Show Rating when clicked */}
                    {showRating && (
                        <div className="px-4 py-2">
                            <BsDashCircleFill className='inline-flex mb-4 mr-2 text-red-800' color='red-900'
                                onClick={props.handleDelRating}
                            />

                            <Rating
                                name="dropdown-rating"
                                value={props.rating / 2}
                                precision={0.5}
                                onChange={(e, newValue) => {
                                    if (newValue !== null) {
                                        const actualRating = newValue * 2;
                                        props.currentRating.current = actualRating;
                                        props.handleSaveRating(); // 👈 Call it once here
                                    }
                                }}
                            />
                        </div>
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu >
    );
}


