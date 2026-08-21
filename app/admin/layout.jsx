'use client';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import Link from 'next/link';
import { ArrowRightIcon, StoreIcon } from 'lucide-react';
import AdminMenu from '@/components/admin/AdminMenu';
import { createClient } from '@/lib/supabase/client';
import { assets } from '@/assets/assets';
import Image from 'next/image';

const supabase = createClient();

export default function RootAdminLayout({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            const { data: userData } = await supabase
                .from('User')
                .select('role')
                .eq('id', user.id)
                .single();

            setIsAdmin(userData?.role === 'ADMIN');
            setLoading(false);
        };
        checkAdmin();
    }, []);

    return loading ? (
        <Loading />
    ) : isAdmin ? (
        <div className="min-h-screen bg-slate-50">
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden">
                <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/admin" className="flex items-center">
                        <Image
                            src={assets.global_air_logo}
                            alt="Global Air Admin"
                            width={180}
                            height={60}
                            className="h-12 w-auto object-contain"
                        />{' '}
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-100 hover:bg-blue-600 hover:text-white transition-all"
                    >
                        <StoreIcon size={14} />
                        Boutique
                    </Link>
                </div>
                <div className="px-4 sm:px-6 pb-3">
                    <AdminMenu />
                </div>
            </header>

            <div className="lg:grid lg:grid-cols-[280px_1fr]">
                <aside className="hidden lg:flex sticky top-0 h-screen flex-col border-r border-slate-200 bg-white px-5 py-6">
                    <Link href="/admin" className="mb-8 px-3">
                        <Image
                            src={assets.global_air_logo}
                            alt="Global Air Admin"
                            width={220}
                            height={75}
                            className="h-14 w-auto object-contain"
                        />{' '}
                    </Link>
                    <AdminMenu />
                    <div className="mt-auto pt-6">
                        <Link
                            href="/"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-100 hover:bg-blue-600 hover:text-white transition-all"
                        >
                            <StoreIcon size={14} />
                            Retour boutique
                        </Link>
                    </div>
                </aside>

                <main className="min-w-0 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{children}</main>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-slate-50">
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-800">Accès Refusé</h1>
            <p className="text-slate-500 mt-4 max-w-md">
                Vous n&apos;avez pas les autorisations nécessaires pour accéder à cette page.
            </p>
            <Link
                href="/"
                className="bg-blue-600 text-white flex items-center gap-2 mt-8 px-8 py-3 rounded-full hover:bg-blue-700 transition-all shadow-lg"
            >
                Retour à l&apos;accueil <ArrowRightIcon size={18} />
            </Link>
        </div>
    );
}
