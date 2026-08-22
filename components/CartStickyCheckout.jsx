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
                className="pointer-events-auto max-w-md mx-auto"
            >
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-3.5 px-5 rounded-2xl font-bold text-sm shadow-xl shadow-[#10B981]/30 active:scale-[0.98] transition-all flex items-center justify-between gap-3 disabled:opacity-60"
                >
                    <div className="flex items-center gap-2 text-left">
                        <span className="font-extrabold text-sm">
                            {isLoading ? 'Traitement en cours…' : 'Go To Checkout'}
                        </span>
                        <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                            {itemCount}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-black text-sm">
                            {finalTotal.toLocaleString('fr-SN')} {currency}
                        </span>
                        <ArrowRight size={16} strokeWidth={2.5} />
                    </div>
                </button>
            </motion.div>
        </div>
    );
}
