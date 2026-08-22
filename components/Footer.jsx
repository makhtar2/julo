'use client';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import { assets } from '@/assets/assets';
import Image from 'next/image';

const Footer = () => {
    return (
        <footer className="bg-[#1C1B1F] text-white border-t border-[#33302A] mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-16 border-b border-[#33302A]">
                    {/* Brand Column */}
                    <div className="lg:col-span-5">
                        <Link href="/" className="inline-flex items-center">
                            <Image
                                src={assets.julo_logo_white}
                                alt="JULO."
                                width={130}
                                height={45}
                                className="h-8 w-auto object-contain"
                            />
                        </Link>
                        <p className="mt-4 text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                            Votre destination de référence au Sénégal pour des smartphones,
                            ordinateurs, montres connectées et accessoires high-tech 100%
                            authentiques.
                        </p>
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2B2925] border border-[#3D3A34] text-[10px] text-zinc-300 font-semibold">
                            <span className="text-[#C59A63]">Co-fondateurs :</span>
                            <span>Babacar Diop Gaye &amp; Makhtar Wade</span>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {/* Categories */}
                        <div>
                            <h3 className="text-xs font-bold text-[#C59A63] uppercase tracking-widest mb-4">
                                PRODUITS
                            </h3>
                            <ul className="space-y-2.5 text-xs text-zinc-400">
                                <li>
                                    <Link
                                        href="/shop?category=Smartphones"
                                        className="hover:text-white transition-colors"
                                    >
                                        Smartphones
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/shop?category=Ordinateurs"
                                        className="hover:text-white transition-colors"
                                    >
                                        Ordinateurs &amp; PC
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/shop?category=Audio"
                                        className="hover:text-white transition-colors"
                                    >
                                        Audio &amp; Écouteurs
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/shop?category=Montres"
                                        className="hover:text-white transition-colors"
                                    >
                                        Montres Connectées
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Useful Links */}
                        <div>
                            <h3 className="text-xs font-bold text-[#C59A63] uppercase tracking-widest mb-4">
                                NAVIGATION
                            </h3>
                            <ul className="space-y-2.5 text-xs text-zinc-400">
                                <li>
                                    <Link
                                        href="/shop"
                                        className="hover:text-white transition-colors"
                                    >
                                        Boutique
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/about"
                                        className="hover:text-white transition-colors"
                                    >
                                        À Propos
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/contact"
                                        className="hover:text-white transition-colors"
                                    >
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/track"
                                        className="hover:text-white transition-colors"
                                    >
                                        Suivi de Commande
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="text-xs font-bold text-[#C59A63] uppercase tracking-widest mb-4">
                                CONTACT
                            </h3>
                            <ul className="space-y-2.5 text-xs text-zinc-400">
                                <li className="flex items-center gap-2">
                                    <Phone size={13} className="text-[#C59A63] shrink-0" />
                                    <a
                                        href="tel:+221754469097"
                                        className="hover:text-white transition-colors"
                                    >
                                        +221 75 446 90 97
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail size={13} className="text-[#C59A63] shrink-0" />
                                    <a
                                        href="mailto:contact@julo.sn"
                                        className="hover:text-white transition-colors"
                                    >
                                        contact@julo.sn
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <MapPin size={13} className="text-[#C59A63] shrink-0" />
                                    <span>Dakar &amp; Touba, Sénégal</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Payment Methods & Reassurance */}
                <div className="py-8 border-b border-[#33302A] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                            Paiements sécurisés :
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-1 rounded-md bg-[#1B6CA8]/20 border border-[#1B6CA8]/40 text-[#4BB3FF] text-[10px] font-black tracking-wider">
                                WAVE
                            </span>
                            <span className="px-2.5 py-1 rounded-md bg-[#FF6600]/20 border border-[#FF6600]/40 text-[#FF8533] text-[10px] font-black tracking-wider">
                                ORANGE MONEY
                            </span>
                            <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5]/10 border border-[#FAF8F5]/20 text-zinc-200 text-[10px] font-bold tracking-wider">
                                À LA LIVRAISON
                            </span>
                        </div>
                    </div>

                    <div className="text-center sm:text-right">
                        <p className="text-[11px] text-zinc-400">
                            Expédition rapide 24h/48h partout au Sénégal 🇸🇳
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500 font-medium">
                    <p>© 2026 JULO. TOUS DROITS RÉSERVÉS.</p>
                    <div className="flex items-center gap-6">
                        <Link
                            href="/mentions-legales"
                            className="hover:text-zinc-300 transition-colors"
                        >
                            Mentions Légales
                        </Link>
                        <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
                            Confidentialité
                        </Link>
                        <Link href="/terms" className="hover:text-zinc-300 transition-colors">
                            Conditions
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
