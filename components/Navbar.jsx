'use client';
import {
    Search,
    ShoppingCart,
    Menu,
    X,
    User,
    ShoppingBag,
    LogOut,
    Package,
    Heart,
    ChevronDown,
    ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { useHasMounted } from '@/lib/useHasMounted';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '@/app/actions/auth';
import { getSearchSuggestions } from '@/app/actions/product';
import { assets } from '@/assets/assets';

const supabase = createClient();

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const mounted = useHasMounted();
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

    const cartCount = useCartStore((state) =>
        state.cart.reduce((acc, item) => acc + item.quantity, 0)
    );
    const wishlist = useCartStore((state) => state.wishlist);
    const wishlistCount = wishlist?.length || 0;

    const checkAdminStatus = async (user) => {
        if (!user) {
            setIsAdmin(false);
            return;
        }
        const { data: userData } = await supabase
            .from('User')
            .select('role')
            .eq('id', user.id)
            .single();
        setIsAdmin(userData?.role === 'ADMIN');
    };

    useEffect(() => {
        let ignore = false;
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (ignore) return;
            setUser(user);
            checkAdminStatus(user);
        };
        (async () => {
            if (!ignore) await getUser();
        })();
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            checkAdminStatus(currentUser);
        });

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsAccountOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            ignore = true;
            subscription.unsubscribe();
            document.removeEventListener('mousedown', handleClickOutside);
        };
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
            router.push(`/shop?search=${search}`);
            setIsSearchOpen(false);
            setSuggestions([]);
        }
    };

    const navLinks = [
        { name: 'Boutique', href: '/shop' },
        { name: 'Smartphones', href: '/shop?category=telephones' },
        { name: 'Ordinateurs', href: '/shop?category=ordinateurs' },
        { name: 'Accessoires', href: '/shop?category=accessoires' },
        { name: 'Sérigraphie', href: '/shop?category=serigraphie' },
        { name: 'À Propos', href: '/about' },
    ];

    return (
        <nav className="relative bg-white/95 backdrop-blur-md border-b border-zinc-200/80 sticky top-0 z-[150]">
            {/* Search Overlay for Mobile */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white z-[200] flex flex-col sm:hidden"
                    >
                        {/* Mobile Search Header */}
                        <div className="p-4 border-b border-zinc-100 flex items-center gap-4">
                            <form
                                onSubmit={handleSearch}
                                className="flex-1 flex items-center gap-3 bg-zinc-100 px-4 py-3 rounded-2xl"
                            >
                                <Search size={20} className="text-zinc-400" />
                                <input
                                    autoFocus
                                    className="w-full bg-transparent outline-none placeholder-zinc-400 font-bold text-sm"
                                    type="text"
                                    placeholder="Rechercher un smartphone, PC, t-shirt..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    required
                                />
                            </form>
                            <button
                                onClick={() => {
                                    setIsSearchOpen(false);
                                    setSearch('');
                                    setSuggestions([]);
                                }}
                                className="text-zinc-500 font-bold text-xs uppercase tracking-wider px-2"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Suggestions Results */}
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
                                            className="flex items-center gap-3 p-3 hover:bg-zinc-50 rounded-2xl transition-colors"
                                        >
                                            <div className="size-12 bg-zinc-100 rounded-xl flex items-center justify-center p-2">
                                                <Image
                                                    src={item.images[0]}
                                                    alt=""
                                                    width={40}
                                                    height={40}
                                                    className="object-contain"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-zinc-900 truncate">
                                                    {item.name}
                                                </p>
                                                <p className="text-[11px] font-bold text-amber-600 mt-0.5">
                                                    {item.price.toLocaleString('fr-SN')} FCFA
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

            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between max-w-7xl mx-auto h-16 sm:h-20 gap-4">
                    {/* Left: Brand Logo */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            aria-label="JULO - Accueil"
                            className="flex items-center group"
                        >
                            <Image
                                src={assets.julo_logo_transparent}
                                alt="JULO."
                                width={120}
                                height={40}
                                priority
                                className="h-7 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
                            />
                        </Link>
                    </div>

                    {/* Center: Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                                        isActive
                                            ? 'bg-zinc-950 text-white shadow-sm'
                                            : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile: Search Toggle */}
                    <div className="flex lg:hidden items-center">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Ouvrir la recherche"
                            className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
                        >
                            <Search size={20} strokeWidth={2} />
                        </motion.button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 sm:gap-4 flex-1">
                        {/* Desktop Search */}
                        <div className="hidden xl:block relative" ref={searchRef}>
                            <form
                                onSubmit={handleSearch}
                                className="flex items-center w-60 text-sm gap-2 bg-zinc-100 px-4 py-2 rounded-xl border border-transparent focus-within:border-zinc-300 transition-all"
                            >
                                <Search size={16} className="text-zinc-400" />
                                <input
                                    className="w-full bg-transparent outline-none placeholder-zinc-400 font-medium text-xs text-zinc-900"
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </form>

                            <AnimatePresence>
                                {suggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden p-2 z-[999]"
                                    >
                                        {suggestions.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={`/product/${item.id}`}
                                                onClick={() => {
                                                    setSuggestions([]);
                                                    setSearch('');
                                                }}
                                                className="flex items-center gap-3 p-2 hover:bg-zinc-50 rounded-xl transition-colors group"
                                            >
                                                <div className="size-10 bg-zinc-100 rounded-lg flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                                                    <Image
                                                        src={item.images[0]}
                                                        alt=""
                                                        width={30}
                                                        height={30}
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-zinc-900 truncate">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-amber-600">
                                                        {item.price.toLocaleString('fr-SN')} FCFA
                                                    </p>
                                                </div>
                                                <ArrowRight
                                                    size={12}
                                                    className="text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all"
                                                />
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative hidden sm:block"
                            >
                                <Link
                                    href="/wishlist"
                                    aria-label="Voir mes favoris"
                                    className="flex items-center justify-center size-9 sm:size-10 bg-zinc-100 text-zinc-700 hover:text-red-500 rounded-xl transition-all group"
                                >
                                    <Heart size={18} strokeWidth={2} />
                                    {mounted && wishlistCount > 0 && (
                                        <span className="absolute -top-1 -right-1 text-[9px] font-black text-white bg-red-500 size-4 rounded-full flex items-center justify-center border-2 border-white">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Link>
                            </motion.div>

                            <motion.div
                                key={cartCount}
                                initial={{ scale: 1 }}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.3 }}
                                className="relative"
                            >
                                <Link
                                    href="/cart"
                                    aria-label="Voir mon panier"
                                    className="flex items-center justify-center size-9 sm:size-10 bg-zinc-950 text-white hover:bg-amber-500 hover:text-zinc-950 rounded-xl transition-all group"
                                >
                                    <ShoppingCart size={18} strokeWidth={2} />
                                    {mounted && cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 text-[9px] font-black text-zinc-950 bg-amber-400 size-4 rounded-full flex items-center justify-center border-2 border-white">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            </motion.div>

                            <div className="hidden sm:block relative" ref={dropdownRef}>
                                {user ? (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setIsAccountOpen(!isAccountOpen)}
                                            className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10 transition-all"
                                        >
                                            <div className="size-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                                                {user.user_metadata?.full_name?.charAt(0) ||
                                                    user.email?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="max-w-[100px] truncate">
                                                {user.user_metadata?.full_name?.split(' ')[0] ||
                                                    'Compte'}
                                            </span>
                                            <ChevronDown
                                                size={14}
                                                className={`transition-transform duration-300 ${isAccountOpen ? 'rotate-180' : ''}`}
                                            />
                                        </motion.button>

                                        <AnimatePresence>
                                            {isAccountOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden z-[100]"
                                                >
                                                    <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                                            Bienvenue
                                                        </p>
                                                        <p className="text-slate-900 font-black truncate">
                                                            {user.user_metadata?.full_name ||
                                                                user.email}
                                                        </p>
                                                    </div>
                                                    <div className="p-3">
                                                        {isAdmin && (
                                                            <Link
                                                                href="/admin"
                                                                onClick={() =>
                                                                    setIsAccountOpen(false)
                                                                }
                                                                className="flex items-center gap-4 px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition-all group"
                                                            >
                                                                <div className="size-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                    <User size={18} />
                                                                </div>
                                                                <span className="font-bold text-sm">
                                                                    Espace Admin
                                                                </span>
                                                            </Link>
                                                        )}
                                                        <Link
                                                            href="/profile"
                                                            onClick={() => setIsAccountOpen(false)}
                                                            className="flex items-center gap-4 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-2xl transition-all group"
                                                        >
                                                            <div className="size-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                <User size={18} />
                                                            </div>
                                                            <span className="font-bold text-sm">
                                                                Mon Profil
                                                            </span>
                                                        </Link>
                                                        <Link
                                                            href="/wishlist"
                                                            onClick={() => setIsAccountOpen(false)}
                                                            className="flex items-center gap-4 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-2xl transition-all group"
                                                        >
                                                            <div className="size-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                                                                <Heart size={18} />
                                                            </div>
                                                            <span className="font-bold text-sm">
                                                                Favoris
                                                            </span>
                                                        </Link>
                                                        <Link
                                                            href="/orders"
                                                            onClick={() => setIsAccountOpen(false)}
                                                            className="flex items-center gap-4 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-2xl transition-all group"
                                                        >
                                                            <div className="size-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                <Package size={18} />
                                                            </div>
                                                            <span className="font-bold text-sm">
                                                                Mes Commandes
                                                            </span>
                                                        </Link>
                                                        <div className="my-2 border-t border-slate-50"></div>
                                                        <button
                                                            onClick={handleLogout}
                                                            className="w-full flex items-center gap-4 px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl transition-all group"
                                                        >
                                                            <div className="size-10 bg-red-100/50 rounded-xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                                                                <LogOut size={18} />
                                                            </div>
                                                            <span className="font-bold text-sm">
                                                                Déconnexion
                                                            </span>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </>
                                ) : (
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            href="/login"
                                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/10 transition-all block"
                                        >
                                            Connexion
                                        </Link>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
