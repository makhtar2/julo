'use client';
import React from 'react';
import { ZapIcon, TruckIcon, ShieldCheckIcon } from 'lucide-react';

export default function Banner() {
    const messages = [
        {
            text: "Bienvenue chez Global Air - L'Excellence pour votre Foyer au Sénégal",
            icon: ShieldCheckIcon,
        },
        {
            text: 'Profitez de nos offres exceptionnelles sur la Climatisation',
            icon: ZapIcon,
        },
        { text: 'Livraison rapide et Service Client dédié à votre satisfaction', icon: TruckIcon },
    ];

    return (
        <div className="bg-slate-900 text-white py-2.5 overflow-hidden relative">
            <div className="flex whitespace-nowrap gap-20 items-center px-10 animate-[marqueeScroll_30s_linear_infinite]">
                {[...messages, ...messages, ...messages, ...messages].map((msg, index) => (
                    <div key={index} className="flex items-center gap-3 shrink-0">
                        <msg.icon size={14} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                            {msg.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
