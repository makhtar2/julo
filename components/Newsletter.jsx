'use client';
import React from 'react';
import Title from './Title';
import toast from 'react-hot-toast';

const Newsletter = () => {
    const handleSubscribe = (e) => {
        e.preventDefault();
        toast.success('Merci ! Vous êtes désormais inscrit aux nouveautés et offres JULO.');
    };

    return (
        <div className="flex flex-col items-center mx-4 my-20 text-center max-w-3xl mx-auto">
            <Title
                title="NEWSLETTER JULO."
                description="Recevez en avant-première nos arrivages high-tech, réductions exclusives et inspirations de l'atelier de sérigraphie."
                visibleButton={false}
            />
            <form
                onSubmit={handleSubscribe}
                className="flex bg-zinc-100 text-sm p-1.5 rounded-2xl w-full max-w-lg my-4 border border-zinc-200 shadow-sm"
            >
                <input
                    className="flex-1 pl-4 bg-transparent outline-none text-zinc-900 placeholder:text-zinc-400 font-medium"
                    type="email"
                    placeholder="Votre adresse e-mail"
                    required
                />
                <button
                    type="submit"
                    className="bg-zinc-950 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-amber-500 hover:text-zinc-950 active:scale-95 transition-all shadow-sm"
                >
                    S&apos;inscrire
                </button>
            </form>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
                100% Respect de la vie privée • Désabonnement instantané
            </p>
        </div>
    );
};

export default Newsletter;
