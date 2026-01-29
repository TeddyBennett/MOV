import React, { useState, useEffect } from 'react';
import { useAuth } from '../data/AuthContext';
import { useCustomToast } from '../hooks/useCustomToast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/Button';
import heroImg from '../assets/hero-img.png';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'signin' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
    const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, register } = useAuth();
    const { showCustomToast } = useCustomToast();

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
        }
    }, [isOpen, initialMode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (mode === 'signin') {
                await login(email, password);
                showCustomToast("Welcome Back!", "You have successfully signed in.", "success", "AUTHENTICATION");
            } else {
                await register(email, password, name);
                showCustomToast("Welcome aboard!", "Your account has been created successfully.", "success", "AUTHENTICATION");
            }
            onClose();
        } catch (error: any) {
            const errorMessage = error?.message || (mode === 'signin' ? "Invalid email or password." : "Could not create account.");
            showCustomToast(
                mode === 'signin' ? "Login Failed" : "Registration Failed",
                errorMessage,
                "destructive",
                "AUTHENTICATION"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] p-0 border-none bg-black overflow-hidden rounded-[2rem]">
                {/* Background Overlay */}
                <div className="absolute inset-0 z-0 h-full w-full">
                    <img src={heroImg} className="w-full h-full object-cover opacity-20 blur-[2px]" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
                </div>

                <div className="relative z-10 p-8">
                    <DialogHeader className="mb-8 text-center">
                        <DialogTitle className="text-4xl font-extrabold text-white tracking-tight">
                            {mode === 'signin' ? "Welcome Back" : "Join Us"}
                        </DialogTitle>
                        <DialogDescription className="text-gray-400 text-lg">
                            {mode === 'signin' ? "Sign in to access your library." : "Start your cinematic journey today."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {mode === 'signup' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-600"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-600"
                                placeholder="you@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-600"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all border-none"
                        >
                            {isSubmitting ? "Processing..." : (mode === 'signin' ? "Sign In" : "Create Account")}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-400">
                        {mode === 'signin' ? (
                            <p>
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setMode('signup')}
                                    className="text-indigo-400 font-bold hover:underline bg-transparent border-none p-0"
                                >
                                    Sign Up
                                </button>
                            </p>
                        ) : (
                            <p>
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setMode('signin')}
                                    className="text-indigo-400 font-bold hover:underline bg-transparent border-none p-0"
                                >
                                    Sign In
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
