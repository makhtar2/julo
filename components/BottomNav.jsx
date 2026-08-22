'use client';
import { Home, ShoppingBag, ShoppingCart, User, ShieldCheck } from 'lucide-react';
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

    const navLinks = [
        { name: 'Accueil', href: '/', icon: <Home size={20} /> },
        { name: 'Boutique', href: '/shop', icon: <ShoppingBag size={20} /> },
        { name: 'Panier', href: '/cart', icon: <ShoppingCart size={20} />, isCart: true },
        { name: 'Compte', href: '/profile', icon: <User size={20} /> },
    ];

    if (isAdmin) {
        navLinks.push({ name: 'Admin', href: '/admin', icon: <ShieldCheck size={20} /> });
    }

    if (pathname.startsWith('/admin')) return null;

    return (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#FAF8F5]/95 backdrop-blur-xl border-t border-[#EAE6DF] px-4 pb-safe pt-2 z-[100] shadow-lg">
            <div className="flex items-center justify-around max-w-md mx-auto">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            aria-label={link.name}
                            className="relative flex flex-col items-center gap-1 p-2 group"
                        >
                            <motion.div
                                whileTap={{ scale: 0.8 }}
                                className={`p-1 transition-colors duration-200 ${isActive ? 'text-[#C59A63]' : 'text-zinc-400 group-hover:text-zinc-600'}`}
                            >
                                {link.icon}
                                {link.isCart && mounted && cartCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 text-[8px] font-black text-white bg-[#C59A63] size-3.5 rounded-full flex items-center justify-center border-2 border-white">
                                        {cartCount}
                                    </span>
                                )}
                            </motion.div>
                            <span
                                className={`text-[10px] font-bold transition-colors duration-200 ${isActive ? 'text-[#1C1B1F]' : 'text-zinc-400 group-hover:text-zinc-600'}`}
                            >
                                {link.name}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavDot"
                                    className="absolute -top-1 w-1 h-1 bg-[#C59A63] rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
