'use client';
import Link from 'next/link';
import {
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Phone,
    Mail,
    MapPin,
    ArrowUpRight,
} from 'lucide-react';
import { assets } from '@/assets/assets';
import Image from 'next/image';

const Footer = () => {
    return (
        <footer className="bg-zinc-950 text-white border-t border-zinc-800 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-16 border-b border-zinc-800">
                    {/* Brand Info */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <Image
                                src={assets.julo_logo_white}
                                alt="JULO."
                                width={130}
                                height={45}
                                className="h-8 w-auto object-contain"
                            />
                        </Link>
                        <p className="mt-4 text-zinc-400 font-medium text-xs sm:text-sm leading-relaxed max-w-sm">
                            Plateforme unifiée d&apos;équipements high-tech certifiés (
                            <strong className="text-white">julo.store</strong>) et atelier de
                            sérigraphie &amp; branding sur-mesure au Sénégal (
                            <strong className="text-amber-400">julo.prod</strong>).
                        </p>
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-bold">
                            <span>Co-fondateurs :</span>
                            <span className="text-zinc-200">
                                Babacar Diop Gaye &amp; Makhtar Wade
                            </span>
                        </div>
                    </div>

                    {/* Sub-Brands Columns */}
                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {/* Store Hub */}
                        <div>
                            <h3 className="font-blanka text-xs text-white uppercase tracking-widest mb-4 text-amber-400">
                                ⚡ JULO.STORE
                            </h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        href="/shop?category=telephones"
                                        className="text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                                    >
                                        Smartphones &amp; Mobiles
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/shop?category=ordinateurs"
                                        className="text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                                    >
                                        Ordinateurs &amp; PC
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/shop?category=accessoires"
                                        className="text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                                    >
                                        Accessoires &amp; Magsafe
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/shop"
                                        className="text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                                    >
                                        Tous les Produits
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Prod Hub */}
                        <div>
                            <h3 className="font-blanka text-xs text-white uppercase tracking-widest mb-4 text-amber-400">
                                🎨 JULO.PROD
                            </h3>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="/#studio"
                                        className="text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                                    >
                                        Sérigraphie Textile
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/#studio"
                                        className="text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                                    >
                                        T-shirts &amp; Hoodies Custom
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/#studio"
                                        className="text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                                    >
                                        Packs Goodies Entreprise
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://wa.me/221754469097?text=Bonjour%20Julo,%20je%20souhaite%20un%20devis"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
                                    >
                                        <span>Demander un Devis</span>
                                        <ArrowUpRight size={12} />
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact & Localisation */}
                        <div>
                            <h3 className="font-blanka text-xs text-white uppercase tracking-widest mb-4">
                                CONTACT
                            </h3>
                            <ul className="space-y-3 text-xs text-zinc-400">
                                <li className="flex items-center gap-2">
                                    <Phone size={14} className="text-amber-400 shrink-0" />
                                    <a
                                        href="tel:+221754469097"
                                        className="hover:text-white transition-colors"
                                    >
                                        +221 75 446 90 97
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail size={14} className="text-amber-400 shrink-0" />
                                    <a
                                        href="mailto:contact@julo.sn"
                                        className="hover:text-white transition-colors"
                                    >
                                        contact@julo.sn
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <MapPin size={14} className="text-amber-400 shrink-0" />
                                    <span>Dakar &amp; Touba, Sénégal</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-zinc-500 font-bold">
                    <p className="font-blanka tracking-wider">© 2026 JULO. TOUS DROITS RÉSERVÉS.</p>
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
