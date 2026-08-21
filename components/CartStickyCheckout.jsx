'use client';

import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CartStickyCheckout({
    itemCount,
    finalTotal,
    currency = 'FCFA',
    isLoading,
    onConfirm,
    deliveryNote,
}) {
    if (itemCount === 0) return null;

    return (
        <div className="lg:hidden fixed bottom-[4.25rem] left-0 right-0 z-[90] px-4 pointer-events-none">
            <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="pointer-events-auto max-w-lg mx-auto bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-[0_-8px_40px_-12px_rgba(15,23,42,0.25)] overflow-hidden"
            >
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50/80 border-b border-slate-100">
                    <span className="flex items-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        <ShieldCheck size={12} className="text-emerald-600" />
                        Paiement sécurisé
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="flex items-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        <Truck size={12} className="text-blue-600" />
                        {deliveryNote}
                    </span>
                </div>

                <div className="flex items-center gap-3 p-3">
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {itemCount} article{itemCount > 1 ? 's' : ''}
                        </p>
                        <p className="text-xl font-black text-slate-900 tracking-tight leading-none mt-0.5">
                            {finalTotal.toLocaleString('fr-SN')}
                            <span className="text-xs text-slate-400 ml-1">{currency}</span>
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="shrink-0 flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/25 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60"
                    >
                        {isLoading ? '…' : 'Commander'}
                        {!isLoading && <ArrowRight size={16} />}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
