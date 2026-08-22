'use client';

import { Star, XIcon } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { addRating } from '@/app/actions/rating';

const RatingModal = ({ ratingModal, setRatingModal }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Veuillez sélectionner une note.');
            return;
        }
        if (review.length < 5) {
            toast.error('Veuillez écrire un court avis (min. 5 caractères).');
            return;
        }

        setSubmitting(true);
        try {
            const res = await addRating({
                productId: ratingModal.productId,
                rating,
                review,
            });

            if (res.success) {
                toast.success(res.success);
                setRatingModal(null);
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            toast.error('Une erreur est survenue.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={() => !submitting && setRatingModal(null)}
            />

            <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 sm:p-12 shadow-2xl animate-in zoom-in duration-300 text-center">
                {!submitting && (
                    <button
                        onClick={() => setRatingModal(null)}
                        className="absolute top-6 right-6 p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <XIcon size={20} />
                    </button>
                )}

                <h2 className="text-2xl sm:text-3xl font-black text-[#1C1B1F] tracking-tight mb-2">
                    Évaluer ce <span className="text-[#C59A63]">Produit</span>
                </h2>
                <p className="text-[#8C8275] text-xs sm:text-sm font-normal mb-8">
                    Votre avis compte pour la communauté JULO.
                </p>

                <div className="flex items-center justify-center gap-2 mb-8">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            size={30}
                            className={`cursor-pointer transition-all duration-200 hover:scale-110 ${rating > i ? 'text-[#C59A63] fill-[#C59A63]' : 'text-zinc-200'}`}
                            onClick={() => !submitting && setRating(i + 1)}
                        />
                    ))}
                </div>

                <textarea
                    disabled={submitting}
                    className="w-full p-4 bg-[#F5F2EB] border border-[#EAE6DF] focus:border-[#C59A63] focus:bg-white outline-none rounded-2xl text-xs font-medium transition-all mb-6 disabled:opacity-50 text-[#1C1B1F] resize-none"
                    placeholder="Partagez votre expérience avec ce produit..."
                    rows="4"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>

                <button
                    disabled={submitting}
                    onClick={handleSubmit}
                    className="w-full py-4 bg-[#1C1B1F] hover:bg-[#C59A63] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                    {submitting ? 'Envoi en cours...' : 'Publier mon avis'}
                </button>
            </div>
        </div>
    );
};

export default RatingModal;
