'use client';
import React, { useEffect, useState } from 'react';
import { BarChart3Icon, TrendingUpIcon, Users2Icon, ShoppingCartIcon } from 'lucide-react';
import { getAdminStats } from '@/app/actions/admin';
import Loading from '@/components/Loading';

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0 });

    useEffect(() => {
        getAdminStats().then((data) => {
            setStats(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <Loading />;

    const conversionRate =
        stats.users > 0 ? ((stats.orders / stats.users) * 100).toFixed(1) + '%' : '0%';
    const panierMoyen = stats.orders > 0 ? Math.round(stats.revenue / stats.orders) : 0;

    return (
        <div className="space-y-12 animate-fade-in-up pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Analyse & <span className="text-blue-600">Performance</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Suivez la croissance de Global Air en temps réel.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        label: 'Ventes Réalisées',
                        value: stats.orders,
                        icon: TrendingUpIcon,
                        color: 'text-blue-500',
                    },
                    {
                        label: 'Total Clients',
                        value: stats.users,
                        icon: Users2Icon,
                        color: 'text-blue-500',
                    },
                    {
                        label: 'Panier Moyen',
                        value: panierMoyen.toLocaleString('fr-SN') + ' FCFA',
                        icon: ShoppingCartIcon,
                        color: 'text-amber-500',
                    },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm flex items-center gap-6"
                    >
                        <div className={`p-4 bg-slate-50 rounded-2xl ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                {stat.label}
                            </p>
                            <p className="text-2xl font-black text-slate-900 tracking-tight">
                                {stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-12 text-center">
                <div className="max-w-md mx-auto space-y-6">
                    <div className="size-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto text-blue-600">
                        <BarChart3Icon size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        Statistiques Détaillées
                    </h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Le module d&apos;analyse avancée est en cours de déploiement. Il vous
                        permettra bientôt de visualiser des graphiques précis par catégorie et par
                        région.
                    </p>
                    <div className="pt-4">
                        <span className="px-6 py-2 bg-blue-100 text-blue-700 rounded-full text-xs font-black uppercase tracking-[0.2em]">
                            Bientôt Disponible
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
