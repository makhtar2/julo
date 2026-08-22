'use client';
import React from 'react';
import { ZapIcon, TruckIcon, ShieldCheckIcon } from 'lucide-react';

export default function Banner() {
    const messages = [
        {
            text: 'JULO.STORE — Smartphones, Ordinateurs & Accessoires Originaux au Sénégal',
            icon: ShieldCheckIcon,
        },
        {
            text: 'Garantie Constructeur & Service Après-Vente Réactif sur Tous Vos Appareils',
            icon: ZapIcon,
        },
        {
            text: 'Livraison Express Dakar, Thiès, Touba & Partout au Sénégal • Paiement Wave / OM',
            icon: TruckIcon,
        },
    ];

    return (
        <div className="hidden sm:block bg-zinc-950 text-white py-2 overflow-hidden relative border-b border-zinc-800">
            <div className="flex whitespace-nowrap gap-16 items-center px-10 animate-[marqueeScroll_30s_linear_infinite]">
                {[...messages, ...messages, ...messages, ...messages].map((msg, index) => (
                    <div key={index} className="flex items-center gap-2.5 shrink-0">
                        <msg.icon size={13} className="text-amber-400" />
                        <span className="text-[10px] font-bold tracking-wider text-zinc-300">
                            {msg.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
