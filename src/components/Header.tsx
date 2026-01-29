import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import heroImg from '../assets/hero-img.png';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../data/AuthContext';
import React, { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import { LogOut, Menu, X, CircleChevronDown, PlusCircle } from 'lucide-react';
import { useDataContext } from '../data/DataContext';
import CreateListModal from './CreateListModal';

interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm }) => {
    const { user, isAuthenticated, loading, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { movieDataOperations } = useDataContext();
    const location = useLocation();

    const titleQuote = `find movies you'll love without the hassle`;
    const isHomePage = location.pathname === '/';
    const isFavoritesPage = location.pathname === "/favorites";
    const isWatchlistPage = location.pathname === "/watchlist";
    const isRatedMoviesPage = location.pathname === "/rated-movies";
    const isTrendingDayPage = location.pathname === "/trending-day";
    const isTrendingWeekPage = location.pathname === "/trending-week";
    const isListPage = location.pathname.startsWith("/list/");
    const activeListID = isListPage ? location.pathname.split("/list/")[1]?.split("/")[0] : null;
    const movieLists = movieDataOperations.getLists();

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setOpenMobileSubmenu(null);
    }, [location]);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const capitalizeWords = (str: string) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const handleMobileSubmenu = (menu: string) => {
        setOpenMobileSubmenu(prev => (prev === menu ? null : menu));
    };

    const renderNavLinks = (isMobile: boolean) => {
        const linkClass = isMobile ? "px-4 py-3 text-left w-full block text-gray-300 hover:text-white hover:bg-white/10" : "text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-wider px-3 py-2";
        const activeClass = "text-white font-bold";

        return (
            <>
                <li className={isMobile ? "" : ""}>
                    <Link to="/" className={`${linkClass} ${isHomePage ? activeClass : ""}`}>MOVIES</Link>
                </li>
                <li className={isMobile ? "" : ""}>
                    <Link to="/favorites" className={`${linkClass} ${isFavoritesPage ? activeClass : ""}`}>FAVORITES</Link>
                </li>
                <li className={isMobile ? "" : ""}>
                    <Link to="/watchlist" className={`${linkClass} ${isWatchlistPage ? activeClass : ""}`}>WATCHLIST</Link>
                </li>

                {/* TRENDING Dropdown */}
                <li
                    className={`relative ${isMobile ? "" : "group"}`}
                    onMouseEnter={!isMobile ? () => setActiveDropdown("TRENDING") : undefined}
                    onMouseLeave={!isMobile ? () => setActiveDropdown(null) : undefined}
                >
                    <div
                        className={`${linkClass} cursor-pointer flex items-center justify-between gap-1`}
                        onClick={isMobile ? () => handleMobileSubmenu("TRENDING") : undefined}
                    >
                        <span>TRENDING</span>
                        <CircleChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMobile ? (openMobileSubmenu === 'TRENDING' ? 'rotate-180' : '') : (activeDropdown === "TRENDING" ? "rotate-180" : "")}`} />
                    </div>
                    {((!isMobile && activeDropdown === "TRENDING") || (isMobile && openMobileSubmenu === "TRENDING")) && (
                        <div className={isMobile ? "pl-4 bg-black/20" : "absolute top-full left-0 mt-1 w-56 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden animate-fadeInDown"}>
                            <ul className="py-1">
                                <li>
                                    <Link to="/trending-day" className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                                        TRENDING TODAY
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/trending-week" className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                                        TRENDING THIS WEEK
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </li>

                {/* LIST Dropdown */}
                <li
                    className={`relative ${isMobile ? "" : "group"}`}
                    onMouseEnter={!isMobile ? () => setActiveDropdown("LIST") : undefined}
                    onMouseLeave={!isMobile ? () => setActiveDropdown(null) : undefined}
                >
                    <div
                        className={`${linkClass} cursor-pointer flex items-center justify-between gap-1`}
                        onClick={isMobile ? () => handleMobileSubmenu("LIST") : undefined}
                    >
                        <span>MY LISTS</span>
                        <CircleChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMobile ? (openMobileSubmenu === 'LIST' ? 'rotate-180' : '') : (activeDropdown === "LIST" ? "rotate-180" : "")}`} />
                    </div>
                    {((!isMobile && activeDropdown === "LIST") || (isMobile && openMobileSubmenu === "LIST")) && (
                        <div className={isMobile ? "pl-4 bg-black/20" : "absolute top-full right-0 mt-1 w-64 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden animate-fadeInDown"}>
                            <ul className="py-1">
                                <li
                                    className="px-4 py-3 text-sm text-indigo-400 hover:bg-white/10 hover:text-indigo-300 cursor-pointer flex items-center gap-2 border-b border-white/10 transition-colors"
                                    onClick={() => {
                                        setIsCreateModalOpen(true);
                                        setActiveDropdown(null);
                                        if (isMobile) setIsMobileMenuOpen(false);
                                    }}
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    <span className="font-bold">CREATE NEW LIST</span>
                                </li>
                                {movieLists && movieLists.size > 0 ? (
                                    Array.from(movieLists.entries()).map(([id, list]) => (
                                        <li key={id}>
                                            <Link to={`/list/${id}`} className={`block px-4 py-3 text-sm hover:bg-white/10 hover:text-white transition-colors ${activeListID === String(id) ? "text-white bg-white/5" : "text-gray-300"}`}>
                                                {list.name}
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-3 text-sm text-gray-500 italic">No lists created yet</li>
                                )}
                            </ul>
                        </div>
                    )}
                </li>
            </>
        );
    };

    return (
        <header className='relative min-h-[500px] flex flex-col overflow-hidden mb-4 max-w-[1248px] mx-auto rounded-xl shadow-2xl'>
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img src={heroImg} className='w-full h-full object-cover brightness-[0.4]' alt="Hero background" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f10] via-transparent to-black/60" />
            </div>

            {/* Top Navigation Bar */}
            <nav className="relative z-50 flex justify-between items-center px-6 py-4 md:px-10 md:py-6">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 md:w-6 md:h-6 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                        </svg>
                    </div>
                    <span className="text-xl md:text-2xl font-bold tracking-wider text-white font-['Montserrat']">
                        CINE<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">VERSE</span>
                    </span>
                </div>

                {/* Desktop Nav Links */}
                <ul className="hidden md:flex items-center gap-1 lg:gap-4">
                    {renderNavLinks(false)}
                </ul>

                {/* Right Side: Auth & Mobile Menu Toggle */}
                <div className="flex items-center gap-4">
                    {loading ? (
                        <div className="animate-pulse bg-white/10 h-8 w-8 rounded-full"></div>
                    ) : isAuthenticated && user ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2 bg-white/5 backdrop-blur-md py-1 pr-4 pl-1 rounded-full border border-white/10 hover:bg-white/10 transition-colors cursor-default group">
                                <img
                                    src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                    alt={user.name}
                                    className="w-7 h-7 rounded-full border border-white/20 group-hover:border-indigo-400 transition-colors"
                                />
                                <span className="text-white text-xs font-medium tracking-wide">{user.name.split(' ')[0]}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-white/10 hover:border-red-500/50 transition-all active:scale-95"
                                title="Sign Out"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                setAuthMode('signin');
                                setIsAuthModalOpen(true);
                            }}
                            className="hidden md:block bg-white text-black px-5 py-2 rounded-full text-xs font-bold tracking-wide hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                        >
                            SIGN IN
                        </button>
                    )}

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-[70px] left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 z-40 animate-slideInRight">
                    <ul className="flex flex-col py-4">
                        {renderNavLinks(true)}
                        {!isAuthenticated && (
                            <li className="px-4 py-4 mt-2 border-t border-white/10">
                                <button
                                    onClick={() => {
                                        setAuthMode('signin');
                                        setIsAuthModalOpen(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg text-sm font-bold tracking-wide hover:bg-indigo-700 transition-colors"
                                >
                                    SIGN IN / REGISTER
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            )}

            {/* Hero Content (Search & Title) */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pb-12 mt-[-60px]">
                <h1 className='text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl'>
                    {capitalizeWords(titleQuote)}
                </h1>

                {isHomePage && (
                    <div className="w-full max-w-xl group">
                        <div className="relative flex items-center transition-all duration-300 group-focus-within:scale-105 group-focus-within:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]">
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                className='absolute left-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors z-10'
                            />
                            <input
                                type="text"
                                placeholder="Search movies, series, people..."
                                className="w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-gray-400 focus:outline-none focus:bg-white/15 focus:border-indigo-500/50 transition-all shadow-2xl"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />

            <CreateListModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </header>
    );
};

export default Header;
