'use client';
import React, { useState } from 'react';
import Title from '@/components/Title';
import { Mail, Phone, MapPin, Send, MessageCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Merci ! Votre message a bien été transmis à l’équipe JULO.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    const handleWhatsAppClick = () => {
        const phoneNumber = '221754469097';
        const message =
            'Bonjour JULO, je souhaite avoir des renseignements sur vos produits ou services.';
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="max-w-2xl mb-12">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-px w-8 bg-[#D6CEBE]" />
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#8C8275]">
                            SERVICE CLIENT &amp; SHOWROOM
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-[#1C1B1F] tracking-tight">
                        Contactez l&apos;Équipe JULO.
                    </h1>
                    <p className="mt-3 text-[#5A564F] text-sm sm:text-base">
                        Une question sur nos smartphones, ordinateurs ou accessoires ? Notre équipe
                        vous répond immédiatement.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left: Contact Form */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-[#EAE6DF] shadow-xs">
                        <h2 className="text-xl font-black text-[#1C1B1F] mb-6">
                            Envoyez-nous un Message
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-[#8C8275] uppercase tracking-wider mb-1.5">
                                        Nom &amp; Prénom
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Amadou Diallo"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        className="w-full bg-[#F5F2EB] border border-[#EAE6DF] rounded-xl px-4 py-3 text-xs font-semibold text-[#1C1B1F] outline-none focus:border-[#C59A63]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#8C8275] uppercase tracking-wider mb-1.5">
                                        Adresse E-mail
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="amadou@example.com"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        className="w-full bg-[#F5F2EB] border border-[#EAE6DF] rounded-xl px-4 py-3 text-xs font-semibold text-[#1C1B1F] outline-none focus:border-[#C59A63]"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-[#8C8275] uppercase tracking-wider mb-1.5">
                                        Téléphone (WhatsApp)
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+221 77 000 00 00"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({ ...formData, phone: e.target.value })
                                        }
                                        className="w-full bg-[#F5F2EB] border border-[#EAE6DF] rounded-xl px-4 py-3 text-xs font-semibold text-[#1C1B1F] outline-none focus:border-[#C59A63]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#8C8275] uppercase tracking-wider mb-1.5">
                                        Objet de la demande
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Devis Sérigraphie / Info Produit"
                                        value={formData.subject}
                                        onChange={(e) =>
                                            setFormData({ ...formData, subject: e.target.value })
                                        }
                                        className="w-full bg-[#F5F2EB] border border-[#EAE6DF] rounded-xl px-4 py-3 text-xs font-semibold text-[#1C1B1F] outline-none focus:border-[#C59A63]"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-[#8C8275] uppercase tracking-wider mb-1.5">
                                    Votre Message
                                </label>
                                <textarea
                                    rows="5"
                                    placeholder="Détaillez votre demande ou votre projet..."
                                    value={formData.message}
                                    onChange={(e) =>
                                        setFormData({ ...formData, message: e.target.value })
                                    }
                                    className="w-full bg-[#F5F2EB] border border-[#EAE6DF] rounded-xl px-4 py-3 text-xs font-semibold text-[#1C1B1F] outline-none focus:border-[#C59A63] resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-[#1C1B1F] hover:bg-[#C59A63] text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center gap-2"
                            >
                                <Send size={14} />
                                <span>Envoyer le Message</span>
                            </button>
                        </form>
                    </div>

                    {/* Right: Contact Cards */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* WhatsApp Direct Card */}
                        <div className="bg-[#1C1B1F] text-white rounded-3xl p-8 border border-[#33302A] shadow-sm relative overflow-hidden">
                            <div className="absolute -right-6 -bottom-6 size-44 rounded-full border border-[#D4AF37]/20 pointer-events-none" />
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#25D366]/20 text-[#25D366] text-[10px] font-bold uppercase tracking-wider mb-4">
                                <span className="size-2 rounded-full bg-[#25D366] animate-pulse" />
                                Support Instantané
                            </span>
                            <h3 className="text-xl font-bold mb-2">
                                Échangez directement sur WhatsApp
                            </h3>
                            <p className="text-xs text-zinc-400 font-normal leading-relaxed mb-6">
                                Conseils d&apos;achat en direct, vérification de stock ou devis de
                                sérigraphie en temps réel.
                            </p>
                            <button
                                onClick={handleWhatsAppClick}
                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                            >
                                <MessageCircle size={16} />
                                <span>Ouvrir WhatsApp (+221 75 446 90 97)</span>
                            </button>
                        </div>

                        {/* Direct Info Card */}
                        <div className="bg-white rounded-3xl p-8 border border-[#EAE6DF] shadow-xs space-y-6">
                            <h3 className="text-lg font-black text-[#1C1B1F]">Nos Coordonnées</h3>

                            <div className="flex items-start gap-4 text-xs">
                                <div className="size-10 rounded-xl bg-[#F5F2EB] flex items-center justify-center text-[#C59A63] shrink-0">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-[#1C1B1F]">
                                        Téléphone &amp; WhatsApp
                                    </p>
                                    <p className="text-[#5A564F] mt-0.5">+221 75 446 90 97</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 text-xs pt-4 border-t border-[#EAE6DF]">
                                <div className="size-10 rounded-xl bg-[#F5F2EB] flex items-center justify-center text-[#C59A63] shrink-0">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-[#1C1B1F]">
                                        Courrier Électronique
                                    </p>
                                    <p className="text-[#5A564F] mt-0.5">contact@julo.sn</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 text-xs pt-4 border-t border-[#EAE6DF]">
                                <div className="size-10 rounded-xl bg-[#F5F2EB] flex items-center justify-center text-[#C59A63] shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-[#1C1B1F]">Localisation</p>
                                    <p className="text-[#5A564F] mt-0.5">
                                        Dakar &amp; Touba, Sénégal
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
