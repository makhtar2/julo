'use client';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import {
    CalendarIcon,
    MessageCircleIcon,
    PackageIcon,
    SearchIcon,
    XIcon,
    FileTextIcon,
    ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdminOrders, updateOrder } from '@/app/actions/admin';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '@/components/InvoicePDF';

const statusOptions = [
    { value: '', label: 'Toutes' },
    { value: 'ORDER_PLACED', label: 'En attente' },
    { value: 'CONFIRMED', label: 'Confirmées' },
    { value: 'PAID', label: 'Payées' },
    { value: 'PROCESSING', label: 'Préparation' },
    { value: 'SHIPPED', label: 'Expédiées' },
    { value: 'DELIVERED', label: 'Livrées' },
];

export default function AdminOrdersPage() {
    const supabase = createClient();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [updating, setUpdating] = useState(false);
    const [newDeliveryFee, setNewDeliveryFee] = useState(0);

    const fetchOrders = async () => {
        const res = await getAdminOrders();
        if (res.orders) {
            setOrders(res.orders);
        }
        setLoading(false);
    };

    const handleUpdateStatus = async (orderId, status) => {
        const res = await updateOrder(orderId, { status });
        if (res.success) {
            setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
            toast.success(`Statut mis à jour !`);
        } else {
            toast.error(res.error || 'Erreur lors de la mise à jour.');
        }
    };

    const handleUpdateOrderDetails = async () => {
        if (!selectedOrder) return;
        setUpdating(true);
        const res = await updateOrder(selectedOrder.id, {
            deliveryFee: Number(newDeliveryFee),
        });
        setUpdating(false);

        if (res.success) {
            toast.success('Commande mise à jour !');
            fetchOrders();
            closeModal();
        } else {
            toast.error(res.error);
        }
    };

    const openModal = (order) => {
        setSelectedOrder(order);
        setNewDeliveryFee(order.deliveryFee || 0);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setIsModalOpen(false);
    };

    const notifyViaWhatsApp = (order) => {
        const rawPhone = order.address?.phone || '';
        const digits = rawPhone.replace(/\D/g, '');
        const phoneNumber = digits.startsWith('221') ? digits : `221${digits.replace(/^0/, '')}`;

        if (!digits) {
            toast.error('Aucun numéro client disponible pour WhatsApp.');
            return;
        }

        const customerName = order.user?.name || order.address?.name || 'cher client';
        const orderId = order.id.slice(-6).toUpperCase();
        let message = '';

        switch (order.status) {
            case 'SHIPPED':
                message = `Bonjour ${customerName}, excellente nouvelle ! 🚚 Votre commande #${orderId} est en route ! Notre livreur va vous contacter très prochainement.`;
                break;
            case 'DELIVERED':
                message = `Bonjour ${customerName}, votre commande #${orderId} a bien été livrée ! ✅ Merci pour votre confiance envers Global Air. N'hésitez pas à nous faire un retour !`;
                break;
            case 'CANCELLED':
                message = `Bonjour ${customerName}, nous vous informons que votre commande #${orderId} a été annulée âŒ. Si c'est une erreur, répondez simplement à ce message.`;
                break;
            case 'PROCESSING':
                message = `Bonjour ${customerName}, votre commande #${orderId} est en cours de préparation 📦. Nous vous tiendrons au courant de son expédition.`;
                break;
            default:
                message = `Bonjour ${customerName}, c'est Global Air. Nous avons reçu votre commande #${orderId} (${Number(order.total).toLocaleString('fr-SN')} FCFA). Nous souhaitons la valider avec vous.`;
        }

        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const sendInvoiceViaWhatsApp = (order) => {
        const rawPhone = order.address?.phone || '';
        const digits = rawPhone.replace(/\D/g, '');
        const phoneNumber = digits.startsWith('221') ? digits : `221${digits.replace(/^0/, '')}`;
        const invoiceUrl = `${window.location.origin}/invoice/${order.id}`;

        // Comme WhatsApp Web/App ne permet pas d'envoyer un fichier direct via URL sans API Business complexe,
        // on guide l'admin pour qu'il puisse envoyer le lien.
        const message = `Bonjour, voici le lien vers votre facture Global Air pour la commande #${order.id.slice(-6).toUpperCase()} : ${invoiceUrl}\n\nVous pouvez également la télécharger en version PDF via ce lien.`;

        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
        toast.success('Lien de facture généré pour WhatsApp.');
    };

    useEffect(() => {
        let ignore = false;
        (async () => {
            if (!ignore) await fetchOrders();
        })();

        const channel = supabase
            .channel('custom-admin-orders')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'Order' },
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
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Order' }, () => {
                // Refetch pour obtenir les données relationnelles (user, address, orderItems)
                fetchOrders();
            })
            .subscribe();

        return () => {
            ignore = true;
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            (order.user?.name || order.address?.name || '')
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.address?.phone || '').includes(searchQuery);
        const matchesStatus = statusFilter ? order.status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'DELIVERED':
                return 'text-blue-600 bg-blue-50';
            case 'PAID':
                return 'text-blue-700 bg-blue-100';
            case 'CONFIRMED':
                return 'text-blue-600 bg-blue-50';
            case 'SHIPPED':
                return 'text-indigo-600 bg-indigo-50';
            case 'PROCESSING':
                return 'text-amber-600 bg-amber-50';
            default:
                return 'text-slate-500 bg-slate-50';
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
                <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">
                        Ventes
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                        Commandes
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">
                        Validez les commandes et suivez les statuts sans friction.
                    </p>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:flex">
                    <div className="rounded-2xl bg-white border border-slate-100 px-4 py-3 shadow-sm">
                        <p className="text-lg font-black text-slate-900">{orders.length}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            Total
                        </p>
                    </div>
                    <div className="rounded-2xl bg-white border border-slate-100 px-4 py-3 shadow-sm">
                        <p className="text-lg font-black text-amber-600">
                            {orders.filter((o) => o.status === 'ORDER_PLACED').length}
                        </p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            À traiter
                        </p>
                    </div>
                    <div className="rounded-2xl bg-white border border-slate-100 px-4 py-3 shadow-sm">
                        <p className="text-lg font-black text-blue-600">
                            {orders.filter((o) => o.status === 'DELIVERED').length}
                        </p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            Livrées
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-[2rem] bg-white border border-slate-100 p-3 sm:p-4 shadow-sm space-y-3">
                <div className="relative group w-full">
                    <SearchIcon
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Rechercher client, téléphone ou commande..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-blue-400 w-full transition-all text-sm font-bold"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {statusOptions.map((option) => (
                        <button
                            key={option.value || 'all'}
                            type="button"
                            onClick={() => setStatusFilter(option.value)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${statusFilter === option.value ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="md:hidden space-y-3">
                {filteredOrders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="font-black text-slate-900 truncate">
                                    {order.user?.name || order.address?.name || 'Client'}
                                </p>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                                    #{order.id.slice(-8).toUpperCase()}
                                </p>
                            </div>
                            <span
                                className={`shrink-0 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}
                            >
                                {statusOptions.find((s) => s.value === order.status)?.label ||
                                    order.status}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 my-5">
                            <div className="bg-slate-50 rounded-2xl p-3">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    Total
                                </p>
                                <p className="font-black text-slate-900 mt-1">
                                    {Number(order.total).toLocaleString('fr-SN')} F
                                    {order.transferProof && (
                                        <ImageIcon
                                            size={12}
                                            className="inline ml-1 text-blue-500"
                                        />
                                    )}
                                </p>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-3">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    Date
                                </p>
                                <p className="font-black text-slate-900 mt-1 flex items-center gap-1">
                                    <CalendarIcon size={12} />{' '}
                                    {new Date(order.createdAt).toLocaleString('fr-FR', {
                                        dateStyle: 'short',
                                        timeStyle: 'short',
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => sendInvoiceViaWhatsApp(order)}
                                className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-[10px] font-black uppercase tracking-widest text-white"
                            >
                                <FileTextIcon size={14} />
                            </button>
                            <button
                                onClick={() => notifyViaWhatsApp(order)}
                                className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-[10px] font-black uppercase tracking-widest text-white"
                            >
                                <MessageCircleIcon size={15} />
                            </button>
                            <button
                                onClick={() => openModal(order)}
                                className="rounded-2xl bg-slate-900 py-3 text-[10px] font-black uppercase tracking-widest text-white"
                            >
                                Détails
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="hidden md:block bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                            <tr>
                                <th className="py-4 px-6 text-left">Client / ID</th>
                                <th className="py-4 px-6 text-left">Total</th>
                                <th className="py-4 px-6 text-left">Statut</th>
                                <th className="py-4 px-6 text-left">Date</th>
                                <th className="py-4 px-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                            {filteredOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-slate-50/50 transition-colors"
                                >
                                    <td className="py-4 px-6">
                                        <p className="font-bold text-slate-800">
                                            {order.user?.name || order.address?.name || 'Client'}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            #{order.id.slice(-8).toUpperCase()}
                                        </p>
                                    </td>
                                    <td className="py-4 px-6 font-bold text-slate-800">
                                        {Number(order.total).toLocaleString('fr-SN')} FCFA
                                        {order.transferProof && (
                                            <span
                                                className="ml-2 text-blue-500"
                                                title="Preuve reçue"
                                            >
                                                <ImageIcon size={14} className="inline" />
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <select
                                            value={order.status}
                                            onChange={(e) =>
                                                handleUpdateStatus(order.id, e.target.value)
                                            }
                                            className={`border-none rounded-lg text-[10px] font-black px-3 py-1.5 cursor-pointer uppercase tracking-wider ${getStatusStyle(order.status)}`}
                                        >
                                            <option value="ORDER_PLACED">EN ATTENTE</option>
                                            <option value="CONFIRMED">CONFIRMÉE</option>
                                            <option value="PAID">PAYÉE</option>
                                            <option value="PROCESSING">PRÉPARATION</option>
                                            <option value="SHIPPED">EXPÉDIÉE</option>
                                            <option value="DELIVERED">LIVRÉE</option>
                                            <option value="CANCELLED">ANNULÉE</option>
                                        </select>
                                    </td>
                                    <td className="py-4 px-6 text-xs">
                                        {new Date(order.createdAt).toLocaleString('fr-FR', {
                                            dateStyle: 'short',
                                            timeStyle: 'short',
                                        })}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="inline-flex items-center gap-2">
                                            <button
                                                onClick={() => sendInvoiceViaWhatsApp(order)}
                                                title="Envoyer Facture via WhatsApp"
                                                className="rounded-xl bg-blue-50 px-3 py-2 text-blue-600 hover:bg-blue-600 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all"
                                            >
                                                <FileTextIcon size={15} />
                                            </button>
                                            <button
                                                onClick={() => notifyViaWhatsApp(order)}
                                                className="rounded-xl bg-blue-50 px-3 py-2 text-blue-600 hover:bg-blue-600 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all"
                                            >
                                                WhatsApp
                                            </button>
                                            <button
                                                onClick={() => openModal(order)}
                                                className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600 hover:bg-slate-900 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all"
                                            >
                                                Détails
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && selectedOrder && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-50 p-4"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 relative animate-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <XIcon size={24} />
                        </button>

                        <h2 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">
                            Détails de la Commande
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-sm">
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Client
                                </p>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <p className="font-bold text-slate-800">
                                        {selectedOrder.user?.name ||
                                            selectedOrder.address?.name ||
                                            'Client'}
                                    </p>
                                    <p>{selectedOrder.address?.phone}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Livraison & Frais
                                </p>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <p className="leading-relaxed mb-3">
                                        {selectedOrder.address?.street},{' '}
                                        {selectedOrder.address?.city}
                                    </p>
                                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                                        <label className="text-[10px] font-black uppercase text-slate-400">
                                            Frais:
                                        </label>
                                        <input
                                            type="number"
                                            value={newDeliveryFee}
                                            onChange={(e) => setNewDeliveryFee(e.target.value)}
                                            className="w-24 px-2 py-1 rounded bg-white border border-slate-200 text-xs font-bold focus:border-blue-500 outline-none"
                                        />
                                        <span className="text-[10px] font-bold text-slate-400">
                                            F
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Paiement
                                </p>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 h-full">
                                    <p className="font-bold text-slate-800">
                                        Mode:{' '}
                                        {selectedOrder.paymentMethod === 'COD'
                                            ? 'Cash'
                                            : selectedOrder.paymentMethod}
                                    </p>
                                    {selectedOrder.transferProof ? (
                                        <a
                                            href={selectedOrder.transferProof}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                                        >
                                            <ImageIcon size={14} /> Voir la preuve (Image)
                                        </a>
                                    ) : (
                                        <p className="mt-2 text-slate-400 text-[10px] font-bold italic uppercase tracking-widest">
                                            Aucune preuve reçue
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Articles
                            </p>
                            <div className="max-h-48 overflow-y-auto space-y-2 pr-2 border border-slate-50 rounded-lg">
                                {(selectedOrder.orderItems || []).map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center bg-slate-50 p-3 rounded-lg text-sm font-medium"
                                    >
                                        <span className="text-slate-700">
                                            {item.product?.name}{' '}
                                            <span className="text-slate-400 ml-1">
                                                x{item.quantity}
                                            </span>
                                        </span>
                                        <span className="font-bold text-slate-800">
                                            {item.price.toLocaleString('fr-SN')} F
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2 pt-6 border-t border-slate-100">
                            <div className="flex justify-between text-sm text-slate-500 font-medium">
                                <span>Sous-total:</span>
                                <span>
                                    {(
                                        Number(selectedOrder.total) -
                                        Number(selectedOrder.deliveryFee || 0) +
                                        Number(selectedOrder.discountAmount || 0)
                                    ).toLocaleString('fr-SN')}{' '}
                                    F
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-500 font-medium">
                                <span>Livraison:</span>
                                <span>
                                    {Number(selectedOrder.deliveryFee || 0).toLocaleString('fr-SN')}{' '}
                                    F
                                </span>
                            </div>
                            {selectedOrder.discountAmount > 0 && (
                                <div className="flex justify-between text-sm text-red-500 font-medium">
                                    <span>Réduction:</span>
                                    <span>
                                        -
                                        {Number(selectedOrder.discountAmount).toLocaleString(
                                            'fr-SN'
                                        )}{' '}
                                        F
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-lg font-bold text-slate-800">Total :</span>
                                <span className="text-2xl font-bold text-blue-600">
                                    {selectedOrder.total.toLocaleString('fr-SN')} FCFA
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            <button
                                onClick={handleUpdateOrderDetails}
                                disabled={updating}
                                className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-900/20 disabled:opacity-50"
                            >
                                <PackageIcon size={18} />
                                ENREGISTRER
                            </button>
                            <button
                                onClick={() => notifyViaWhatsApp(selectedOrder)}
                                className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                            >
                                <MessageCircleIcon size={18} fill="currentColor" />
                                NOTIFIER WHATSAPP
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <button
                                onClick={() => sendInvoiceViaWhatsApp(selectedOrder)}
                                className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                            >
                                <FileTextIcon size={18} />
                                ENVOYER LA FACTURE
                            </button>
                            <PDFDownloadLink
                                document={<InvoicePDF order={selectedOrder} />}
                                fileName={`Facture-Global-Air-${selectedOrder.id.slice(-6).toUpperCase()}.pdf`}
                                className="flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-800 rounded-lg font-bold hover:bg-slate-200 transition-all active:scale-95"
                            >
                                {({ loading }) =>
                                    loading ? (
                                        <>Préparation...</>
                                    ) : (
                                        <>
                                            <FileTextIcon size={18} />
                                            TÉLÉCHARGER PDF
                                        </>
                                    )
                                }
                            </PDFDownloadLink>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={closeModal}
                                className="py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition-all active:scale-95 w-full"
                            >
                                FERMER
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
