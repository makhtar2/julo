'use client';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPin } from 'lucide-react';
import { assets } from '@/assets/assets';
import Image from 'next/image';

const Footer = () => {
    return (
        <footer className="bg-zinc-950 text-white border-t border-zinc-800 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-16 border-b border-zinc-800">
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
                            Votre destination au Sénégal pour des smartphones, ordinateurs et
                            accessoires électroniques de qualité, ainsi que pour vos travaux de
                            sérigraphie et d’infographie personnalisés.
                        </p>
                        <p className="mt-3 text-xs font-semibold text-zinc-500">
                            Co-fondateurs : Babacar Diop Gaye &amp; Makhtar Wade
                        </p>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {/* Categories */}
                        <div>
                            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
                                PRODUITS
                            </h3>
                            <ul className="space-y-2.5 text-xs text-zinc-400">
                                <li>
                                    <Link
                                        href="/shop?category=telephones"
                                        className="hover:text-white transition-colors"
                                    >
                                        Smartphones
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/shop?category=ordinateurs"
                                        className="hover:text-white transition-colors"
                                    >
                                        Ordinateurs &amp; PC
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/shop?category=accessoires"
                                        className="hover:text-white transition-colors"
                                    >
                                        Accessoires
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/shop?category=serigraphie"
                                        className="hover:text-white transition-colors"
                                    >
                                        Sérigraphie
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Useful Links */}
                        <div>
                            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
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
                            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
                                CONTACT
                            </h3>
                            <ul className="space-y-2.5 text-xs text-zinc-400">
                                <li className="flex items-center gap-2">
                                    <Phone size={13} className="text-amber-400 shrink-0" />
                                    <a
                                        href="tel:+221754469097"
                                        className="hover:text-white transition-colors"
                                    >
                                        +221 75 446 90 97
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail size={13} className="text-amber-400 shrink-0" />
                                    <a
                                        href="mailto:contact@julo.sn"
                                        className="hover:text-white transition-colors"
                                    >
                                        contact@julo.sn
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <MapPin size={13} className="text-amber-400 shrink-0" />
                                    <span>Dakar &amp; Touba, Sénégal</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500 font-medium">
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
