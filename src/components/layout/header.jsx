'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, Menu, X, User, LogIn, LogOut, Home, Heart, UserPlus } from 'lucide-react';
import { cn } from '../../lib/utils';

const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Listings', href: '/listings' },
    { name: 'Favorites', href: '/favorites', icon: Heart, protected: true },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
];

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const pathname = usePathname();
    const router = useRouter();

    // Check if user is logged in
    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        setIsLoggedIn(!!token);
    }, []);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setIsMenuOpen(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push('/login');
    };

    return (
        <header
            className={cn(
                'fixed top-0 w-full z-50 transition-all duration-300',
                isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-background/95',
                isMenuOpen && 'bg-background'
            )}
        >
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center
          ">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                                PGPlug
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => {
                            if (link.protected && !isLoggedIn) return null;
                            const isActive = pathname === link.href;
                            return (
                                <Button
                                    key={link.href}
                                    asChild
                                    variant="ghost"
                                    className={cn(
                                        'text-sm font-medium transition-colors hover:text-primary',
                                        isActive ? 'text-primary' : 'text-foreground/70',
                                        link.icon && 'flex items-center gap-1.5'
                                    )}
                                >
                                    <Link href={link.href}>
                                        {link.icon && <link.icon className="h-4 w-4" />}
                                        {link.name}
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>

                    {/* Search and Auth Buttons - Desktop */}
                    <div className="hidden md:flex items-center space-x-2">
                        <form onSubmit={handleSearch} className="relative">
                            <Input
                                type="text"
                                placeholder="Search PGs..."
                                className="w-64 pr-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button
                                type="submit"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full w-10"
                            >
                                <Search className="h-4 w-4" />
                                <span className="sr-only">Search</span>
                            </Button>
                        </form>

                        {isLoggedIn ? (
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/dashboard">
                                        <User className="h-4 w-4 mr-2" />
                                        Dashboard
                                    </Link>
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/login">
                                        <LogIn className="h-4 w-4 mr-2" />
                                        Login
                                    </Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href="/signup">
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Sign Up
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center
          ">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-foreground"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4 space-y-4">
                        <form onSubmit={handleSearch} className="relative">
                            <Input
                                type="text"
                                placeholder="Search PGs..."
                                className="w-full pr-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button
                                type="submit"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full w-10"
                            >
                                <Search className="h-4 w-4" />
                                <span className="sr-only">Search</span>
                            </Button>
                        </form>

                        <div className="flex flex-col space-y-1">
                            {navLinks.map((link) => {
                                if (link.protected && !isLoggedIn) return null;
                                const isActive = pathname === link.href;
                                return (
                                    <Button
                                        key={link.href}
                                        asChild
                                        variant="ghost"
                                        className={cn(
                                            'w-full justify-start',
                                            isActive ? 'bg-accent' : ''
                                        )}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Link href={link.href}>
                                            {link.icon && <link.icon className="h-4 w-4 mr-2" />}
                                            {link.name}
                                        </Link>
                                    </Button>
                                );
                            })}
                        </div>

                        <div className="pt-2 border-t">
                            {isLoggedIn ? (
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                            <User className="h-4 w-4 mr-2" />
                                            Dashboard
                                        </Link>
                                    </Button>
                                    <Button variant="destructive" className="w-full" onClick={handleLogout}>
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                            <LogIn className="h-4 w-4 mr-2" />
                                            Login
                                        </Link>
                                    </Button>
                                    <Button className="w-full" asChild>
                                        <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Create Account
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
