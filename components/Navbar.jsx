'use client';
import {
    ShoppingCart,
    Heart,
    User,
    LogOut,
    Package,
    ChevronDown,
    Search,
    X,
    ArrowRight,
    Home,
    Menu,
    Phone,
    Truck,
    Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { getSearchSuggestions } from '@/app/actions/product';
import { logout } from '@/app/actions/auth';
import { assets } from '@/assets/assets';

const Navbar = ({ user, isAdmin }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const cart = useCartStore((state) => state.cart);
    const wishlist = useCartStore((state) => state.wishlist);
    const cartCount = Object.values(cart).reduce((acc, qty) => acc + qty, 0);
    const wishlistCount = wishlist.length;

    const searchRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        setMounted(true);
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSuggestions([]);
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsAccountOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (search.length >= 2) {
                const res = await getSearchSuggestions(search);
                setSuggestions(res.suggestions || []);
            } else {
                setSuggestions([]);
            }
        };

        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handleLogout = async () => {
        await logout();
        setIsAccountOpen(false);
        router.refresh();
    };

    const handleSearch = (e) => {
        e?.preventDefault();
        if (search.trim()) {
            router.push(`/shop?search=${encodeURIComponent(search)}`);
            setIsSearchOpen(false);
            setIsMobileMenuOpen(false);
            setSuggestions([]);
        }
    };

    const navLinks = [
        { name: 'Accueil', href: '/', isHome: true },
        { name: 'Boutique', href: '/shop' },
        { name: 'Sérigraphie', href: '/shop?category=Sérigraphie' },
        { name: 'À Propos', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const categoryLinks = [
        { name: 'Smartphones & Apple', href: '/shop?category=Smartphones' },
        { name: 'Samsung Galaxy', href: '/shop?category=Samsung' },
        { name: 'Tecno, Infinix & Itel', href: '/shop?category=Tecno' },
        { name: 'Ordinateurs & PC', href: '/shop?category=Ordinateurs' },
        { name: 'Audio & Oraimo', href: '/shop?category=Audio' },
        { name: 'Accessoires & GaN', href: '/shop?category=Accessoires' },
    ];

    return (
        <nav className="relative bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE6DF] sticky top-0 z-[150]">
            {/* Mobile Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[#FAF8F5] z-[200] flex flex-col sm:hidden"
                    >
                        <div className="p-4 border-b border-[#EAE6DF] flex items-center gap-3 bg-white">
                            <form
                                onSubmit={handleSearch}
                                className="flex-1 flex items-center gap-3 bg-[#F5F2EB] px-4 py-3 rounded-full border border-[#EAE6DF]"
                            >
                                <Search size={18} className="text-zinc-400" />
                                <input
                                    autoFocus
                                    className="w-full bg-transparent outline-none placeholder-zinc-400 font-medium text-sm text-[#1C1B1F]"
                                    type="text"
                                    placeholder="Rechercher un iPhone, PC, t-shirt..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </form>
                            <button
                                onClick={() => {
                                    setIsSearchOpen(false);
                                    setSearch('');
                                    setSuggestions([]);
                                }}
                                className="text-zinc-500 font-bold text-xs px-2"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            {suggestions.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3 px-2">
                                        Suggestions
                                    </p>
                                    {suggestions.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/product/${item.id}`}
                                            onClick={() => {
                                                setIsSearchOpen(false);
                                                setSearch('');
                                                setSuggestions([]);
                                            }}
                                            className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#EAE6DF] shadow-sm hover:border-[#C59A63] transition-colors"
                                        >
                                            <div className="size-12 bg-[#F5F2EB] rounded-xl flex items-center justify-center p-2">
                                                <Image
                                                    src={
                                                        item.images?.[0] || '/placeholder-image.png'
                                                    }
                                                    alt=""
                                                    width={40}
                                                    height={40}
                                                    className="object-contain"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-[#1C1B1F] truncate">
                                                    {item.name}
                                                </p>
                                                <p className="text-[11px] font-bold text-[#C59A63] mt-0.5">
                                                    {item.price?.toLocaleString('fr-SN')} FCFA
                                                </p>
                                            </div>
                                            <ArrowRight size={14} className="text-zinc-300" />
                                        </Link>
                                    ))}
                                </div>
                            ) : search.length >= 2 ? (
                                <div className="text-center py-20">
                                    <Search size={40} className="mx-auto text-zinc-300 mb-4" />
                                    <p className="text-sm font-medium text-zinc-400">
                                        Aucun résultat pour &quot;{search}&quot;
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-20 opacity-40">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                        Commencez à taper pour rechercher
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[200] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                            className="fixed top-0 bottom-0 left-0 w-[85%] max-w-sm bg-[#FAF8F5] z-[210] lg:hidden flex flex-col shadow-2xl border-r border-[#EAE6DF]"
                        >
                            {/* Drawer Header */}
                            <div className="p-5 border-b border-[#EAE6DF] flex items-center justify-between bg-white">
                                <Link
                                    href="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center"
                                >
                                    <Image
                                        src={assets.julo_logo_transparent}
                                        alt="JULO."
                                        width={105}
                                        height={32}
                                        className="h-7 w-auto object-contain"
                                    />
                                </Link>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    aria-label="Fermer le menu"
                                    className="size-8 rounded-full bg-[#F5F2EB] flex items-center justify-center text-zinc-600 hover:text-zinc-900"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Drawer Links */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#8C8275] px-3 mb-2">
                                    Menu Principal
                                </p>
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                                                isActive
                                                    ? 'bg-[#1C1B1F] text-white shadow-xs'
                                                    : 'text-[#1C1B1F] hover:bg-[#F5F2EB]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {link.isHome && <Home size={15} />}
                                                <span>{link.name}</span>
                                            </div>
                                            <ArrowRight
                                                size={13}
                                                className={
                                                    isActive ? 'text-[#C59A63]' : 'text-zinc-300'
                                                }
                                            />
                                        </Link>
                                    );
                                })}

                                <div className="pt-4 border-t border-[#EAE6DF] mt-4 space-y-1">
                                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#8C8275] px-3 mb-2">
                                        Rayons Populaires
                                    </p>
                                    <div className="grid grid-cols-2 gap-1.5 px-1">
                                        {categoryLinks.map((cat) => (
                                            <Link
                                                key={cat.name}
                                                href={cat.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="p-2.5 rounded-xl bg-white border border-[#EAE6DF] hover:border-[#C59A63] text-[11px] font-bold text-[#1C1B1F] transition-all truncate"
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-[#EAE6DF] mt-4 space-y-1">
                                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#8C8275] px-3 mb-2">
                                        Services &amp; Suivi
                                    </p>
                                    <Link
                                        href="/track"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 p-3 rounded-2xl text-xs font-bold text-zinc-700 hover:bg-[#F5F2EB]"
                                    >
                                        <Truck size={16} className="text-[#C59A63]" />
                                        <span>Suivre ma commande</span>
                                    </Link>
                                    <a
                                        href="https://wa.me/221754469097"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-2xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 transition-colors"
                                    >
                                        <Phone size={16} />
                                        <span>WhatsApp : +221 75 446 90 97</span>
                                    </a>
                                </div>
                            </div>

                            {/* Drawer Footer */}
                            <div className="p-4 border-t border-[#EAE6DF] bg-white text-center">
                                <p className="text-[10px] font-bold text-[#8C8275]">
                                    JULO Dakar &amp; Touba — Livraison 24h
                                </p>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Navbar Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
                    {/* Left: Mobile Hamburger & Brand Logo */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Ouvrir le menu"
                            className="lg:hidden flex items-center justify-center size-9 bg-white text-[#1C1B1F] border border-[#EAE6DF] rounded-full shadow-xs active:scale-95"
                        >
                            <Menu size={18} />
                        </button>
                        <Link
                            href="/"
                            aria-label="JULO - Accueil"
                            className="flex items-center group"
                        >
                            <Image
                                src={assets.julo_logo_transparent}
                                alt="JULO."
                                width={120}
                                height={38}
                                priority
                                className="h-7 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
                            />
                        </Link>
                    </div>

                    {/* Center: Floating Navigation Pill (Exact Screenshot Look) */}
                    <div className="hidden lg:flex items-center bg-white/90 border border-[#EAE6DF] shadow-sm rounded-full p-1.5 gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                                        isActive
                                            ? 'bg-[#1C1B1F] text-white shadow-sm'
                                            : 'text-[#4A4742] hover:text-[#1C1B1F] hover:bg-[#F5F2EB]'
                                    }`}
                                >
                                    {link.isHome && (
                                        <Home size={13} strokeWidth={isActive ? 2.5 : 2} />
                                    )}
                                    <span>{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right: Actions (Search, Wishlist, Cart, Profile) */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Search button / bar */}
                        <div className="relative" ref={searchRef}>
                            <form
                                onSubmit={handleSearch}
                                className="hidden xl:flex items-center w-52 bg-white px-3.5 py-1.5 rounded-full border border-[#EAE6DF] focus-within:border-[#C59A63] transition-all shadow-sm"
                            >
                                <Search size={14} className="text-zinc-400 mr-2" />
                                <input
                                    className="w-full bg-transparent outline-none placeholder-zinc-400 font-medium text-xs text-[#1C1B1F]"
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </form>

                            {/* Suggestions Dropdown */}
                            <AnimatePresence>
                                {suggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full mt-2 right-0 w-80 bg-white rounded-2xl border border-[#EAE6DF] shadow-xl overflow-hidden p-2 z-[999]"
                                    >
                                        {suggestions.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={`/product/${item.id}`}
                                                onClick={() => {
                                                    setSuggestions([]);
                                                    setSearch('');
                                                }}
                                                className="flex items-center gap-3 p-2 hover:bg-[#FAF8F5] rounded-xl transition-colors group"
                                            >
                                                <div className="size-10 bg-[#F5F2EB] rounded-lg flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                                                    <Image
                                                        src={
                                                            item.images?.[0] ||
                                                            '/placeholder-image.png'
                                                        }
                                                        alt=""
                                                        width={32}
                                                        height={32}
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-[#1C1B1F] truncate">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-[#C59A63]">
                                                        {item.price?.toLocaleString('fr-SN')} FCFA
                                                    </p>
                                                </div>
                                                <ArrowRight
                                                    size={12}
                                                    className="text-zinc-300 group-hover:text-[#1C1B1F] group-hover:translate-x-1 transition-all"
                                                />
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Search Button */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Ouvrir la recherche"
                            className="xl:hidden flex items-center justify-center size-9 bg-white text-[#1C1B1F] border border-[#EAE6DF] rounded-full shadow-sm"
                        >
                            <Search size={16} />
                        </button>

                        {/* Cart Button (with gold badge matching screenshot) */}
                        <Link
                            href="/cart"
                            aria-label="Voir mon panier"
                            className="relative flex items-center justify-center size-9 sm:size-10 bg-white text-[#1C1B1F] hover:border-[#C59A63] border border-[#EAE6DF] rounded-full shadow-sm transition-all"
                        >
                            <ShoppingCart size={17} strokeWidth={1.8} />
                            {mounted && (
                                <span className="absolute -top-1 -right-1 text-[9px] font-black text-white bg-[#C59A63] size-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Wishlist Button */}
                        <Link
                            href="/wishlist"
                            aria-label="Voir mes favoris"
                            className="relative flex items-center justify-center size-9 sm:size-10 bg-white text-[#1C1B1F] hover:text-red-500 hover:border-red-200 border border-[#EAE6DF] rounded-full shadow-sm transition-all"
                        >
                            <Heart size={17} strokeWidth={1.8} />
                            {mounted && wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-[9px] font-black text-white bg-red-500 size-4 rounded-full flex items-center justify-center border-2 border-white">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* User Profile / Account */}
                        <div className="relative" ref={dropdownRef}>
                            {user ? (
                                <>
                                    <button
                                        onClick={() => setIsAccountOpen(!isAccountOpen)}
                                        className="flex items-center justify-center size-9 sm:size-10 bg-[#1C1B1F] text-white rounded-full shadow-sm transition-all"
                                        aria-label="Menu utilisateur"
                                    >
                                        <User size={16} />
                                    </button>

                                    <AnimatePresence>
                                        {isAccountOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-[#EAE6DF] overflow-hidden z-[100]"
                                            >
                                                <div className="p-4 bg-[#FAF8F5] border-b border-[#EAE6DF]">
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                                                        Connecté
                                                    </p>
                                                    <p className="text-[#1C1B1F] font-bold text-sm truncate">
                                                        {user.user_metadata?.full_name ||
                                                            user.email}
                                                    </p>
                                                </div>
                                                <div className="p-2 space-y-1">
                                                    {isAdmin && (
                                                        <Link
                                                            href="/admin"
                                                            onClick={() => setIsAccountOpen(false)}
                                                            className="flex items-center gap-3 px-3 py-2 text-[#C59A63] hover:bg-[#FAF8F5] rounded-xl text-xs font-bold transition-all"
                                                        >
                                                            <User size={15} />
                                                            <span>Espace Admin</span>
                                                        </Link>
                                                    )}
                                                    <Link
                                                        href="/profile"
                                                        onClick={() => setIsAccountOpen(false)}
                                                        className="flex items-center gap-3 px-3 py-2 text-zinc-700 hover:bg-[#FAF8F5] rounded-xl text-xs font-semibold transition-all"
                                                    >
                                                        <User size={15} />
                                                        <span>Mon Profil</span>
                                                    </Link>
                                                    <Link
                                                        href="/orders"
                                                        onClick={() => setIsAccountOpen(false)}
                                                        className="flex items-center gap-3 px-3 py-2 text-zinc-700 hover:bg-[#FAF8F5] rounded-xl text-xs font-semibold transition-all"
                                                    >
                                                        <Package size={15} />
                                                        <span>Mes Commandes</span>
                                                    </Link>
                                                    <div className="border-t border-[#EAE6DF] my-1" />
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition-all"
                                                    >
                                                        <LogOut size={15} />
                                                        <span>Déconnexion</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center justify-center size-9 sm:size-10 bg-white text-[#1C1B1F] hover:border-[#C59A63] border border-[#EAE6DF] rounded-full shadow-sm transition-all"
                                    aria-label="Se connecter"
                                >
                                    <User size={17} strokeWidth={1.8} />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
