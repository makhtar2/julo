'use client';
import { useState } from 'react';
import { trackPublicOrder } from '@/app/actions/order';
import { Package, Search, Clock, CheckCircle2, Truck, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setOrder(null);

        const res = await trackPublicOrder(orderId, phone);
        if (res.error) {
            setError(res.error);
        } else {
            setOrder(res.order);
        }
        setLoading(false);
    };

    const statuses = [
        { id: 'ORDER_PLACED', label: 'En attente de confirmation', icon: Clock },
        { id: 'PROCESSING', label: 'En cours de préparation', icon: RefreshCw },
        { id: 'SHIPPED', label: 'Expédiée', icon: Truck },
        { id: 'DELIVERED', label: 'Livrée', icon: CheckCircle2 },
    ];

    const getStatusIndex = (status) => {
        return statuses.findIndex((s) => s.id === status) >= 0
            ? statuses.findIndex((s) => s.id === status)
            : 0; // Default if cancelled or something else
    };

    const isCancelled = order?.status === 'CANCELLED';
    const currentIndex = getStatusIndex(order?.status);

    return (
        <div className="min-h-[80vh] bg-slate-50/50 px-4 sm:px-6 py-12">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                        Service Client
                    </p>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                        Suivi de Commande
                    </h1>
                </div>

                <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl p-8 sm:p-12">
                    {!order ? (
                        <form onSubmit={handleTrack} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold flex items-center gap-3">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                                    NÂ° de Commande
                                </label>
                                <input
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="Ex: A1B2C3"
                                    className="p-4 bg-slate-50 border border-transparent focus:border-blue-400 focus:bg-white outline-none rounded-2xl w-full text-sm font-bold transition-all uppercase"
                                    required
                                />
                                <p className="text-xs text-slate-400 mt-2 ml-4">
                                    Les 6 derniers caractères suffisent.
                                </p>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                                    Téléphone de Livraison
                                </label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="77 783 27 98"
                                    className="p-4 bg-slate-50 border border-transparent focus:border-blue-400 focus:bg-white outline-none rounded-2xl w-full text-sm font-bold transition-all"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                            >
                                {loading ? (
                                    <RefreshCw className="animate-spin" size={18} />
                                ) : (
                                    <Search size={18} />
                                )}
                                SUIVRE MON COLIS
                            </button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-10"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                                        Commande
                                    </p>
                                    <h2 className="text-xl font-black text-slate-900 uppercase">
                                        #{order.id.slice(-6)}
                                    </h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                                        Client
                                    </p>
                                    <h2 className="text-sm font-bold text-slate-900">
                                        {order.address.name}
                                    </h2>
                                </div>
                            </div>

                            {isCancelled ? (
                                <div className="p-8 bg-red-50 rounded-3xl text-center border border-red-100">
                                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-red-700 mb-2">
                                        Commande Annulée
                                    </h3>
                                    <p className="text-red-600 font-medium text-sm">
                                        Cette commande a été annulée. Si vous pensez qu&apos;il
                                        s&apos;agit d&apos;une erreur, veuillez contacter notre
                                        service client.
                                    </p>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-100 z-0 hidden sm:block"></div>
                                    <div className="space-y-8">
                                        {statuses.map((status, index) => {
                                            const isCompleted = index <= currentIndex;
                                            const isActive = index === currentIndex;
                                            const Icon = status.icon;

                                            return (
                                                <div
                                                    key={status.id}
                                                    className="relative flex items-center gap-6 z-10"
                                                >
                                                    <div
                                                        className={`size-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                                                            isCompleted
                                                                ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/25'
                                                                : 'bg-slate-100 text-slate-400'
                                                        } ${isActive ? 'scale-110 ring-4 ring-[#10B981]/20' : ''}`}
                                                    >
                                                        <Icon
                                                            size={20}
                                                            strokeWidth={isCompleted ? 3 : 2}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p
                                                            className={`font-black text-sm uppercase tracking-widest ${
                                                                isCompleted
                                                                    ? 'text-slate-900'
                                                                    : 'text-slate-400'
                                                            }`}
                                                        >
                                                            {status.label}
                                                        </p>
                                                        {isActive && (
                                                            <p className="text-xs text-[#10B981] font-bold mt-1">
                                                                Statut actuel de votre colis
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 text-center">
                                <button
                                    onClick={() => setOrder(null)}
                                    className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors"
                                >
                                    Suivre une autre commande
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
