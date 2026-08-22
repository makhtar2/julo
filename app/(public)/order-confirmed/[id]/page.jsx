'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    Package,
    Truck,
    MessageCircle,
    ArrowRight,
    ShoppingBag,
    FileText,
    Download,
    Loader2,
} from 'lucide-react';
import { getPublicOrderDetails } from '@/app/actions/order';
import { trackEvent } from '@/components/Analytics';
import Loading from '@/components/Loading';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '@/components/InvoicePDF';

const WhatsAppIcon = ({ size = 24, className = '' }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        width={size}
        height={size}
        className={className}
    >
        <path d="M12.004 2c-5.51 0-9.993 4.483-9.993 9.993 0 1.763.457 3.42 1.257 4.874L2 22l5.282-1.385c1.41.77 3.012 1.205 4.718 1.205 5.51 0 9.996-4.486 9.996-9.996 0-5.51-4.486-9.993-9.996-9.993zm5.665 14.248c-.244.688-1.21 1.249-1.666 1.291-.454.041-.9-.082-2.88-.867-2.535-1.004-4.133-3.583-4.26-3.753-.127-.17-.936-1.244-.936-2.373 0-1.129.573-1.684.806-1.917.234-.234.509-.297.68-.297.17 0 .34.002.488.01.15.007.34-.056.531.403.19.46.658 1.61.716 1.726.059.117.098.254.02.411-.078.156-.118.254-.235.39-.116.136-.245.304-.35.408-.117.117-.24.244-.103.48.137.234.608 1.004 1.301 1.62.89.794 1.64 1.04 1.874 1.157.234.117.371.098.51-.059.137-.156.59-.688.749-.92.158-.234.318-.196.53-.117.214.078 1.354.638 1.587.755.234.117.39.176.447.273.056.097.056.559-.188 1.247z" />
    </svg>
);

