'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    User,
    Mail,
    Phone,
    Calendar,
    Package,
    LogOut,
    ChevronRight,
    Settings,
    ShieldCheck,
    MapPin,
    Plus,
    Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { logout } from '@/app/actions/auth';
import { getUserAddresses, addAddress, deleteAddress } from '@/app/actions/address';
import Loading from '@/components/Loading';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AddressModal from '@/components/AddressModal';

const supabase = createClient();

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [showAddressModal, setShowAddressModal] = useState(false);

    const fetchAddresses = async () => {
        const res = await getUserAddresses();
        if (res.addresses) setAddresses(res.addresses);
    };

    useEffect(() => {
        const checkUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);
            await fetchAddresses();
            setLoading(false);
        };
        checkUser();
    }, [router]);

    const handleAddAddress = async (addressData) => {
        const res = await addAddress(addressData);
        if (res.success) {
            toast.success('Adresse ajoutée !');
            fetchAddresses();
        } else {
            toast.error(res.error);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!confirm('Supprimer cette adresse ?')) return;
        const res = await deleteAddress(id);
        if (res.success) {
            toast.success('Adresse supprimée');
            fetchAddresses();
        } else {
            toast.error(res.error);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Déconnexion réussie');
            router.push('/');
            router.refresh();
        } catch (error) {
            toast.error('Erreur lors de la déconnexion');
        }
    };

    if (loading) return <Loading />;

    const profileItems = [
        {
            icon: <Package size={20} />,
            label: 'Mes Commandes',
            desc: 'Suivre vos achats et factures',
            href: '/orders',
            color: 'text-[#10B981]',
            bg: 'bg-[#F0FDF4]',
        },
        {
            icon: <ShieldCheck size={20} />,
            label: 'Sécurité',
            desc: 'Changer votre mot de passe',
            href: '#',
            color: 'text-[#10B981]',
            bg: 'bg-[#F0FDF4]',
        },
        {
            icon: <Settings size={20} />,
            label: 'Paramètres',
            desc: 'Gérer vos préférences de compte',
            href: '#',
            color: 'text-slate-600',
            bg: 'bg-slate-50',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden mb-8"
                >
                    <div className="bg-[#1C1B1F] h-32 relative">
                        <div className="absolute -bottom-12 left-8 sm:left-12">
                            <div className="size-24 sm:size-32 bg-[#10B981] rounded-[2rem] border-4 border-white flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-lg shadow-[#10B981]/20">
                                {user.user_metadata?.full_name?.charAt(0) ||
                                    user.email?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 pb-8 px-8 sm:px-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                {user.user_metadata?.full_name || 'Utilisateur'}
                            </h1>
                            <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                                <Mail size={16} className="text-slate-400" />
                                {user.email}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all group"
                        >
                            <LogOut size={16} />
                            Déconnexion
                        </button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Info Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/30">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                                Détails du compte
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="size-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                                            Nom complet
                                        </p>
                                        <p className="text-sm font-black text-slate-800">
                                            {user.user_metadata?.full_name || 'Non renseigné'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="size-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                                            Téléphone
                                        </p>
                                        <p className="text-sm font-black text-slate-800">
                                            {user.user_metadata?.phone || 'Non renseigné'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="size-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                                            Membre depuis
                                        </p>
                                        <p className="text-sm font-black text-slate-800">
                                            {new Date(user.created_at).toLocaleDateString('fr-FR', {
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Area */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2 space-y-6"
                    >
                        {/* Address Section */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 bg-[#F0FDF4] text-[#10B981] rounded-xl flex items-center justify-center">
                                        <MapPin size={20} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                        Mes Adresses
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowAddressModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#1C1B1F] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#10B981] transition-all shadow-lg shadow-black/10 active:scale-95"
                                >
                                    <Plus size={14} />
                                    Ajouter
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <AnimatePresence mode="popLayout">
                                    {addresses.length > 0 ? (
                                        addresses.map((addr) => (
                                            <motion.div
                                                layout
                                                key={addr.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group relative"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-black text-slate-900 text-sm mb-1">
                                                            {addr.name}
                                                        </p>
                                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                                            {addr.street}, {addr.city}
                                                            <br />
                                                            {addr.state}, {addr.country}
                                                            <br />
                                                            <span className="text-slate-400">
                                                                {addr.phone}
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteAddress(addr.id)}
                                                        className="size-8 bg-white text-slate-300 hover:text-red-500 rounded-lg border border-slate-100 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                                            <p className="text-sm font-bold text-slate-400">
                                                Aucune adresse enregistrée
                                            </p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {profileItems.map((item, index) => (
                                <Link key={index} href={item.href} className="block group">
                                    <div className="h-full bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/30 flex items-center justify-between hover:border-[#10B981]/30 hover:shadow-[#10B981]/5 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`size-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                                            >
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 tracking-tight">
                                                    {item.label}
                                                </h4>
                                                <p className="text-[10px] text-slate-500 font-medium">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight
                                            size={16}
                                            className="text-slate-300 group-hover:text-[#10B981] group-hover:translate-x-1 transition-all"
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="bg-[#1C1B1F] rounded-[2rem] p-8 text-white relative overflow-hidden group border border-slate-800">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-2 tracking-tight">
                                    Besoin d&apos;aide ?
                                </h3>
                                <p className="text-slate-400 text-sm font-medium mb-6 max-w-[240px]">
                                    Notre équipe est là pour vous accompagner dans vos achats.
                                </p>
                                <Link
                                    href="/contact"
                                    className="inline-flex px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-black text-xs uppercase tracking-widest transition-colors shadow-lg shadow-[#10B981]/20"
                                >
                                    Nous contacter
                                </Link>
                            </div>
                            <Package
                                size={120}
                                className="absolute -bottom-8 -right-8 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-500"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {showAddressModal && (
                <AddressModal
                    setShowAddressModal={setShowAddressModal}
                    onSuccess={handleAddAddress}
                />
            )}
        </div>
    );
}
