'use client';
import { getInvoiceData } from '@/app/actions/order';
import { notFound, useParams, useRouter } from 'next/navigation';
import {
    ShieldCheck,
    ArrowLeft,
    Printer,
    DownloadIcon,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import Loading from '@/components/Loading';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { createClient } from '@/lib/supabase/client';
import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';
import { getZonesForRegion } from '@/lib/deliveryZones';

export default function InvoicePage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const invoiceRef = useRef(null);
    const supabase = createClient();

    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const checkAdmin = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                const { data: userData } = await supabase
                    .from('User')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                setIsAdmin(userData?.role === 'ADMIN');
            }
        };
        checkAdmin();
    }, [supabase]);

    useEffect(() => {
        const fetchOrder = async () => {
            const { order, error } = await getInvoiceData(id);

            if (order) {
                setOrder(order);
            } else if (error) {
                setErrorMsg(error);
            }
            setLoading(false);
        };
        if (id) fetchOrder();
    }, [id, router, isAdmin]);

    const exportPDF = async () => {
        if (!invoiceRef.current) return;
        setIsExporting(true);
        try {
            const dataUrl = await toPng(invoiceRef.current, { quality: 0.95, pixelRatio: 2 });
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Facture-Global Air-${order.id.slice(-6).toUpperCase()}.pdf`);
        } catch (err) {
            console.error('Export error:', err);
        }
        setIsExporting(false);
    };

    if (loading) return <Loading />;

    if (errorMsg) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
                <div className="size-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={40} />
                </div>
                <h1 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                    Facture indisponible
                </h1>
                <p className="text-slate-500 font-medium max-w-md mb-8 leading-relaxed">
                    {errorMsg}
                </p>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
                >
                    <ArrowLeft size={16} /> Retour
                </button>
            </div>
        );
    }

    if (!order) return notFound();

    const date = new Date(order.createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    const isPaid = order.status === 'PAID' || order.status === 'DELIVERED';
    const trackingUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/track?id=${order.id}`;

    // Le type de commande vient du champ deliveryMethod (déjà sur la commande),
    // pas d'une comparaison de texte fragile sur le nom de l'adresse.
    const isPickup = order.deliveryMethod === 'PICKUP';
    // Frais "à négocier" (zones hors Dakar) : stockés comme deliveryFee=0 au même
    // titre qu'une vraie livraison gratuite. On revérifie la zone pour ne pas
    // afficher "Gratuit" quand les frais n'ont en fait pas encore été fixés.
    const zoneMatch =
        !isPickup && order.address?.state
            ? getZonesForRegion(order.address.state).find((z) => z.name === order.address.city)
            : null;
    const deliveryFeePending = !isPickup && !(order.deliveryFee > 0) && zoneMatch?.fee === -1;

    return (
        <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 print:p-0 print:bg-white">
            {/* Actions Bar */}
            <div className="max-w-4xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
                >
                    <ArrowLeft size={18} /> Retour
                </button>
                <div className="flex items-center gap-3">
                    <button
                        onClick={exportPDF}
                        disabled={isExporting}
                        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-lg shadow-slate-900/20 transition-all"
                    >
                        <DownloadIcon size={16} /> PDF
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="p-2.5 bg-white text-slate-700 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
                    >
                        <Printer size={20} />
                    </button>
                </div>
            </div>

            {/* Invoice Container */}
            <div
                ref={invoiceRef}
                className="max-w-4xl mx-auto bg-white shadow-2xl rounded-[1.5rem] overflow-hidden border border-slate-100 print:shadow-none print:rounded-none print:border-none"
            >
                {/* Header Gradient Strip */}
                <div className={`h-3 w-full ${isPaid ? 'bg-blue-600' : 'bg-blue-600'}`} />

                <div className="p-10 sm:p-16">
                    {/* Top Section: Logo & Status */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-16">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="size-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-600/20">
                                    GA
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                                        GLOBAL AIR
                                    </h2>
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em] mt-1">
                                        L&apos;excellence au Sénégal
                                    </p>
                                </div>
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium leading-relaxed mt-2">
                                <p>Avenue Cheikh Anta Diop, Fenêtre Mermoz</p>
                                <p>Dakar, Sénégal</p>
                                <p className="font-bold text-slate-700">Tél: +221 77 783 27 98</p>
                                <p>Email: contact@globalairsn.com</p>
                            </div>
                        </div>

                        <div className="text-right flex flex-col items-end">
                            <div
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 font-black text-[10px] uppercase tracking-widest ${isPaid ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}
                            >
                                {isPaid ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                {isPaid ? 'Facture Payée' : 'À payer à la livraison'}
                            </div>
                            <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-2">
                                FACTURE
                            </h1>
                            <p className="text-slate-400 font-bold text-sm">
                                #INV-{order.id.slice(-6).toUpperCase()}
                            </p>
                            <p className="text-slate-900 font-black text-sm mt-1">{date}</p>
                        </div>
                    </div>

                    {/* Client & Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-16 border-y border-slate-100 py-10">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                Facturé à :
                            </p>
                            <div className="flex flex-col gap-1">
                                <p className="text-lg font-black text-slate-900">
                                    {order.address?.name || order.user?.name}
                                </p>
                                <p className="text-sm text-slate-600 font-medium">
                                    {order.address?.street}, {order.address?.city}
                                </p>
                                <p className="text-sm text-slate-600 font-bold mt-1">
                                    {order.address?.phone}
                                </p>
                                <p className="text-sm text-slate-400">{order.address?.email}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                    Détails Paiement :
                                </p>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-slate-600 font-bold">
                                        Mode:{' '}
                                        {order.paymentMethod === 'COD'
                                            ? 'Cash'
                                            : order.paymentMethod}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        Type: {isPickup ? 'Retrait' : 'Livraison'}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                <QRCodeSVG value={trackingUrl} size={80} level="H" />
                                <p className="text-[7px] font-black text-center mt-2 text-slate-400 uppercase tracking-widest">
                                    Suivi Commande
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-12 overflow-x-auto">
                        <table className="w-full min-w-[420px]">
                            <thead>
                                <tr className="border-b-2 border-slate-900">
                                    <th className="py-4 text-left text-[10px] font-black text-slate-900 uppercase tracking-widest">
                                        Description
                                    </th>
                                    <th className="py-4 text-center text-[10px] font-black text-slate-900 uppercase tracking-widest w-24">
                                        Qté
                                    </th>
                                    <th className="py-4 text-right text-[10px] font-black text-slate-900 uppercase tracking-widest w-32">
                                        Garantie
                                    </th>
                                    <th className="py-4 text-right text-[10px] font-black text-slate-900 uppercase tracking-widest w-32">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {order.orderItems?.map((item, index) => (
                                    <tr key={index}>
                                        <td className="py-6">
                                            <p className="font-black text-slate-900 text-sm">
                                                {item.product?.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                                                {item.product?.Category?.name || 'Électroménager'}
                                            </p>
                                        </td>
                                        <td className="py-6 text-center font-bold text-slate-700 text-sm">
                                            {item.quantity}
                                        </td>
                                        <td className="py-6 text-right font-bold text-slate-700 text-sm">
                                            {item.product?.guarantee || '6 mois'}
                                        </td>
                                        <td className="py-6 text-right font-black text-slate-900 text-sm">
                                            {(item.price * item.quantity).toLocaleString('fr-SN')} F
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary & Totals */}
                    <div className="flex flex-col sm:flex-row justify-between items-end gap-12">
                        <div className="flex-1 max-w-sm">
                            <div className="bg-blue-50 p-6 rounded-[1.5rem] border border-blue-100">
                                <div className="flex items-center gap-2 text-blue-700 mb-2">
                                    <ShieldCheck size={16} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">
                                        Garantie & Support
                                    </p>
                                </div>
                                <p className="text-[10px] text-blue-600/80 leading-relaxed font-medium italic">
                                    Ce document fait office de bon de garantie. Les durées de
                                    garantie sont indiquées pour chaque article ci-dessus. Support
                                    technique disponible au 77 783 27 98.
                                </p>
                            </div>
                        </div>

                        <div className="w-full sm:w-64 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-slate-400">Sous-total</span>
                                <span className="font-black text-slate-900">
                                    {(
                                        order.total -
                                        (order.deliveryFee || 0) +
                                        (order.discountAmount || 0)
                                    ).toLocaleString('fr-SN')}{' '}
                                    F
                                </span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="flex justify-between items-center text-sm text-blue-600">
                                    <span className="font-bold italic">Réduction</span>
                                    <span className="font-black">
                                        -{Number(order.discountAmount).toLocaleString('fr-SN')} F
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-slate-400">
                                    {isPickup ? 'Retrait' : 'Livraison'}
                                </span>
                                <span className="font-black text-slate-900">
                                    {isPickup ? (
                                        'En boutique'
                                    ) : order.deliveryFee > 0 ? (
                                        `${Number(order.deliveryFee).toLocaleString('fr-SN')} F`
                                    ) : deliveryFeePending ? (
                                        <span className="text-blue-600">À déterminer</span>
                                    ) : (
                                        'Gratuit'
                                    )}
                                </span>
                            </div>
                            <div className="h-px bg-slate-100 my-2" />
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                                    Total Final
                                </span>
                                <span
                                    className={`text-2xl font-black ${isPaid ? 'text-blue-600' : 'text-blue-600'} tracking-tighter`}
                                >
                                    {Number(order.total).toLocaleString('fr-SN')}{' '}
                                    <small className="text-[10px]">FCFA</small>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Stamp */}
                    <div className="mt-20 flex justify-between items-center border-t border-slate-100 pt-10">
                        <div className="text-[9px] text-slate-300 font-bold uppercase tracking-widest space-x-4">
                            <span>NINEA: 009876543</span>
                            <span>RC: SN.DKR.2026.B.1234</span>
                        </div>

                        {/* Professional Digital Stamp */}
                        <div className="relative size-32 flex items-center justify-center">
                            <div className="absolute inset-0 border-4 border-dashed border-blue-600/20 rounded-full" />
                            <div className="text-center rotate-[-15deg] border-4 border-blue-600/30 p-2 rounded-xl">
                                <p className="text-[8px] font-black text-blue-600/40 uppercase tracking-widest leading-none mb-1">
                                    Authentifié par
                                </p>
                                <p className="text-xs font-black text-blue-600/60 uppercase tracking-tighter leading-none">
                                    GLOBAL AIR
                                </p>
                                <p className="text-[7px] font-bold text-blue-600/40 mt-1 uppercase">
                                    {order.id.slice(0, 8)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