export default function OrderConfirmedPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const res = await getPublicOrderDetails(id);
            const currentOrder = res.order;
            if (currentOrder) {
                setOrder(currentOrder);
                // Effet Confettis "Cool"
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#10b981', '#059669', '#34d399', '#ffffff'],
                });

                // Track Purchase
                trackEvent('purchase', {
                    transaction_id: currentOrder.id,
                    total: currentOrder.total,
                    items: currentOrder.orderItems?.map((item) => ({
                        id: item.productId || item.product?.id,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                });
            }
            setLoading(false);
        };
        init();
    }, [id]);

    if (loading) return <Loading />;
    if (!order)
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-black text-slate-900 mb-4">Commande introuvable</h1>
                <Link href="/shop" className="text-blue-600 font-bold hover:underline">
                    Retourner à la boutique
                </Link>
            </div>
        );

    const orderShortId = order.id.slice(-6).toUpperCase();
    const phoneNumber = '221754469097';

    const handleWhatsAppChat = () => {
        const message = `Bonjour JULO, je viens de passer la commande #${orderShortId}. Pouvez-vous me confirmer la livraison ?`;
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                {/* ── Success Animation & Header ── */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                        className="inline-flex items-center justify-center size-24 bg-blue-100 text-blue-600 rounded-full mb-6"
                    >
                        <CheckCircle2 size={48} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4"
                    >
                        Merci pour votre commande !
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-500 font-medium text-lg"
                    >
                        Votre commande{' '}
                        <span className="text-slate-900 font-black">#{orderShortId}</span> a été
                        enregistrée avec succès.
                    </motion.p>
                </div>

                {/* ── Main Actions ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleWhatsAppChat}
                        className="flex items-center justify-center gap-3 py-5 bg-[#25D366] text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#25D366]/20 hover:bg-[#128C7E] transition-all"
                    >
                        <WhatsAppIcon size={20} /> Discuter sur WhatsApp
                    </motion.button>
                    <motion.div
                        whileHover={order.status !== 'ORDER_PLACED' ? { scale: 1.02 } : {}}
                        whileTap={order.status !== 'ORDER_PLACED' ? { scale: 0.98 } : {}}
                        className="h-full"
                    >
                        {order.status === 'ORDER_PLACED' ? (
                            <div className="flex flex-col items-center justify-center gap-2 py-4 px-6 bg-slate-100 text-slate-500 rounded-[2rem] border border-dashed border-slate-300 h-full w-full">
                                <FileText size={20} className="opacity-50" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-center">
                                    Facture disponible après validation
                                </span>
                            </div>
                        ) : (
                            <PDFDownloadLink
                                document={<InvoicePDF order={order} />}
                                fileName={`Facture-Global-Air-${orderShortId}.pdf`}
                                className="flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs sm:text-sm uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:bg-black transition-all h-full w-full"
                            >
                                {({ loading }) =>
                                    loading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />{' '}
                                            Préparation...
                                        </>
                                    ) : (
                                        <>
                                            <Download size={20} /> Télécharger Facture
                                        </>
                                    )
                                }
                            </PDFDownloadLink>
                        )}
                    </motion.div>
                </div>

                {/* ── Wave : En attente de vérification manuelle ── */}
                {order.paymentMethod === 'WAVE' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-8 bg-slate-900 text-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden"
                    >
                        {/* Fond décoratif animé */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-4 right-4 size-32 rounded-full bg-amber-400 blur-2xl" />
                            <div className="absolute bottom-4 left-4 size-24 rounded-full bg-blue-400 blur-2xl" />
                        </div>

                        <div className="relative z-10">
                            {/* Badge statut */}
                            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest mb-5">
                                <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                                En attente de vérification
                            </div>

                            <h2 className="text-xl sm:text-2xl font-black mb-3">
                                Paiement Wave envoyé ✓
                            </h2>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-md">
                                Votre paiement de{' '}
                                <strong className="text-white">
                                    {order.total?.toLocaleString('fr-SN')} FCFA
                                </strong>{' '}
                                est en cours de vérification par notre équipe. Ce processus est
                                manuel et peut prendre quelques minutes.
                            </p>

                            {/* Étapes */}
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="size-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle2 size={13} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-300">
                                        Commande enregistrée — N°{' '}
                                        <span className="text-white font-black">
                                            #{order.id?.slice(0, 8).toUpperCase()}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="size-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle2 size={13} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-300">
                                        Paiement Wave transmis
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="size-6 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                                    </div>
                                    <p className="text-sm font-bold text-amber-400">
                                        Vérification du paiement en cours...
                                    </p>
                                </div>
                                <div className="flex items-start gap-3 opacity-40">
                                    <div className="size-6 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="size-2 rounded-full bg-white/40" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-500">
                                        Confirmation & contact WhatsApp
                                    </p>
                                </div>
                            </div>

                            {/* Note de bas */}
                            <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                                <div className="size-8 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center shrink-0">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="#25D366"
                                        width={15}
                                        height={15}
                                    >
                                        <path d="M12.004 2c-5.51 0-9.993 4.483-9.993 9.993 0 1.763.457 3.42 1.257 4.874L2 22l5.282-1.385c1.41.77 3.012 1.205 4.718 1.205 5.51 0 9.996-4.486 9.996-9.996 0-5.51-4.486-9.993-9.996-9.993zm5.665 14.248c-.244.688-1.21 1.249-1.666 1.291-.454.041-.9-.082-2.88-.867-2.535-1.004-4.133-3.583-4.26-3.753-.127-.17-.936-1.244-.936-2.373 0-1.129.573-1.684.806-1.917.234-.234.509-.297.68-.297.17 0 .34.002.488.01.15.007.34-.056.531.403.19.46.658 1.61.716 1.726.059.117.098.254.02.411-.078.156-.118.254-.235.39-.116.136-.245.304-.35.408-.117.117-.24.244-.103.48.137.234.608 1.004 1.301 1.62.89.794 1.64 1.04 1.874 1.157.234.117.371.098.51-.059.137-.156.59-.688.749-.92.158-.234.318-.196.53-.117.214.078 1.354.638 1.587.755.234.117.39.176.447.273.056.097.056.559-.188 1.247z" />
                                    </svg>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Une fois le paiement vérifié, vous recevrez une confirmation
                                    directement sur{' '}
                                    <strong className="text-[#25D366]">WhatsApp</strong>.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── Order Summary Card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden mb-8"
                >
                    <div className="p-8 sm:p-10">
                        <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <Package className="text-blue-600" /> Détails de la commande
                        </h2>

                        {/* Articles */}
                        <div className="space-y-6 mb-10">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="size-16 bg-slate-50 rounded-2xl flex items-center justify-center p-2 border border-slate-100 shrink-0">
                                        <Image
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            width={50}
                                            height={50}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-slate-800 text-sm truncate">
                                            {item.product.name}
                                        </p>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                            Qté: {item.quantity} Ã—{' '}
                                            {item.price.toLocaleString('fr-SN')} F
                                        </p>
                                    </div>
                                    <p className="font-black text-slate-900 text-sm">
                                        {(item.price * item.quantity).toLocaleString('fr-SN')} F
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Delivery Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <Truck size={12} /> Mode de réception
                                </h3>
                                <p className="font-black text-slate-900 text-sm">
                                    {order.address.name === 'Global Air Dakar'
                                        ? 'ðŸª Retrait en magasin'
                                        : 'ðŸ  Livraison à domicile'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    ðŸ“ Adresse
                                </h3>
                                <p className="text-slate-600 text-sm font-medium leading-relaxed">
                                    {order.address.street}, {order.address.city}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Total Footer */}
                    <div className="bg-slate-50 p-8 sm:px-10 flex justify-between items-center border-t border-slate-100">
                        <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
                            Total Payé
                        </span>
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">
                            {order.total.toLocaleString('fr-SN')}{' '}
                            <small className="text-sm font-bold text-slate-400 ml-1">FCFA</small>
                        </span>
                    </div>
                </motion.div>

                {/* ── Footer Actions ── */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
                    <Link
                        href="/shop"
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest transition-colors"
                    >
                        <ShoppingBag size={16} /> Retour à la boutique
                    </Link>
                    <Link
                        href="/track"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-black text-xs uppercase tracking-widest transition-colors"
                    >
                        Suivre ma commande <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
