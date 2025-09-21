"use client";
import { motion } from "framer-motion";
import { Home, Building, Zap, ArrowRight, CheckCircle, Star, Shield, MapPin, LogOut, Bell, ChevronDown, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function IntroPage() {
    const [user, setUser] = useState(null);
    const navigate = useRouter();

    // useEffect(() => {
    //     const userDataString = localStorage.getItem('user') || sessionStorage.getItem('user');
    //     if (userDataString) {
    //         setUser(JSON.parse(userDataString));
    //     } else {
    //         navigate.push('/login');
    //     }
    // }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        navigate.push('/home');
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <motion.h1
                            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            PGPlug
                        </motion.h1>

                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors font-medium">
                                <Home className="w-5 h-5" />
                                <span>Hostels</span>
                            </a>
                            <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                <Building className="w-5 h-5" />
                                <span>PG</span>
                            </a>
                            <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                <Zap className="w-5 h-5" />
                                <span>Experiences</span>
                            </a>
                        </nav>

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
                                <a href="/signup" className="flex items-center justify-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-600/50 rounded-xl transition-colors">
                                    <LogOut className="w-5 h-5" />
                                    <span>Login / Register</span>
                                </a>
                            )}
                        </div>

                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.h1
                            className="text-5xl md:text-7xl font-bold font-heading bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-6"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            Connecting you to comfortable Stays
                        </motion.h1>

                        <motion.p
                            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                        >
                            Discover premium hostels and PGs at unbeatable prices with verified properties and instant booking
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.6 }}
                        >
                            <motion.a
                                href="/home"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span>Get Started</span>
                                <ArrowRight className="w-5 h-5" />
                            </motion.a>

                            {/* <motion.a
                                href="/signup"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-full font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span>Sign Up</span>
                            </motion.a> */}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose PGPlug?</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            We provide the best experience for finding and booking your perfect accommodation
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Shield className="w-12 h-12 text-blue-600" />,
                                title: "Verified Properties",
                                description: "All our hostels and PGs are personally verified for quality and safety standards.",
                                features: ["Background checked", "Safety verified", "Quality assured"]
                            },
                            {
                                icon: <Star className="w-12 h-12 text-green-600" />,
                                title: "Best Prices",
                                description: "Get the most competitive rates with our price match guarantee and exclusive deals.",
                                features: ["Price match guarantee", "Exclusive deals", "No hidden fees"]
                            },
                            {
                                icon: <Zap className="w-12 h-12 text-purple-600" />,
                                title: "Instant Booking",
                                description: "Book your stay instantly with our streamlined process and immediate confirmation.",
                                features: ["Instant confirmation", "24/7 support", "Easy cancellation"]
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                            >
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                                <ul className="space-y-2">
                                    {feature.features.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-center justify-center gap-2 text-sm text-gray-700">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: "10,000+", label: "Happy Students" },
                            { number: "500+", label: "Verified Properties" },
                            { number: "50+", label: "Cities Covered" },
                            { number: "24/7", label: "Customer Support" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                                <div className="text-blue-100">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Find Your Perfect Stay?</h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Join thousands of students who have found their ideal accommodation through PGPlug
                        </p>
                        <motion.a
                            href="/"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>Start Searching Now</span>
                            <ArrowRight className="w-5 h-5" />
                        </motion.a>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                                PGPlug
                            </h3>
                            <p className="text-gray-400">
                                Your gateway to comfortable and affordable student accommodation.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                                <li><a href="/signup" className="hover:text-white transition-colors">Sign Up</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-white transition-colors">Help Centre</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Connect</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                        <p>&copy; 2025 PGPlug. All rights reserved.</p>
                    </div>
                </div>
            </footer>


        </div>
    );
}
