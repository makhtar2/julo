'use client';

import { MapPin, Truck, Store, Phone, Clock, ExternalLink } from 'lucide-react';
import { STORE_LOCATION, DELIVERY_INFO_SN, PICKUP_INFO_SN } from '@/lib/storeLocation';

/** Bandeau explicatif livraison / retrait — visible sur le panier */
export function CartFulfillmentBanner() {
    return (
        <div className="mb-5 sm:mb-8 rounded-2xl border border-[#10B981]/20 bg-[#F0FDF4]/50 p-4 sm:p-5 shadow-xs">
            <p className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.2em] mb-1">
                Au Sénégal
            </p>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-3">
                Livraison ou retrait en boutique
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
                <FulfillmentCard
                    icon={<Truck size={18} className="text-[#10B981]" />}
                    title={DELIVERY_INFO_SN.title}
                    lines={DELIVERY_INFO_SN.lines.slice(0, 2)}
                    highlight={`Dakar : ${DELIVERY_INFO_SN.dakarFeeLabel}`}
                />
                <PickupStoreCard compact />
            </div>
        </div>
    );
}

/** Encart selon le mode choisi dans le checkout */
export function CheckoutModeInfo({ mode }) {
    if (mode === 'DELIVERY') {
        return (
            <div className="rounded-2xl border border-[#10B981]/20 bg-[#F0FDF4]/60 p-4 space-y-2">
                <div className="flex items-center gap-2">
                    <Truck size={18} className="text-[#10B981] shrink-0" />
                    <p className="font-black text-sm text-slate-900">{DELIVERY_INFO_SN.title}</p>
                </div>
                <ul className="space-y-1.5 pl-1">
                    {DELIVERY_INFO_SN.lines.map((line) => (
                        <li
                            key={line}
                            className="text-xs text-slate-600 font-medium leading-relaxed flex gap-2"
                        >
                            <span className="text-[#10B981] shrink-0">•</span>
                            {line}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return <PickupStoreCard />;
}

function FulfillmentCard({ icon, title, lines, highlight }) {
    return (
        <div className="rounded-xl bg-white border border-slate-100 p-3.5">
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <p className="font-black text-xs text-slate-900 uppercase tracking-wide">{title}</p>
            </div>
            <ul className="space-y-1">
                {lines.map((line) => (
                    <li key={line} className="text-[11px] text-slate-500 font-medium leading-snug">
                        {line}
                    </li>
                ))}
            </ul>
            {highlight && (
                <p className="mt-2 text-[10px] font-black text-[#10B981] uppercase tracking-widest">
                    {highlight}
                </p>
            )}
        </div>
    );
}

function PickupStoreCard({ compact = false }) {
    return (
        <div
            className={`rounded-xl bg-white border border-slate-100 ${compact ? 'p-3.5' : 'p-4 mt-4'}`}
        >
            <div className="flex items-start gap-3">
                <div className="size-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                    <Store size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-slate-900">{PICKUP_INFO_SN.title}</p>
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mt-0.5">
                        Retrait gratuit
                    </p>
                    {!compact && (
                        <ul className="mt-2 space-y-1">
                            {PICKUP_INFO_SN.lines.map((line) => (
                                <li
                                    key={line}
                                    className="text-xs text-slate-600 font-medium leading-relaxed"
                                >
                                    {line}
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="font-black text-xs text-slate-900">{STORE_LOCATION.name}</p>
                        <p className="text-[11px] text-slate-600 font-semibold mt-1 leading-relaxed flex gap-1.5">
                            <MapPin size={14} className="shrink-0 text-[#10B981] mt-0.5" />
                            {STORE_LOCATION.fullAddress}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium mt-2 flex items-center gap-1.5">
                            <Phone size={13} className="text-slate-400" />
                            {STORE_LOCATION.phoneDisplay}
                        </p>
                        {!compact && (
                            <p className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                                <Clock size={13} className="text-slate-400" />
                                {STORE_LOCATION.hours}
                            </p>
                        )}
                        <a
                            href={STORE_LOCATION.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-black text-[#10B981] uppercase tracking-widest hover:text-[#059669]"
                        >
                            Ouvrir dans Google Maps
                            <ExternalLink size={12} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
