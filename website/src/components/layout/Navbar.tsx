'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, User, LogOut, Map, Heart, Search, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

import { usePathname } from 'next/navigation';

export function Navbar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300 border-b",
                scrolled
                    ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-slate-200 dark:border-slate-800 shadow-sm py-2"
                    : "bg-transparent border-transparent py-4 text-white"
            )}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Mobile Menu */}
                <div className="flex items-center gap-2 lg:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className={cn(scrolled ? "text-slate-900 dark:text-white" : "text-white")}>
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <div className="flex flex-col gap-6 mt-8">
                                <Link href="/" onClick={() => setIsOpen(false)} className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                                    TrekBuddy
                                </Link>
                                <nav className="flex flex-col gap-4">
                                    <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-cyan-500 transition-colors">Home</Link>
                                    <Link href="/dashboard/categories" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-cyan-500 transition-colors">Explore</Link>
                                    <Link href="/dashboard/planner" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-cyan-500 transition-colors">Trip Planner</Link>
                                    <Link href="/dashboard/chat" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-cyan-500 transition-colors">AI Guide</Link>
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight relative z-20">
                    <motion.span
                        className={cn(
                            "bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500",
                            scrolled ? "from-cyan-600 to-blue-700 dark:from-cyan-400 dark:to-blue-500" : "from-white to-slate-200"
                        )}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        TrekBuddy
                    </motion.span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-1">
                    <NavigationMenu>
                        <NavigationMenuList className={cn("gap-2", scrolled ? "text-slate-700 dark:text-slate-200" : "text-slate-100")}>
                            {[
                                { name: "Home", href: "/" },
                                { name: "Explore", href: "/dashboard/categories" },
                                { name: "Trip Planner", href: "/dashboard/planner" },
                                { name: "AI Guide", href: "/dashboard/chat" },
                            ].map((item) => (
                                <NavigationMenuItem key={item.name}>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                "bg-transparent hover:bg-white/10 dark:hover:bg-white/10 focus:bg-white/10 transition-all font-medium",
                                                scrolled ? "hover:bg-slate-100 dark:hover:bg-slate-800" : "text-white hover:text-white"
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {/* Animated Search Bar */}
                    <AnimatePresence>
                        {searchOpen ? (
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 200, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                className="hidden md:flex items-center relative"
                            >
                                <Input
                                    placeholder="Search..."
                                    className="h-9 w-full rounded-full bg-white/10 dark:bg-slate-800/50 border border-white/20 backdrop-blur-sm pr-8 focus-visible:ring-cyan-500 transition-all text-sm"
                                    autoFocus
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 h-9 w-9 text-muted-foreground hover:text-destructive"
                                    onClick={() => setSearchOpen(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSearchOpen(true)}
                                className={cn("hidden md:flex rounded-full hover:bg-white/10", scrolled ? "text-slate-600 dark:text-slate-300" : "text-white")}
                            >
                                <Search className="h-5 w-5" />
                            </Button>
                        )}
                    </AnimatePresence>

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-cyan-400 transition-all p-0 overflow-hidden">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-medium">
                                            {user.displayName?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profile" className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profile?tab=saved" className="cursor-pointer">
                                        <Heart className="mr-2 h-4 w-4" />
                                        <span>Saved Places</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/planner" className="cursor-pointer">
                                        <Map className="mr-2 h-4 w-4" />
                                        <span>My Trips</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer focus:bg-red-50 focus:text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                asChild
                                className={cn(
                                    "hover:bg-white/10 transition-colors font-medium hidden sm:flex",
                                    scrolled ? "text-slate-700 dark:text-slate-200" : "text-white hover:text-white"
                                )}
                            >
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button asChild className="rounded-full bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 font-semibold px-6">
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </motion.header>
    );
}
