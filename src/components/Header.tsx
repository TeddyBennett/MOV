import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import heroImg from '../assets/hero-img.png';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../data/AuthContext';
import React, {  useState } from 'react';
import AuthModal from './AuthModal';

import { LogOut } from 'lucide-react';

interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm }) => {
    const { user, isAuthenticated, loading, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
    const titleQuote = `find movies you'll love without the hassle`;
    const location = useLocation();
    const isHomePage = location.pathname === '/';

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

    return (
        <header className='relative min-h-[400px] flex flex-col items-center justify-center overflow-hidden text-center p-4 mb-8 max-w-[1248px] mx-auto animate-fadeInDown'>
            <div className="absolute top-2 right-0 z-50 flex items-center gap-3">
                {loading ? (
                    <div className="animate-pulse bg-gray-700 h-8 w-8 rounded-full"></div>
                ) : isAuthenticated && user ? (
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-1 pr-4 rounded-full border border-white/10 hover:bg-black/60 transition-colors cursor-default group">
                            <img
                                src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                alt={user.name}
                                className="w-8 h-8 rounded-full border border-white/20 group-hover:border-indigo-500 transition-colors"
                            />
                            <span className="text-white text-sm font-medium">{user.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 border border-white/10 hover:border-red-500/50 transition-all active:scale-90"
                            title="Sign Out"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (

                    <button
                        onClick={() => {
                            setAuthMode('signin');
                            setIsAuthModalOpen(true);
                        }}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2 rounded-full text-white text-sm font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all border-none cursor-pointer"
                    >
                        Sign In
                    </button>
                )}
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />

            <div className="absolute inset-0 z-0">
                <img src={heroImg} className='w-full h-full object-cover brightness-50' alt="Hero background" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
            </div>

            <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center text-center">
                <h1 className='text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-8 tracking-tight'>
                    {capitalizeWords(titleQuote)}
                </h1>

                {isHomePage && (
                    <div className="w-full max-w-xl group">
                        <div className="relative flex items-center transition-transform group-focus-within:scale-105 duration-300">
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                className='absolute left-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors'
                            />
                            <input
                                type="text"
                                placeholder="Find your favorite movies..."
                                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl py-5 pl-14 pr-6 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-2xl"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
