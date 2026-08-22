'use client';
import React from 'react';
import toast from 'react-hot-toast';

const Newsletter = () => {
    const handleSubscribe = (e) => {
        e.preventDefault();
        toast.success(
            'Merci ! Vous êtes désormais inscrit aux nouveautés et offres exclusives JULO.'
        );
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 my-16 text-center">
            <div className="bg-white border border-[#EAE6DF] rounded-3xl p-8 sm:p-12 shadow-sm">
                <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="h-px w-8 bg-[#D6CEBE]" />
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#8C8275]">
                        NEWSLETTER EXCLUSIVE
                    </span>
                    <div className="h-px w-8 bg-[#D6CEBE]" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#1C1B1F] tracking-tight">
                    Restez Informé des Nouveaux Arrivages
                </h2>

                <p className="mt-2 text-sm text-[#8C8275] max-w-md mx-auto">
                    Recevez nos meilleures offres sur les smartphones, ordinateurs, montres et
                    accessoires high-tech certifiés au Sénégal.
                </p>

                <form
                    onSubmit={handleSubscribe}
                    className="flex flex-col sm:flex-row items-center gap-2 bg-[#F5F2EB] p-1.5 rounded-2xl sm:rounded-full w-full max-w-md mx-auto mt-6 border border-[#EAE6DF]"
                >
                    <input
                        className="flex-1 pl-4 pr-2 py-2.5 bg-transparent outline-none text-[#1C1B1F] placeholder:text-zinc-400 font-medium text-xs w-full"
                        type="email"
                        placeholder="Votre adresse e-mail"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-[#1C1B1F] hover:bg-[#C59A63] text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-sm shrink-0 w-full sm:w-auto"
                    >
                        S&apos;inscrire
                    </button>
                </form>

                <p className="text-[10px] font-semibold text-zinc-400 mt-3">
                    Garanti sans spam • Désabonnement en 1 clic
                </p>
            </div>
        </div>
    );
};

export default Newsletter;
