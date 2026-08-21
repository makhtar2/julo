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
        { name: 'Accueil', href: '/' },
        { name: 'Boutique', href: '/shop' },
        { name: 'Conseils', href: '/blog' },
        { name: 'À propos', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <nav className="relative bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[150]">
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
                        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
                            <form
                                onSubmit={handleSearch}
                                className="flex-1 flex items-center gap-3 bg-slate-100 px-4 py-3 rounded-2xl"
                            >
                                <Search size={20} className="text-slate-400" />
                                <input
                                    autoFocus
                                    className="w-full bg-transparent outline-none placeholder-slate-400 font-bold text-sm"
                                    type="text"
                                    placeholder="Que cherchez-vous ?"
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
                                className="text-slate-500 font-black text-xs uppercase tracking-widest px-2"
                            >
                                Annuler
                            </button>
                        </div>

                        {/* Mobile Suggestions Area */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 bg-white">
                            {suggestions.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">
                                        Résultats suggérés
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
                                            className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl transition-all border border-transparent active:border-blue-100"
                                        >
                                            <div className="size-14 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm shrink-0">
                                                <Image
                                                    src={item.images[0]}
                                                    alt={item.name}
                                                    width={56}
                                                    height={56}
                                                    className="object-contain"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-black text-slate-900 truncate">
                                                    {item.name}
                                                </p>
                                                <p className="text-[11px] font-bold text-blue-600 mt-0.5">
                                                    {item.price.toLocaleString('fr-SN')} FCFA
                                                </p>
                                            </div>
                                            <ArrowRight size={14} className="text-slate-300" />
                                        </Link>
                                    ))}
                                </div>
                            ) : search.length >= 2 ? (
                                <div className="text-center py-20">
                                    <Search size={40} className="mx-auto text-slate-200 mb-4" />
                                    <p className="text-sm font-bold text-slate-400">
                                        Aucun résultat trouvé pour &quot;{search}&quot;
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-20 opacity-40">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
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
                    {/* Desktop: Navigation Links */}
                    <div className="hidden sm:flex items-center gap-2 lg:gap-4 flex-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 relative group
                                        ${
                                            isActive
                                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    {link.name}
                                    {!isActive && (
                                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-1/2"></span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile: Search Toggle */}
                    <div className="flex sm:hidden items-center flex-1">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Ouvrir la recherche"
                            className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            <Search size={22} strokeWidth={2.5} />
                        </motion.button>
                    </div>

                    {/* Logo (Centered) */}
                    <div className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 shrink-0">
                        <Link
                            href="/"
                            aria-label="Julo - Retour à l'accueil"
                            className="flex items-center gap-2 group"
                        >
                            <span className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-900 uppercase transition-transform group-hover:scale-105">
                                JU<span className="text-amber-500">LO</span>
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-widest bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full hidden sm:inline-block">
                                PROD
                            </span>
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 sm:gap-4 flex-1">
                        {/* Desktop Search */}
                        <div className="hidden xl:block relative" ref={searchRef}>
                            <form
                                onSubmit={handleSearch}
                                className="flex items-center w-64 text-sm gap-2 bg-slate-100 px-4 py-2.5 rounded-2xl border border-transparent focus-within:border-blue-200 transition-all"
                            >
                                <Search size={18} className="text-slate-400" />
                                <input
                                    className="w-full bg-transparent outline-none placeholder-slate-400 font-bold"
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
                                        className="absolute top-full mt-2 left-0 right-0 bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden p-2 z-[999]"
                                    >
                                        {suggestions.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={`/product/${item.id}`}
                                                onClick={() => {
                                                    setSuggestions([]);
                                                    setSearch('');
                                                }}
                                                className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-2xl transition-colors group"
                                            >
                                                <div className="size-10 bg-slate-100 rounded-xl flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                                                    <Image
                                                        src={item.images[0]}
                                                        alt=""
                                                        width={30}
                                                        height={30}
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] font-black text-slate-900 truncate">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-[9px] font-bold text-blue-600">
                                                        {item.price.toLocaleString('fr-SN')} F
                                                    </p>
                                                </div>
                                                <ArrowRight
                                                    size={12}
                                                    className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                                                />
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-3">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative hidden lg:block"
                            >
                                <Link
                                    href="/wishlist"
                                    aria-label="Voir mes favoris"
                                    className="flex items-center justify-center size-10 sm:size-12 bg-slate-50 text-slate-700 hover:text-red-500 rounded-2xl transition-all group"
                                >
                                    <Heart size={20} strokeWidth={2.5} />
                                    {mounted && wishlistCount > 0 && (
                                        <span className="absolute -top-1 -right-1 text-[9px] font-black text-white bg-red-500 size-4.5 rounded-full flex items-center justify-center border-2 border-white">
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
                                    className="flex items-center justify-center size-10 sm:size-12 bg-slate-50 text-slate-700 hover:text-blue-600 rounded-2xl transition-all group"
                                >
                                    <ShoppingCart size={20} strokeWidth={2.5} />
                                    {mounted && cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 text-[9px] font-black text-white bg-blue-600 size-4.5 rounded-full flex items-center justify-center border-2 border-white">
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
