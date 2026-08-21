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

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                    Évaluer ce <span className="text-blue-600">Produit</span>
                </h2>
                <p className="text-slate-400 text-sm font-medium mb-8">
                    Votre avis compte pour la communauté Global Air.
                </p>

                <div className="flex items-center justify-center gap-2 mb-8">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            size={32}
                            className={`cursor-pointer transition-all duration-300 hover:scale-110 ${rating > i ? 'text-blue-500 fill-blue-500' : 'text-slate-200'}`}
                            onClick={() => !submitting && setRating(i + 1)}
                        />
                    ))}
                </div>

                <textarea
                    disabled={submitting}
                    className="w-full p-4 bg-slate-50 border border-transparent focus:border-blue-400 focus:bg-white outline-none rounded-2xl text-sm font-medium transition-all mb-6 disabled:opacity-50"
                    placeholder="Partagez votre expérience avec ce produit..."
                    rows="4"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>

                <button
                    disabled={submitting}
                    onClick={handleSubmit}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black active:scale-95 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {submitting ? 'ENVOI EN COURS...' : 'ENVOYER MON AVIS'}
                </button>
            </div>
        </div>
    );
};

export default RatingModal;
