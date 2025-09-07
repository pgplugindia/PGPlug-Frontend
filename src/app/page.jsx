"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, MapPin, Building, LogOut, User, BookOpen,
    HelpCircle, Star, Heart, Phone,
    ChevronDown, Bell, Settings
} from "lucide-react";
import { cn, formatPrice, getAvatarUrl } from "@/lib/utils";

// Debounce hook
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default function HomePage() {
    const [user, setUser] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [searchParams, setSearchParams] = useState({ location: "" });

    useEffect(() => {
        const userDataString = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (userDataString) {
            setUser(JSON.parse(userDataString));
        }

        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }

        // Check for keyword in URL
        const urlParams = new URLSearchParams(window.location.search);
        const keywordFromUrl = urlParams.get("keyword");
        if (keywordFromUrl) {
            setSearchParams(prev => ({ ...prev, location: keywordFromUrl }));
            performKeywordSearch(keywordFromUrl);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        window.location.href = '/register';
    };

    const toggleFavorite = (pgId) => {
        setFavorites(prev => {
            const newFavorites = prev.includes(pgId)
                ? prev.filter(id => id !== pgId)
                : [...prev, pgId];

            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };


    const handleSearch = (e) => {
        e.preventDefault();
        if (searchParams.location.trim()) {
            window.location.href = `/interface?keyword=${encodeURIComponent(searchParams.location)}`;
        }
    };


    const handleNearbySearch = async () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        setIsLoading(true);
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const { latitude, longitude } = position.coords;
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
            const response = await fetch(`${API_BASE_URL}/pg/search-nearby`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lat: latitude, lon: longitude })
            });

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setSearchResults(data.pgs || []);
            setSearchParams(prev => ({ ...prev, location: 'Nearby Locations' }));
        } catch (error) {
            console.error('Nearby search failed:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
            {/* Header */}
            <header className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <motion.div
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Building className="w-6 h-6 text-white" />
                            </div>
                            <h1
                                onClick={() => window.location.href = '/'}
                                className="text-2xl cursor-pointer font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                PGPlug
                            </h1>
                        </motion.div>

                        {/* Desktop Search */}
                        <div className="hidden lg:flex flex-1 max-w-3xl mx-8">
                            <div className="w-full bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-1">
                                <form onSubmit={handleSearch} className="flex items-center gap-2">
                                    <div className="flex-1 relative">
                                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search for PGs by location..."
                                            value={searchParams.location || ''}
                                            onChange={(e) => setSearchParams({ location: e.target.value })}
                                            className="w-full pl-12 pr-4 py-2 bg-transparent text-white placeholder-slate-400 focus:outline-none text-lg font-medium"
                                        />
                                    </div>

                                    <motion.button
                                        type="submit"
                                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-2 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-70"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={!searchParams.location.trim()}
                                    >
                                        <Search className="w-4 h-4" />
                                        <span>Search</span>
                                    </motion.button>
                                </form>
                            </div>
                        </div>

                        {/* Desktop User Menu */}
                        <div className="hidden lg:flex items-center gap-4">
                            <motion.button
                                onClick={handleNearbySearch}
                                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <MapPin className="w-4 h-4" />
                                <span>Nearby</span>
                            </motion.button>

                            {user ? (
                                <>
                                    <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                                        <Bell className="w-6 h-6" />
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                                    </button>
                                    <div className="relative group">
                                        <div className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-800/50 transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold overflow-hidden ring-2 ring-slate-700">
                                                {user.user?.profile_pic ? (
                                                    <img
                                                        src={user.user.profile_pic}
                                                        alt={user.user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span>{user.user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                                                )}
                                            </div>
                                            <div className="hidden xl:block">
                                                <p className="text-sm font-medium text-white">{user.user?.name || 'User'}</p>
                                                <p className="text-xs text-slate-400">Premium Member</p>
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div className="absolute right-0 mt-3 w-72 bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                            <div className="p-3">
                                                <a href="/details" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-colors">
                                                    <User className="w-5 h-5" />
                                                    <span>My Profile</span>
                                                </a>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors w-full text-left"
                                                >
                                                    <LogOut className="w-5 h-5" />
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <a href="/register" className="flex items-center justify-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-600/50 rounded-xl transition-colors">
                                    <LogOut className="w-5 h-5" />
                                    <span>Login / Register</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </header>


            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading ? (
                    <div className="text-center py-16">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mx-auto mb-6"
                        />
                        <h3 className="text-xl font-semibold text-white mb-2">Finding Perfect Stays</h3>
                        <p className="text-slate-400">Searching through thousands of verified accommodations...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {searchResults.length === 0 ? (
                            <motion.div
                                className="text-center py-16 bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-slate-700/50"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Building className="w-12 h-12 text-indigo-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Discover Your Perfect Stay</h3>
                                <p className="text-slate-400 mb-8 max-w-md mx-auto">Search for PGs in your preferred location or explore nearby options to find the perfect accommodation.</p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    {['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai'].map((city) => (
                                        <motion.button
                                            key={city}
                                            onClick={() => {
                                                window.location.href = `/interface?keyword=${encodeURIComponent(city)}`;
                                            }}
                                            className="px-6 py-3 bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-indigo-500/20 hover:to-purple-500/20 text-slate-300 hover:text-white rounded-xl border border-slate-600/50 hover:border-indigo-500/50 transition-all duration-200"
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <MapPin className="w-4 h-4 inline mr-2" />
                                            {city}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-white mb-2">Search Results</h2>
                                    <p className="text-slate-400">{searchResults.length} properties found in {searchParams.location || 'your area'}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {searchResults.map((pg, index) => (
                                        <motion.div
                                            key={pg.id || index}
                                            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 group rounded-2xl"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            whileHover={{ y: -2 }}
                                        >
                                            <div className="relative overflow-hidden aspect-[4/3]">
                                                {pg.image ? (
                                                    <img
                                                        src={pg.image}
                                                        alt={pg.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                                        <Building className="w-16 h-16 text-slate-500" />
                                                    </div>
                                                )}

                                                {/* Overlay gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                                                {/* Top badges */}
                                                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                                                    <div className="flex gap-2">
                                                        <span className="bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                                                            Verified
                                                        </span>
                                                        {pg.featured && (
                                                            <span className="bg-amber-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                                                                Featured
                                                            </span>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => toggleFavorite(pg.id || index)}
                                                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                                                    >
                                                        <Heart className={cn(
                                                            "w-5 h-5 transition-colors",
                                                            favorites.includes(pg.id || index)
                                                                ? "text-red-400 fill-current"
                                                                : "text-white"
                                                        )} />
                                                    </button>
                                                </div>

                                                {/* Bottom price badge */}
                                                <div className="absolute bottom-4 left-4">
                                                    <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2">
                                                        <span className="text-lg font-bold text-slate-900">₹{pg.price}</span>
                                                        <span className="text-slate-600 text-sm">/month</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6 flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                                                            {pg.name}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-slate-400 mb-3">
                                                            <MapPin className="w-4 h-4" />
                                                            <span className="text-sm">{pg.location}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full">
                                                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                                                        <span className="text-sm font-semibold text-amber-400">{pg.rating || '4.5'}</span>
                                                    </div>
                                                </div>

                                                {/* Amenities */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {(pg.amenities || ['WiFi', 'AC', 'Food', 'Laundry']).slice(0, 4).map((amenity, i) => (
                                                        <span key={i} className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded-lg text-xs">
                                                            {amenity}
                                                        </span>
                                                    ))}
                                                    {(pg.amenities || []).length > 4 && (
                                                        <span className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded-lg text-xs">
                                                            +{(pg.amenities || []).length - 4} more
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Action buttons */}
                                                <div className="flex gap-3">
                                                    <motion.button
                                                        onClick={() => window.location.href = `/details?id=${pg.id || index}`}
                                                        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-200"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        View Details
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => window.open(`tel:${pg.phone || '+91-9876543210'}`, '_self')}
                                                        className="px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-xl transition-colors"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <Phone className="w-5 h-5" />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
