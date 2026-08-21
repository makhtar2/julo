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
    ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { assets } from '@/assets/assets';
import Image from 'next/image';

const Footer = () => {
    const linkSections = [
        {
            title: 'PRODUITS & SERVICES',
            links: [
                { text: 'Accessoires Téléphone', path: '/shop?category=accessoires' },
                { text: 'Smartphones & Téléphones', path: '/shop?category=telephones' },
                { text: 'Ordinateurs & PC', path: '/shop?category=ordinateurs' },
                { text: 'Sérigraphie & Infographie', path: '/shop?category=serigraphie' },
            ],
        },
        {
            title: 'LIENS UTILES',
            links: [
                { text: 'Boutique', path: '/shop' },
                { text: 'À propos de Julo', path: '/about' },
                { text: 'Contactez-nous', path: '/contact' },
                { text: 'Mentions Légales', path: '/mentions-legales' },
                { text: 'Conditions Générales', path: '/terms' },
            ],
        },
        {
            title: 'CONTACT & SHOWROOM',
            links: [
                { text: '+221 75 446 90 97', path: 'tel:+221754469097', icon: Phone },
                {
                    text: 'contact@julo.sn',
                    path: 'mailto:contact@julo.sn',
                    icon: Mail,
                },
                { text: 'Dakar & Touba, Sénégal', path: '/contact', icon: MapPin },
            ],
        },
    ];

    const socialIcons = [
        {
            icon: Facebook,
            link: 'https://facebook.com',
            color: 'hover:text-blue-600',
        },
        {
            icon: Instagram,
            link: 'https://instagram.com',
            color: 'hover:text-pink-600',
        },
        { icon: Twitter, link: 'https://twitter.com', color: 'hover:text-blue-400' },
        {
            icon: Linkedin,
            link: 'https://linkedin.com',
            color: 'hover:text-blue-700',
        },
    ];

    return (
        <footer className="bg-white border-t border-slate-100 mt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 py-16">
                    {/* Brand Info */}
                    <div className="lg:col-span-5">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
                                JU<span className="text-amber-500">LO</span>
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-widest bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full">
                                PROD
                            </span>
                        </Link>
                        <p className="mt-6 text-slate-700 font-medium text-sm leading-relaxed max-w-sm">
                            Votre destination complète pour l’achat de produits électroniques de qualité et pour vos besoins de sérigraphie et d’infographie sur-mesure au Sénégal.
                        </p>
                        <p className="mt-3 text-xs font-bold text-slate-500">
                            Co-fondateurs : Babacar Diop Gaye & Makhtar Wade
                        </p>
                        <div className="flex items-center gap-4 mt-8">
                            {socialIcons.map((item, i) => (
                                <a
                                    href={item.link}
                                    key={i}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group flex items-center justify-center size-10 bg-slate-50 rounded-xl transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 ${item.color}`}
                                >
                                    <span className="sr-only">Réseau social</span>
                                    <item.icon size={18} aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {linkSections.map((section, index) => (
                            <div key={index}>
                                <h3 className="text-[10px] font-black text-slate-900 mb-6 uppercase tracking-widest">
                                    {section.title}
                                </h3>
                                <ul className="space-y-4">
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <Link
                                                href={link.path}
                                                className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-amber-600 transition-all group"
                                            >
                                                {link.icon && (
                                                    <link.icon
                                                        size={14}
                                                        className="text-slate-600 group-hover:text-amber-600 transition-colors"
                                                    />
                                                )}
                                                {link.text}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="py-10 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <p className="text-[11px] font-black text-slate-700 tracking-tight uppercase tracking-[0.2em]">
                        © 2026 Julo. TOUS DROITS RÉSERVÉS.
                    </p>
                    <div className="flex items-center gap-8 text-[11px] font-black text-slate-700 uppercase tracking-widest">
                        <Link
                            href="/mentions-legales"
                            className="hover:text-amber-600 transition-colors"
                        >
                            Mentions Légales
                        </Link>
                        <Link href="/privacy" className="hover:text-amber-600 transition-colors">
                            Confidentialité
                        </Link>
                        <Link href="/terms" className="hover:text-amber-600 transition-colors">
                            Conditions
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
