'use client';
import Image from 'next/image';
import { DotIcon, FileTextIcon, DownloadIcon } from 'lucide-react';
import Rating from './Rating';
import { useState } from 'react';
import RatingModal from './RatingModal';
import { toast } from 'react-hot-toast';
import OrderStatusProgress from './OrderStatusProgress';
import { Order } from '@/types';
import { formatCurrency, getOrderStatusLabel } from '@/lib/utils';

const OrderItem = ({ order }: { order: Order }) => {
    const currency = 'FCFA';
    const [ratingModal, setRatingModal] = useState(null);

    const handleDownloadInvoice = () => {
        window.open(`/invoice/${order.id}`, '_blank');
    };

    return (
        <>
            {/* Desktop View Row */}
            <tr className="hidden md:table-row bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-xl hover:shadow-slate-200/40 transition-all group">
                <td className="text-left py-8 px-8 rounded-l-[2rem]">
                    <div className="flex flex-col gap-6">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-6">
                                <div className="size-20 bg-slate-50 flex items-center justify-center rounded-2xl border border-slate-100 p-3 group-hover:scale-105 transition-transform duration-500">
                                    <Image
                                        className="w-full h-auto object-contain drop-shadow-sm"
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        width={60}
                                        height={60}
                                    />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="font-black text-slate-800 text-base leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                                        {item.product.name}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <p className="font-black text-blue-600 text-sm">
                                            {formatCurrency(item.price)}
                                        </p>
                                        <span className="text-slate-300 font-bold">|</span>
                                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                                            Qté : {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-black mt-2 uppercase tracking-[0.2em]">
                                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>

                                    {order.status === 'DELIVERED' && (
                                        <button
                                            onClick={() =>
                                                setRatingModal({
                                                    orderId: order.id,
                                                    productId: item.product.id,
                                                })
                                            }
                                            className="w-fit text-blue-600 text-[10px] font-black hover:text-blue-700 mt-3 flex items-center gap-2 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-all"
                                        >
                                            Évaluer le produit
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </td>

                <td className="text-center py-8">
                    <span className="text-lg font-black text-slate-800">
                        {formatCurrency(order.total)}
                    </span>
                </td>

                <td className="text-left py-8 px-4">
                    <div className="flex flex-col gap-4">
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 max-w-[200px]">
                            <p className="font-black text-slate-800 text-xs mb-1 uppercase tracking-tight truncate">
                                {order.address.name}
                            </p>
                            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 font-medium">
                                {order.address.street}, {order.address.city}
                            </p>
                            <p className="text-[11px] font-black text-slate-400 mt-2">
                                {order.address.phone}
                            </p>
                        </div>
                        <div className="w-[200px]">
                            <OrderStatusProgress currentStatus={order.status} />
                        </div>
                    </div>
                </td>

                <td className="text-right py-8 px-8 rounded-r-[2rem]">
                    <div className="flex flex-col items-end gap-3">
                        <div
                            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 font-black text-[9px] uppercase tracking-[0.2em] border ${
                                order.status === 'DELIVERED'
                                    ? 'text-blue-600 bg-blue-50 border-blue-100 shadow-sm shadow-blue-600/5'
                                    : 'text-slate-500 bg-slate-50 border-slate-100'
                            }`}
                        >
                            <div
                                className={`size-2 rounded-full ${order.status === 'DELIVERED' ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`}
                            />
                            {getOrderStatusLabel(order.status)}
                        </div>

                        {order.status !== 'ORDER_PLACED' ? (
                            <button
                                onClick={handleDownloadInvoice}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                            >
                                <DownloadIcon size={12} />
                                Facture PDF
                            </button>
                        ) : (
                            <div className="flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-400 rounded-xl font-bold text-[9px] uppercase tracking-[0.1em] cursor-not-allowed">
                                En attente de validation
                            </div>
                        )}
                    </div>
                </td>
            </tr>

            {/* Mobile Card View */}
            <div className="md:hidden bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-xl shadow-slate-200/30 overflow-hidden">
                <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-50">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                            Commande nÂ°
                        </p>
                        <h4 className="text-slate-900 font-black text-lg tracking-tight">
                            #{order.id.slice(-6).toUpperCase()}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                    <div
                        className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm ${
                            order.status === 'DELIVERED'
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-slate-900 text-white border-slate-900'
                        }`}
                    >
                        {getOrderStatusLabel(order.status)}
                    </div>
                </div>

                <div className="space-y-6 mb-8">
                    {order.orderItems.map((item, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="size-20 bg-slate-50 rounded-2xl border border-slate-100 p-3 shrink-0 flex items-center justify-center">
                                <Image
                                    className="w-full h-auto object-contain"
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    width={50}
                                    height={50}
                                />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <h5 className="font-black text-slate-800 text-sm leading-tight mb-1 truncate">
                                    {item.product.name}
                                </h5>
                                <div className="flex items-center gap-3">
                                    <p className="font-black text-blue-600 text-sm">
                                        {formatCurrency(item.price)}
                                    </p>
                                    <span className="text-slate-200 font-bold">|</span>
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                        Qté : {item.quantity}
                                    </p>
                                </div>
                                {order.status === 'DELIVERED' && (
                                    <button
                                        onClick={() =>
                                            setRatingModal({
                                                orderId: order.id,
                                                productId: item.product.id,
                                            })
                                        }
                                        className="text-blue-600 text-[10px] font-black mt-2 text-left uppercase tracking-widest"
                                    >
                                        Évaluer le produit
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mb-8 px-2">
                    <OrderStatusProgress currentStatus={order.status} />
                </div>

                <div className="flex flex-col gap-3 pt-6 border-t border-slate-50">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                Total
                            </p>
                            <p className="text-lg font-black text-slate-900">
                                {formatCurrency(order.total)}
                            </p>
                        </div>
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                Livré à
                            </p>
                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight truncate">
                                {order.address.city}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1">
                                {order.address.phone}
                            </p>
                        </div>
                    </div>
                    {order.status !== 'ORDER_PLACED' ? (
                        <button
                            onClick={handleDownloadInvoice}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                        >
                            <DownloadIcon size={14} />
                            TÉLÉCHARGER LA FACTURE PDF
                        </button>
                    ) : (
                        <div className="w-full flex items-center justify-center gap-3 py-4 bg-slate-100 text-slate-400 rounded-2xl font-bold text-[10px] uppercase tracking-[0.1em] cursor-not-allowed">
                            Facture disponible après validation
                        </div>
                    )}
                </div>
            </div>

            {ratingModal && (
                <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />
            )}
        </>
    );
};

export default OrderItem;
