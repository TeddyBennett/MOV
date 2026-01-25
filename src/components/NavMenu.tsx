import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CircleChevronDown, PlusCircle } from "lucide-react";
import { useDataContext } from "../data/DataContext";
import CreateListModal from "./CreateListModal";

const NavMenu: React.FC = () => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { movieDataOperations } = useDataContext();
    const location = useLocation();

    const isHomePage = location.pathname === "/";
    const isFavoritesPage = location.pathname === "/favorites";
    const isWatchlistPage = location.pathname === "/watchlist";
    const isRatedMoviesPage = location.pathname === "/rated-movies";
    const isTrendingDayPage = location.pathname === "/trending-day";
    const isTrendingWeekPage = location.pathname === "/trending-week";
    const isListPage = location.pathname.startsWith("/list/");

    const activeListID = isListPage
        ? location.pathname.split("/list/")[1]?.split("/")[0]
        : null;

    const movieLists = movieDataOperations.getLists();

    return (
        <div className="w-full bg-blue-600 text-white mt-3 rounded-[5px]">
            <nav className="max-w-6xl">
                <ul className="flex flex-wrap items-center">
                    <li className={`relative ${isHomePage ? "bg-gray-800 rounded-l-[5px]" : ""}`}>
                        <Link
                            to="/"
                            className="flex items-center gap-1 px-4 py-3 hover:bg-gray-800 rounded-l-[5px]"
                        >
                            HOME
                        </Link>
                    </li>
                    <li className={`relative ${isFavoritesPage ? "bg-gray-800" : ""}`}>
                        <Link
                            to="/favorites"
                            className="flex items-center gap-1 px-4 py-3 hover:bg-gray-800"
                        >
                            FAVORITE MOVIE
                        </Link>
                    </li>
                    <li className={`relative ${isWatchlistPage ? "bg-gray-800" : ""}`}>
                        <Link
                            to="/watchlist"
                            className="flex items-center gap-1 px-4 py-3 hover:bg-gray-800"
                        >
                            WATCHLIST
                        </Link>
                    </li>
                    <li className={`relative ${isRatedMoviesPage ? "bg-gray-800" : ""}`}>
                        <Link
                            to="/rated-movies"
                            className="flex items-center gap-1 px-4 py-3 hover:bg-gray-800"
                        >
                            RATE MOVIE
                        </Link>
                    </li>
                    <li
                        className={`relative ${isTrendingDayPage || isTrendingWeekPage ? "bg-gray-800" : ""}`}
                        onMouseEnter={() => setActiveDropdown("TRENDING")}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <div
                            className={`flex items-center gap-1 px-4 py-3 cursor-pointer hover:bg-gray-800 ${activeDropdown === "TRENDING" ? "bg-gray-800" : ""
                                }`}
                        >
                            TRENDING{" "}
                            <CircleChevronDown
                                className={`w-4 h-4 transition-transform duration-300 text-purple-900 ${activeDropdown === "TRENDING" ? "rotate-180" : ""
                                    }`}
                            />
                        </div>

                        {activeDropdown === "TRENDING" && (
                            <div className="absolute left-0 top-full min-w-48 bg-gray-800 shadow-lg z-50">
                                <ul className="py-1">
                                    <li
                                        className={`px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm flex items-center justify-between ${isTrendingDayPage ? "bg-gray-700" : ""
                                            }`}
                                    >
                                        <Link to="/trending-day" className="w-full">
                                            TRENDING OF THE DAY
                                        </Link>
                                    </li>
                                    <li
                                        className={`px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm flex items-center justify-between ${isTrendingWeekPage ? "bg-gray-700" : ""
                                            }`}
                                    >
                                        <Link to="/trending-week" className="w-full">
                                            TRENDING OF THE WEEK
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </li>
                    <li
                        className={`relative ${activeDropdown === "LIST" || isListPage ? "bg-gray-800" : ""}`}
                        onMouseEnter={() => setActiveDropdown("LIST")}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <div
                            className={`flex items-center gap-1 px-4 py-3 cursor-pointer hover:bg-gray-800 ${activeDropdown === "LIST" ? "bg-gray-800" : ""
                                }`}
                        >
                            LIST{" "}
                            <CircleChevronDown
                                className={`w-4 h-4 transition-transform duration-300 text-purple-900 ${activeDropdown === "LIST" ? "rotate-180" : ""
                                    }`}
                            />
                        </div>

                        {activeDropdown === "LIST" && (
                            <div className="absolute left-0 top-full min-w-56 bg-gray-800 shadow-lg z-50">
                                <ul className="py-1">
                                    <li
                                        className="px-4 py-3 hover:bg-indigo-600 cursor-pointer text-sm flex items-center gap-2 border-b border-gray-700 group transition-colors"
                                        onClick={() => {
                                            setIsCreateModalOpen(true);
                                            setActiveDropdown(null);
                                        }}
                                    >
                                        <PlusCircle className="w-4 h-4 text-indigo-400 group-hover:text-white" />
                                        <span className="font-bold">CREATE NEW LIST</span>
                                    </li>
                                    {movieLists && movieLists.size > 0 ? (
                                        Array.from(movieLists.entries()).map(([id, list]) => (
                                            <li
                                                key={id}
                                                className={`px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm flex items-center justify-between ${activeListID === String(id) ? "bg-gray-700" : ""
                                                    }`}
                                            >
                                                <Link to={`/list/${id}`} className="w-full">
                                                    {list.name}
                                                </Link>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-4 py-2 text-sm text-gray-500 italic">No lists created yet</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </li>
                </ul>
            </nav>

            <CreateListModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
};

export default NavMenu;
