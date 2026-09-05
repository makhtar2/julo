'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
    MailIcon,
    LockIcon,
    ArrowRightIcon,
    UserIcon,
    PhoneIcon,
    EyeIcon,
    EyeOffIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogo } from '@/components/SocialLogos';
import { assets } from '@/assets/assets';
import Image from 'next/image';

import { login, register, signInWithMagicLink } from '@/app/actions/auth';
import { signInWithSocialProvider } from '@/lib/supabase/auth-client';

export default function AuthPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [useMagicLink, setUseMagicLink] = useState(false);
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSocialLogin = async (provider) => {
        setSocialLoading(provider);
        const { error } = await signInWithSocialProvider(provider);
        if (error) {
            toast.error(`Erreur avec ${provider}: ${error}`);
            setSocialLoading(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                if (useMagicLink) {
                    // Magic Link flow
                    const res = await signInWithMagicLink(formData.email);
                    if (res?.error) {
                        toast.error(res.error);
                    } else {
                        toast.success(res.success);
                    }
                    setLoading(false);
                    return;
                }

                // Login flow
                const res = await login({ email: formData.email, password: formData.password });
                if (res?.error) {
                    toast.error(res.error);
                    setLoading(false);
                } else {
                    toast.success('Connexion réussie !');
                    if (
                        res.role === 'ADMIN' ||
                        formData.email.toLowerCase().trim() === 'makhtar2gsm@gmail.com'
                    ) {
                        router.push('/admin');
                    } else {
                        router.push('/');
                    }
                    router.refresh();
                }
            } else {
                // Signup flow
                const res = await register(formData);
                if (res?.error) {
                    toast.error(res.error);
                    setLoading(false);
                } else {
                    toast.success(res.success || 'Compte créé avec succès !');
                    // Automatically switch to login mode after successful signup
                    setIsLogin(true);
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error('Auth error:', error);
            toast.error('Une erreur inattendue est survenue.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="flex justify-center mb-8">
                    <Link href="/">
                        <Image
                            src={assets.julo_logo_transparent}
                            alt="JULO"
                            width={300}
                            height={100}
                            className="h-20 sm:h-28 w-auto object-contain"
                        />{' '}
                    </Link>
                </div>
                <motion.div
                    layout
                    className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50"
                >
                    <div className="text-center mb-10">
                        <motion.h1
                            key={isLogin ? 'login-title' : 'signup-title'}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-black text-slate-900 tracking-tight"
                        >
                            {isLogin ? 'Bon retour !' : 'Bienvenue !'}
                        </motion.h1>
                        <motion.p
                            key={isLogin ? 'login-sub' : 'signup-sub'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-slate-500 mt-2 font-medium"
                        >
                            {isLogin
                                ? 'Connectez-vous à Global Air'
                                : 'Rejoignez la communauté Global Air'}
                        </motion.p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    className="space-y-4 overflow-hidden"
                                >
                                    <div className="relative group">
                                        <UserIcon
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                                            size={20}
                                        />
                                        <input
                                            required={!isLogin}
                                            type="text"
                                            name="name"
                                            placeholder="Nom complet"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <PhoneIcon
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                                            size={20}
                                        />
                                        <input
                                            required={!isLogin}
                                            type="tel"
                                            name="phone"
                                            placeholder="Téléphone (ex: 77...)"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] transition-all font-medium"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative group">
                            <MailIcon
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#10B981] transition-colors"
                                size={20}
                            />
                            <input
                                required
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                autoCapitalize="none"
                                autoComplete="email"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] transition-all font-medium"
                            />
                        </div>

                        {isLogin && !useMagicLink && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative group"
                            >
                                <LockIcon
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#10B981] transition-colors"
                                    size={20}
                                />
                                <input
                                    required={isLogin && !useMagicLink}
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Mot de passe"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] transition-all font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOffIcon size={20} />
                                    ) : (
                                        <EyeIcon size={20} />
                                    )}
                                </button>
                            </motion.div>
                        )}

                        {!isLogin && (
                            <div className="relative group">
                                <LockIcon
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#10B981] transition-colors"
                                    size={20}
                                />
                                <input
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Mot de passe"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] transition-all font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOffIcon size={20} />
                                    ) : (
                                        <EyeIcon size={20} />
                                    )}
                                </button>
                            </div>
                        )}

                        {isLogin && (
                            <div className="flex justify-end px-2">
                                <button
                                    type="button"
                                    onClick={() => setUseMagicLink(!useMagicLink)}
                                    className="text-xs font-black text-[#10B981] hover:text-[#059669] transition-colors"
                                >
                                    {useMagicLink
                                        ? 'Utiliser un mot de passe'
                                        : 'Se connecter sans mot de passe ?'}
                                </button>
                            </div>
                        )}

                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            type="submit"
                            className="w-full py-4 mt-4 text-white rounded-2xl font-black text-lg shadow-xl transition-all duration-300 flex items-center justify-center gap-2 bg-[#1C1B1F] hover:bg-[#10B981] shadow-black/10"
                        >
                            {loading
                                ? isLogin
                                    ? useMagicLink
                                        ? 'Envoi...'
                                        : 'Connexion...'
                                    : 'Création...'
                                : isLogin
                                  ? useMagicLink
                                      ? 'Envoyer le lien'
                                      : 'Se connecter'
                                  : 'Créer mon compte'}
                            {!loading && <ArrowRightIcon size={20} />}
                        </motion.button>
                    </form>

                    <div className="relative py-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-slate-400 font-black tracking-widest">
                                Ou continuer avec
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <motion.button
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSocialLogin('google')}
                            disabled={socialLoading !== null}
                            type="button"
                            className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-black text-slate-900 text-xs uppercase tracking-widest disabled:opacity-50 shadow-sm"
                        >
                            <GoogleLogo size={20} />
                            Continuer avec Google
                        </motion.button>
                    </div>

                    <div className="mt-10 text-center">
                        <p className="text-slate-500 font-medium">
                            {isLogin ? 'Pas encore de compte ?' : 'Déjà membre ?'}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 text-[#10B981] font-black hover:underline focus:outline-none"
                            >
                                {isLogin ? "S'inscrire" : 'Se connecter'}
                            </button>
                        </p>
                    </div>
                </motion.div>

                {!isLogin && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 px-4 text-center"
                    >
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                            En vous inscrivant, vous acceptez nos{' '}
                            <span className="text-slate-800 underline decoration-slate-300">
                                Conditions d&apos;Utilisation
                            </span>{' '}
                            et notre{' '}
                            <span className="text-slate-800 underline decoration-slate-300">
                                Politique de Confidentialité
                            </span>
                            .
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
