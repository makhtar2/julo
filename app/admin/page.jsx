'use client';
import Loading from '@/components/Loading';
import OrdersAreaChart from '@/components/OrdersAreaChart';
import {
    CircleDollarSignIcon,
    ShoppingBasketIcon,
    TagsIcon,
    UsersIcon,
    ArrowRightIcon,
    AlertTriangleIcon,
    TrophyIcon,
    PackageIcon,
    LayersIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Title from '@/components/Title';
import { getAdminStats } from '@/app/actions/admin';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        products: 0,
        revenue: 0,
        orders: 0,
        users: 0,
        lowStock: [],
        topCustomers: [],
        allOrders: [],
    });

    const dashboardCardsData = [
        { title: 'Articles en Stock', value: dashboardData.products, icon: ShoppingBasketIcon },
        {
            title: 'Revenu Total',
            value: Number(dashboardData.revenue).toLocaleString('fr-SN') + ' FCFA',
            icon: CircleDollarSignIcon,
        },
        { title: 'Ventes Réalisées', value: dashboardData.orders, icon: TagsIcon },
        { title: 'Clients Global Air', value: dashboardData.users, icon: UsersIcon },
    ];

    const fetchDashboardData = async () => {
        const stats = await getAdminStats();
        setDashboardData(stats);
        setLoading(false);
    };

    useEffect(() => {
        let ignore = false;
        (async () => {
            if (!ignore) await fetchDashboardData();
        })();

        // Abonnement Realtime pour les nouvelles commandes
        const channel = supabase
            .channel('realtime_admin_stats')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Order' }, () => {
                fetchDashboardData();
            })
            .subscribe();

        return () => {
            ignore = true;
            supabase.removeChannel(channel);
        };
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="space-y-10 pb-20">
            <div className="flex items-center justify-between">
                <Title
                    title="Tableau de Bord Global Air"
                    description="Voici l'état actuel de votre boutique en temps réel."
                    visibleButton={false}
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full shadow-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
                        Live Dashboard
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardCardsData.map((card, index) => (
                    <div
                        key={index}
                        className="flex flex-col justify-between bg-slate-50 border border-slate-200 p-6 rounded-xl hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white rounded-lg text-blue-600 border border-slate-100 shadow-sm">
                                <card.icon size={20} />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                                {card.title}
                            </p>
                            <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Revenue Chart Section */}
                <div className="xl:col-span-2 border border-slate-200 p-6 sm:p-8 rounded-xl bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <TagsIcon size={20} className="text-blue-600" />
                            Flux des Revenus
                        </h2>
                    </div>

                    <div className="h-[300px] w-full">
                        <OrdersAreaChart allOrders={dashboardData.allOrders} />
                    </div>
                </div>

                {/* Stock Alerts */}
                <div className="border border-slate-200 p-6 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <AlertTriangleIcon size={18} className="text-amber-500" />
                            Alertes Stock
                        </h2>
                        <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                            Faible
                        </span>
                    </div>

                    <div className="flex-1 space-y-4">
                        {dashboardData.lowStock?.length > 0 ? (
                            dashboardData.lowStock.map((prod) => (
                                <div
                                    key={prod.id}
                                    className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100"
                                >
                                    <div className="size-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center p-1 overflow-hidden shrink-0">
                                        <Image
                                            src={prod.images?.[0] || '/placeholder-image.png'}
                                            alt={prod.name}
                                            width={40}
                                            height={40}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">
                                            {prod.name}
                                        </p>
                                        <p className="text-[10px] font-black text-red-500 uppercase">
                                            Reste : {prod.stock} unités
                                        </p>
                                    </div>
                                    <Link
                                        href="/admin/products"
                                        className="size-8 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-lg border border-slate-100 flex items-center justify-center transition-all"
                                    >
                                        <ArrowRightIcon size={14} />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-10 text-center opacity-40">
                                <PackageIcon size={32} className="mb-2" />
                                <p className="text-xs font-bold">Stock optimal</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Top Customers */}
                <div className="xl:col-span-2 border border-slate-200 p-6 sm:p-8 rounded-xl bg-white shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <TrophyIcon size={20} className="text-yellow-500" />
                            Meilleurs Clients
                        </h2>
                        <Link
                            href="/admin/analytics"
                            className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
                        >
                            Voir toute l&apos;analyse
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                                    <th className="pb-4">Client</th>
                                    <th className="pb-4 text-center">Commandes</th>
                                    <th className="pb-4 text-right">Total Dépensé</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {dashboardData.topCustomers?.map((customer, i) => (
                                    <tr key={i} className="group">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-9 bg-slate-100 rounded-full flex items-center justify-center text-xs font-black text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors uppercase">
                                                    {customer.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">
                                                        {customer.name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-medium">
                                                        {customer.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-center">
                                            <span className="inline-flex items-center justify-center size-6 bg-slate-50 text-[10px] font-black rounded-lg border border-slate-100">
                                                {customer.ordersCount}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <p className="text-sm font-black text-slate-900">
                                                {customer.totalSpent.toLocaleString('fr-SN')} FCFA
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions (Moved here for better layout) */}
                <div className="border border-slate-200 rounded-xl p-8 bg-slate-50 shadow-sm flex flex-col gap-6">
                    <h2 className="text-lg font-semibold text-slate-800">Actions Rapides</h2>

                    <div className="flex flex-col gap-3">
                        {[
                            {
                                name: 'Ajouter un produit',
                                icon: ShoppingBasketIcon,
                                href: '/admin/products',
                            },
                            {
                                name: 'Gérer les catégories',
                                icon: LayersIcon,
                                href: '/admin/categories',
                            },
                            {
                                name: 'Vérifier les commandes',
                                icon: TagsIcon,
                                href: '/admin/orders',
                            },
                            {
                                name: "Consulter l'analyse",
                                icon: UsersIcon,
                                href: '/admin/analytics',
                            },
                        ].map((action, i) => (
                            <Link
                                key={i}
                                href={action.href}
                                className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <action.icon size={18} />
                                    <span className="font-medium text-sm">{action.name}</span>
                                </div>
                                <ArrowRightIcon
                                    size={14}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                            </Link>
                        ))}
                    </div>

                    <div className="mt-4 pt-6 border-t border-slate-200">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                            Statut Serveur
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="size-2.5 bg-blue-500 rounded-full animate-pulse"></div>
                            <p className="text-xs font-bold text-slate-600">
                                Système Opérationnel{' '}
                                <span className="text-blue-600 ml-1">99.9%</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
