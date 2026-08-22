'use client';
import { Home, ShoppingBag, ShoppingCart, User, ShieldCheck, Heart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useHasMounted } from '@/lib/useHasMounted';

const supabase = createClient();

const BottomNav = () => {
    const pathname = usePathname();
    const cartCount = useCartStore((state) =>
        state.cart.reduce((acc, item) => acc + item.quantity, 0)
    );
    const mounted = useHasMounted();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        let ignore = false;
        const checkAdmin = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (ignore) return;
            if (user) {
                const { data: userData } = await supabase
                    .from('User')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                if (!ignore) setIsAdmin(userData?.role === 'ADMIN');
            } else {
                setIsAdmin(false);
            }
        };
        (async () => {
            if (!ignore) await checkAdmin();
        })();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                checkAdmin();
            } else {
                setIsAdmin(false);
            }
        });

        return () => {
            ignore = true;
            subscription.unsubscribe();
        };
    }, []);

    const wishlistCount = useCartStore((state) => state.wishlist.length);

    const navLinks = [
        { name: 'Home', href: '/', icon: <Home size={20} strokeWidth={2.2} /> },
        { name: 'Search', href: '/shop', icon: <ShoppingBag size={20} strokeWidth={2.2} /> },
        {
            name: 'Saved',
            href: '/wishlist',
            icon: <Heart size={20} strokeWidth={2.2} />,
            isWishlist: true,
        },
        {
            name: 'Cart',
            href: '/cart',
            icon: <ShoppingCart size={20} strokeWidth={2.2} />,
            isCart: true,
        },
        { name: 'Account', href: '/profile', icon: <User size={20} strokeWidth={2.2} /> },
    ];

    if (isAdmin) {
        navLinks.push({ name: 'Admin', href: '/admin', icon: <ShieldCheck size={20} /> });
    }

    if (pathname.startsWith('/admin') || pathname.startsWith('/product/')) return null;

    return (
        <nav
            aria-label="Navigation mobile"
            className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-[#EAE6DF] px-3 pb-safe pt-2 z-[100] shadow-[0_-8px_30px_rgba(0,0,0,0.06)]"
        >
            <div className="flex items-center justify-around max-w-md mx-auto">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            aria-label={link.name}
                            className="relative flex flex-col items-center gap-1 py-1 px-3 group"
                        >
                            <motion.div
                                whileTap={{ scale: 0.85 }}
                                className={`relative p-1 transition-colors duration-200 ${
                                    isActive
                                        ? 'text-[#10B981]'
                                        : 'text-zinc-400 group-hover:text-zinc-600'
                                }`}
                            >
                                {link.icon}
                                {link.isCart && mounted && cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 text-[9px] font-black text-white bg-[#10B981] size-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                                        {cartCount}
                                    </span>
                                )}
                                {link.isWishlist && mounted && wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 text-[9px] font-black text-white bg-red-500 size-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                                        {wishlistCount}
                                    </span>
                                )}
                            </motion.div>
                            <span
                                className={`text-[10px] tracking-tight transition-colors duration-200 ${
                                    isActive
                                        ? 'text-[#10B981] font-extrabold'
                                        : 'text-zinc-400 font-medium'
                                }`}
                            >
                                {link.name}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavDot"
                                    className="absolute -top-2 w-1.5 h-1.5 bg-[#10B981] rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
