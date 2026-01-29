import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CircleChevronDown, PlusCircle, Menu, X } from "lucide-react";
import { useDataContext } from "../data/DataContext";
import CreateListModal from "./CreateListModal";

const NavMenu: React.FC = () => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);

    const { movieDataOperations } = useDataContext();
    const location = useLocation();

    useEffect(() => {
        // Close mobile menu on route change
        setIsMobileMenuOpen(false);
        setOpenMobileSubmenu(null);
    }, [location]);

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

    const handleMobileSubmenu = (menu: string) => {
        setOpenMobileSubmenu(prev => (prev === menu ? null : menu));
    };

    const renderNavLinks = (isMobile: boolean) => {
        const linkClass = isMobile ? "px-4 py-3 text-left w-full" : "flex items-center gap-1 px-4 py-3";
        const hoverClass = isMobile ? "hover:bg-blue-700" : "hover:bg-gray-800";

        return (
            <>
                <li className={`relative ${isMobile ? '' : (isHomePage ? "bg-gray-800 rounded-l-[5px]" : "")}`}>
                    <Link to="/" className={`${linkClass} ${hoverClass} ${isMobile ? '' : 'rounded-l-[5px]'}`}>HOME</Link>
                </li>
                <li className={`relative ${isMobile ? '' : (isFavoritesPage ? "bg-gray-800" : "")}`}>
                    <Link to="/favorites" className={`${linkClass} ${hoverClass}`}>FAVORITE MOVIE</Link>
                </li>
                <li className={`relative ${isMobile ? '' : (isWatchlistPage ? "bg-gray-800" : "")}`}>
                    <Link to="/watchlist" className={`${linkClass} ${hoverClass}`}>WATCHLIST</Link>
                </li>
                <li className={`relative ${isMobile ? '' : (isRatedMoviesPage ? "bg-gray-800" : "")}`}>
                    <Link to="/rated-movies" className={`${linkClass} ${hoverClass}`}>RATE MOVIE</Link>
                </li>
                {/* TRENDING Dropdown */}
                <li
                    className={`relative ${isMobile ? '' : ((isTrendingDayPage || isTrendingWeekPage) ? "bg-gray-800" : "")}`}
                    onMouseEnter={!isMobile ? () => setActiveDropdown("TRENDING") : undefined}
                    onMouseLeave={!isMobile ? () => setActiveDropdown(null) : undefined}
                >
                    <div
                        className={`${linkClass} ${hoverClass} cursor-pointer flex justify-between items-center`}
                        onClick={isMobile ? () => handleMobileSubmenu("TRENDING") : undefined}
                    >
                        <span>TRENDING</span>
                        <CircleChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMobile ? (openMobileSubmenu === 'TRENDING' ? 'rotate-180' : '') : (activeDropdown === "TRENDING" ? "rotate-180" : "")}`} />
                    </div>
                    {((!isMobile && activeDropdown === "TRENDING") || (isMobile && openMobileSubmenu === "TRENDING")) && (
                        <div className={isMobile ? "pl-4" : "absolute left-0 top-full min-w-48 bg-gray-800 shadow-lg z-50"}>
                            <ul className="py-1">
                                <li className={`hover:bg-gray-700 text-sm ${isTrendingDayPage ? "bg-gray-700" : ""}`}>
                                    <Link to="/trending-day" className="block w-full px-4 py-2">TRENDING OF THE DAY</Link>
                                </li>
                                <li className={`hover:bg-gray-700 text-sm ${isTrendingWeekPage ? "bg-gray-700" : ""}`}>
                                    <Link to="/trending-week" className="block w-full px-4 py-2">TRENDING OF THE WEEK</Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </li>
                {/* LIST Dropdown */}
                <li
                    className={`relative ${isMobile ? '' : ((activeDropdown === "LIST" || isListPage) ? "bg-gray-800" : "")}`}
                    onMouseEnter={!isMobile ? () => setActiveDropdown("LIST") : undefined}
                    onMouseLeave={!isMobile ? () => setActiveDropdown(null) : undefined}
                >
                    <div
                        className={`${linkClass} ${hoverClass} cursor-pointer flex justify-between items-center`}
                        onClick={isMobile ? () => handleMobileSubmenu("LIST") : undefined}
                    >
                        <span>LIST</span>
                        <CircleChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMobile ? (openMobileSubmenu === 'LIST' ? 'rotate-180' : '') : (activeDropdown === "LIST" ? "rotate-180" : "")}`} />
                    </div>
                    {((!isMobile && activeDropdown === "LIST") || (isMobile && openMobileSubmenu === "LIST")) && (
                        <div className={isMobile ? "pl-4" : "absolute left-0 top-full min-w-56 bg-gray-800 shadow-lg z-50"}>
                            <ul className="py-1">
                                <li
                                    className="px-4 py-3 hover:bg-indigo-600 cursor-pointer text-sm flex items-center gap-2 border-b border-gray-700 group transition-colors"
                                    onClick={() => setIsCreateModalOpen(true)}
                                >
                                    <PlusCircle className="w-4 h-4 text-indigo-400 group-hover:text-white" />
                                    <span className="font-bold">CREATE NEW LIST</span>
                                </li>
                                {movieLists && movieLists.size > 0 ? (
                                    Array.from(movieLists.entries()).map(([id, list]) => (
                                        <li key={id} className={`hover:bg-gray-700 text-sm ${activeListID === String(id) ? "bg-gray-700" : ""}`}>
                                            <Link to={`/list/${id}`} className="block w-full px-4 py-2">{list.name}</Link>
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-2 text-sm text-gray-500 italic">No lists created yet</li>
                                )}
                            </ul>
                        </div>
                    )}
                </li>
            </>
        );
    };

    return (
        <nav className="w-full bg-blue-600 text-white mt-3 rounded-md max-w-[1248px] mx-auto relative z-30">
            <div className="w-full flex justify-between items-center px-4 md:px-0">
                {/* Hamburger Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-3">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Desktop Menu */}
                <ul className="hidden md:flex flex-wrap items-center">
                    {renderNavLinks(false)}
                </ul>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <ul className="flex flex-col">
                        {renderNavLinks(true)}
                    </ul>
                </div>
            )}

            <CreateListModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </nav>
    );
};

export default NavMenu;
