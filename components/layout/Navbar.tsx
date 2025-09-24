'use client';

import Link from 'next/link';
import CartIconWithCount from './CartIconWithCount';
import { LuChevronDown, LuLogOut, LuPackage } from 'react-icons/lu';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        router.push('/');
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto px-6 h-16 flex items-center">
                <div className="flex items-center space-x-8">
                    <Link href="/" className="text-xl font-bold tracking-tight text-foreground flex items-center space-x-2 gap-2">
                        <LuPackage className="w-6 h-6" />ShopHub
                    </Link>
                    <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
                            All Products
                        </Link>
                    </div>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    {user ? (
                        <>
                            <CartIconWithCount />
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 text-sm font-medium focus:outline-none"
                                >
                                    Hello, {user.firstName}!
                                    <LuChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-fit origin-top-right rounded-md bg-white shadow-lg ring-1 ring-gray-500 ring-opacity-5 focus:outline-none"
                                        >
                                            <div className="py-1">
                                                <div className="px-4 py-2 border-b">
                                                    <p className="text-sm font-semibold truncate">{user.firstName} {user.lastName}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm cursor-pointer text-red-600 hover:bg-muted"
                                                >
                                                    <LuLogOut className="w-4 h-4" /> Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    ) : (
                        <>
                            <CartIconWithCount />
                            <Link
                                href="/login"
                                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 text-sm font-medium"
                            >
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}