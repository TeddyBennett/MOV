import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from 'react';

const Modal: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-gray-800 text-white">
        <DropdownMenuItem className="hover:bg-gray-700">Save to List</DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-700">Favorite</DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-700">Watchlist</DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-700">Your Rating</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Modal;
