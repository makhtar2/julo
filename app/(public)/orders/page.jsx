'use client';
import PageTitle from '@/components/PageTitle';
import { useEffect, useRef, useState } from 'react';
import OrderItem from '@/components/OrderItem';
import { getUserOrders } from '@/app/actions/order';
import Loading from '@/components/Loading';
import { Package } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Orders() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    // Garde contre le double-mount (React Strict Mode)
    const channelRef = useRef(null);
    const supabaseRef = useRef(null);

    useEffect(() => {
        // Créer le client une seule fois
        if (!supabaseRef.current) {
            supabaseRef.current = createClient();
        }
        const supabase = supabaseRef.current;

        // Éviter de souscrire deux fois si déjà actif
        if (channelRef.current) return;

        const fetchOrdersAndSubscribe = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const res = await getUserOrders();
            if (res.orders) {
                setOrders(res.orders);
            }
            setLoading(false);

            // Créer le channel seulement s'il n'existe pas encore
            if (!channelRef.current) {
                channelRef.current = supabase
                    .channel(`user-orders-${user.id}`)
                    .on(
                        'postgres_changes',
                        {
                            event: 'UPDATE',
                            schema: 'public',
                            table: 'Order',
                            filter: `userId=eq.${user.id}`,
                        },
                        (payload) => {
                            setOrders((prev) =>
                                prev.map((order) =>
                                    order.id === payload.new.id
                                        ? { ...order, status: payload.new.status }
                                        : order
                                )
                            );
                        }
                    )
                    .subscribe();
            }
        };

        fetchOrdersAndSubscribe();

        return () => {
            if (channelRef.current && supabaseRef.current) {
                supabaseRef.current.removeChannel(channelRef.current);
                channelRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="min-h-[70vh] mx-6">
            {orders.length > 0 ? (
                <div className="my-10 sm:my-20 max-w-7xl mx-auto">
                    <PageTitle
                        heading="Mes Commandes"
                        text={`Affichage de ${orders.length} commandes au total`}
                        linkText={"Retour à l'accueil"}
                    />

                    <div className="overflow-x-auto">
                        <table className="w-full text-slate-500 table-auto border-separate border-spacing-y-4">
                            <thead className="hidden md:table-header-group">
                                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                                    <th className="text-left pb-6 px-4">Produits & Date</th>
                                    <th className="text-center pb-6">Prix Total</th>
                                    <th className="text-left pb-6">Adresse de livraison</th>
                                    <th className="text-right pb-6 pr-4">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {orders.map((order) => (
                                    <OrderItem order={order} key={order.id} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
                    <div className="size-24 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-200 mb-8">
                        <Package size={48} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">
                        Aucune commande
                    </h1>
                    <p className="text-slate-500 font-medium max-w-xs mb-10">
                        Vous n&apos;avez pas encore passé de commande sur notre boutique.
                    </p>
                    <Link
                        href="/shop"
                        className="px-10 py-5 bg-[#1C1B1F] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-[#10B981] active:scale-95 transition-all"
                    >
                        Commencer mes achats
                    </Link>
                </div>
            )}
        </div>
    );
}
