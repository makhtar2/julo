'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RefreshCcw, Home } from 'lucide-react';

export default function Error({ error, reset }) {
    // Généré une seule fois au montage (pas pendant le rendu) pour rester une fonction pure.
    const [randomErrorId] = useState(() => Math.random().toString(36).substring(7).toUpperCase());
    const errorId = error?.digest || randomErrorId;

    useEffect(() => {
        // Log the error to an error reporting service like Sentry or LogRocket
        console.error('Captured Error:', error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
            <div className="size-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-red-500/10">
                <RefreshCcw size={40} />
            </div>

            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
                Oups ! Une erreur est survenue
            </h1>
            <p className="text-slate-500 font-medium max-w-md mb-10 leading-relaxed">
                Nous n&apos;avons pas pu charger cette page. Pas d&apos;inquiétude, nos techniciens
                ont été prévenus.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => reset()}
                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCcw size={16} /> Réessayer
                </button>

                <Link
                    href="/"
                    className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center gap-2"
                >
                    <Home size={16} /> Retour à l&apos;accueil
                </Link>
            </div>

            <p className="mt-12 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                ID Erreur : {errorId}
            </p>
        </div>
    );
}
