'use client';
import { useCartStore } from '@/lib/store';
import { Minus, Plus } from 'lucide-react';

const Counter = ({ productId }) => {
    const cartItem = useCartStore((state) => state.cart.find((item) => item.id === productId));
    const updateQuantity = useCartStore((state) => state.updateQuantity);

    const increment = () => {
        if (cartItem) {
            updateQuantity(productId, cartItem.quantity + 1);
        }
    };

    const decrement = () => {
        if (cartItem) {
            updateQuantity(productId, cartItem.quantity - 1);
        }
    };

    if (!cartItem) return null;

    return (
        <div className="inline-flex items-center bg-slate-100 rounded-xl overflow-hidden">
            <button
                onClick={decrement}
                className="size-9 sm:size-10 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-red-500 active:scale-90 transition-all"
            >
                <Minus size={14} />
            </button>
            <span className="w-8 sm:w-10 text-center font-black text-sm text-slate-900 select-none">
                {cartItem.quantity}
            </span>
            <button
                onClick={increment}
                className="size-9 sm:size-10 flex items-center justify-center text-slate-500 hover:bg-[#10B981]/15 hover:text-[#10B981] active:scale-90 transition-all"
            >
                <Plus size={14} />
            </button>
        </div>
    );
};

export default Counter;
