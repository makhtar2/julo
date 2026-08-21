'use client';
import React, { useState } from 'react';
import Title from '@/components/Title';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Merci ! Votre message a été envoyé avec succès.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleWhatsAppClick = () => {
        const phoneNumber = '221771234567';
        const message = "Bonjour Global Air, j'ai une question concernant vos produits.";
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto my-12">
                <Title
                    title="Contactez-nous"
                    description="Notre équipe basée à Dakar est là pour vous accompagner dans vos choix d'équipement."
                    visibleButton={false}
                />

                <div className="flex flex-col lg:flex-row gap-12 mt-16">
                    {/* Left: Contact Form */}
                    <div className="flex-1">
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-6 text-slate-600"
                        >
                            <div className="flex flex-col sm:flex-row gap-6">
                                <input
                                    type="text"
                                    placeholder="Nom Complet"
                                    className="p-3 px-4 border border-slate-200 outline-none rounded w-full focus:border-slate-400 transition"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="p-3 px-4 border border-slate-200 outline-none rounded w-full focus:border-slate-400 transition"
                                    required
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Sujet"
                                className="p-3 px-4 border border-slate-200 outline-none rounded w-full focus:border-slate-400 transition"
                                required
                            />
                            <textarea
                                rows="6"
                                placeholder="Votre Message"
                                className="p-3 px-4 border border-slate-200 outline-none rounded w-full focus:border-slate-400 transition resize-none"
                                required
                            ></textarea>
                            <button className="bg-slate-800 text-white text-sm font-medium py-3.5 rounded hover:bg-slate-900 active:scale-95 transition-all w-full sm:w-max px-12">
                                ENVOYER
                            </button>
                        </form>
                    </div>

                    {/* Right: Info Cards */}
                    <div className="lg:w-[400px] flex flex-col gap-6">
                        <div className="border border-slate-200 p-8 rounded-lg flex flex-col gap-4">
                            <h3 className="text-xl font-semibold text-slate-800">
                                Nos Coordonnées
                            </h3>

                            <div className="flex items-center gap-4 text-slate-600">
                                <Phone size={20} className="text-blue-600" />
                                <div>
                                    <p className="text-sm font-bold">Téléphone</p>
                                    <p className="text-sm">+221 77 783 27 98</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-slate-600 border-t border-slate-100 pt-4">
                                <Mail size={20} className="text-blue-600" />
                                <div>
                                    <p className="text-sm font-bold">Email</p>
                                    <p className="text-sm">contact@globalairsn.com</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-slate-600 border-t border-slate-100 pt-4">
                                <MapPin size={20} className="text-blue-600" />
                                <div>
                                    <p className="text-sm font-bold">Showroom</p>
                                    <p className="text-sm">Avenue Cheikh Anta Diop, Dakar</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-lg flex flex-col gap-4">
                            <h3 className="text-lg font-semibold text-slate-800">
                                Horaires & Support
                            </h3>
                            <p className="text-sm text-slate-600">
                                <b>Lundi - Samedi :</b> 08h30 - 19h00
                                <br />
                                <b>Dimanche :</b> Fermé
                            </p>
                            <p className="text-sm text-slate-500 italic border-t border-slate-200 pt-4">
                                &quot;Support technique local et SAV réactif pour tous vos
                                équipements.&quot;
                            </p>
                            <button
                                onClick={handleWhatsAppClick}
                                className="mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded font-bold text-sm hover:bg-blue-700 transition-all"
                            >
                                <MessageCircle size={18} fill="currentColor" />
                                WHATSAPP
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
