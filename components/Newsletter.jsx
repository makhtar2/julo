'use client';
import React from 'react';
import Title from './Title';
import toast from 'react-hot-toast';

const Newsletter = () => {
    const handleSubscribe = (e) => {
        e.preventDefault();
        toast.success('Merci ! Vous faites maintenant partie de la famille Global Air.');
    };

    return (
        <div className="flex flex-col items-center mx-4 my-24 text-center">
            <Title
                title="Inscrivez-vous à notre Newsletter"
                description="Abonnez-vous pour recevoir nos offres exclusives, les nouveautés et les conseils d'experts directement dans votre boîte mail chaque semaine."
                visibleButton={false}
            />
            <form
                onSubmit={handleSubscribe}
                className="flex bg-slate-50 text-sm p-1.5 rounded-full w-full max-w-xl my-6 border border-slate-100 shadow-sm"
            >
                <input
                    className="flex-1 pl-6 bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                    type="email"
                    placeholder="Votre adresse e-mail"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
                >
                    S&apos;abonner
                </button>
            </form>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-4">
                Garanti sans spam • Désabonnement en 1 clic
            </p>
        </div>
    );
};

export default Newsletter;
