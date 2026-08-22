'use client';
import {
    SquarePenIcon,
    CreditCard,
    Truck,
    Store,
    ArrowRight,
    CheckCircle2,
    UserIcon,
    PhoneIcon,
    PlusIcon,
    ChevronDown,
    Map,
    Building2,
} from 'lucide-react';
import React, { useState } from 'react';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

import waveIcon from '@/assets/wave_icone.svg';
import { placeOrder } from '@/app/actions/order';
import { validateCoupon } from '@/app/actions/coupon';
import { getDeliveryFee } from '@/lib/utils';
import { regions, getZonesForRegion } from '@/lib/deliveryZones';
import { trackEvent } from './Analytics';
import { validatePhone } from '@/lib/validations';
import CartStickyCheckout from './CartStickyCheckout';

import { STORE_LOCATION } from '@/lib/storeLocation';

const OrderSummary = ({ totalPrice, items }) => {
    const currency = 'FCFA';
    const router = useRouter();
    const clearCart = useCartStore((state) => state.clearCart);
    const addressList = useCartStore((state) => state.addresses);

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [deliveryMethod, setDeliveryMethod] = useState('DELIVERY');
    const [selectedAddress, setSelectedAddress] = useState(addressList[0] || null);
    const [isLoading, setIsLoading] = useState(false);

    // ─── Formulaire Express ────────────────────────────────────────────────
    const [quickInfo, setQuickInfo] = useState({
        name: '',
        phone: '',
        region: 'Dakar',
        zone: '',
    });

    const handleQuickChange = (e) =>
        setQuickInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleRegionChange = (e) => {
        const newRegion = e.target.value;
        setQuickInfo((prev) => ({
            ...prev,
            region: newRegion,
            zone: '', // Reset zone when region changes
        }));
    };

    // ─── Coupons ──────────────────────────────────────────────────────────
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [showCoupon, setShowCoupon] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsValidatingCoupon(true);
        const res = await validateCoupon(couponCode, totalPrice);
        setIsValidatingCoupon(false);

        if (res.success) {
            setAppliedCoupon(res.coupon);
            toast.success(`Code ${res.coupon.code} appliqué !`);
        } else {
            toast.error(res.error);
        }
    };

    const storeLocation = STORE_LOCATION;

    // ─── Place Order ────────────────────────────────────────────────────────
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validation express
        const clientName = selectedAddress?.name || quickInfo.name.trim();
        const clientPhone = selectedAddress?.phone || quickInfo.phone.trim();

        if (!clientName || !clientPhone) {
            toast.error('Veuillez renseigner votre nom et numéro de téléphone.');
            setIsLoading(false);
            return;
        }

        if (!validatePhone(clientPhone)) {
            toast.error('Numéro de téléphone sénégalais invalide (ex: 771234567).');
            setIsLoading(false);
            return;
        }
        if (deliveryMethod === 'DELIVERY' && !selectedAddress) {
            if (!quickInfo.zone) {
                toast.error('Veuillez sélectionner votre quartier/ville.');
                setIsLoading(false);
                return;
            }
        }

        // Construire l'adresse finale
        let finalAddress;
        if (deliveryMethod === 'PICKUP') {
            finalAddress = {
                ...storeLocation,
                name: clientName,
                phone: clientPhone,
            };
        } else if (selectedAddress) {
            finalAddress = selectedAddress;
        } else {
            // Adresse express depuis quickInfo (Méthode Jumia)
            finalAddress = {
                name: clientName,
                phone: clientPhone,
                email: '',
                street: quickInfo.zone,
                city: quickInfo.zone,
                state: quickInfo.region,
                country: 'Sénégal',
            };
        }

        const rawDeliveryFee = getDeliveryFee(
            deliveryMethod,
            quickInfo.region,
            quickInfo.zone,
            selectedAddress
        );
        const deliveryFeeForTotal = rawDeliveryFee === -1 ? 0 : rawDeliveryFee;
        const discountAmount = appliedCoupon?.discount || 0;
        const finalTotal = totalPrice + deliveryFeeForTotal - discountAmount;

        const orderData = {
            items,
            totalPrice: finalTotal,
            address: finalAddress,
            paymentMethod: effectivePaymentMethod,
            deliveryMethod,
            deliveryFee: deliveryFeeForTotal,
            couponId: appliedCoupon?.id,
            discountAmount: discountAmount,
        };

        setIsLoading(true);

        const res = await placeOrder(orderData);
        setIsLoading(false);

        if (res.error) {
            toast.error(res.error);
            return;
        }

        // Track Purchase
        trackEvent('purchase', {
            total: finalTotal,
            items: items,
            order_id: res.orderId,
            payment_method: effectivePaymentMethod,
        });

        clearCart();

        if (effectivePaymentMethod === 'WAVE') {
            clearCart();
            toast.success('Redirection vers Wave...');

            const waveBase =
                process.env.NEXT_PUBLIC_WAVE_MERCHANT_URL ||
                'https://pay.wave.com/m/M_sn_mqjmXRyGEW2i/c/sn/';
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://julo.sn';
            const callbackUrl = `${baseUrl}/order-confirmed/${res.orderId}`;

            // Redirection immédiate vers Wave — callback_url ramène vers order-confirmed
            setTimeout(() => {
                window.location.href = `${waveBase}?amount=${Math.round(finalTotal)}&callback_url=${encodeURIComponent(callbackUrl)}`;
            }, 600);
        } else {
            clearCart();
            toast.success('Commande confirmée !');
            router.push(`/order-confirmed/${res.orderId}`);
        }
    };

    const rawDeliveryFee = getDeliveryFee(
        deliveryMethod,
        quickInfo.region,
        quickInfo.zone,
        selectedAddress
    );

    const paymentOptions =
        deliveryMethod === 'PICKUP'
            ? [
                  {
                      id: 'COD',
                      label: 'Sur place',
                      color: 'text-slate-900',
                      icon: <Store size={24} />,
                  },
              ]
            : [
                  {
                      id: 'COD',
                      label: 'Cash à la livraison',
                      color: 'text-slate-900',
                      icon: <CreditCard size={24} />,
                  },
                  // Wave n'est proposé que si les frais de livraison sont connus :
                  // sans API Wave pour vérifier/compléter un paiement partiel, on ne peut
                  // pas faire prépayer un montant qui exclut des frais "à négocier".
                  ...(rawDeliveryFee !== -1
                      ? [
                            {
                                id: 'WAVE',
                                label: 'Paiement Wave',
                                color: 'text-[#C59A63]',
                                icon: <Image src={waveIcon} alt="Wave" width={24} height={24} />,
                            },
                        ]
                      : []),
              ];

    const deliveryFeeForTotal = rawDeliveryFee === -1 ? 0 : rawDeliveryFee;
    const discountAmount = appliedCoupon?.discount || 0;
    const finalTotal = totalPrice + deliveryFeeForTotal - discountAmount;
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    // Si Wave était sélectionné et devient indisponible (zone "à négocier" ou retrait
    // en magasin), on retombe sur Cash à la livraison plutôt que de garder un choix
    // qui ne correspond plus à aucun bouton visible.
    const waveAvailable = deliveryMethod === 'DELIVERY' && rawDeliveryFee !== -1;
    const effectivePaymentMethod =
        paymentMethod === 'WAVE' && !waveAvailable ? 'COD' : paymentMethod;

    const scrollToCheckout = () => {
        document
            .getElementById('order-summary')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleStickyConfirm = (e) => {
        const summary = document.getElementById('order-summary');
        const rect = summary?.getBoundingClientRect();
        const isSummaryVisible = rect && rect.top < window.innerHeight * 0.6;
        if (isSummaryVisible) {
            handlePlaceOrder(e);
        } else {
            scrollToCheckout();
        }
    };

    return (
        <>
            <div
                id="order-summary"
                className="bg-white border border-slate-100 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-xl sm:shadow-2xl shadow-slate-200/60 scroll-mt-20"
            >
                <p className="lg:hidden text-[10px] font-black text-[#C59A63] uppercase tracking-[0.2em] mb-4">
                    Finaliser la commande
                </p>
                <div className="space-y-6 sm:space-y-8">
                    {/* ── 1. Mode de réception ── */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            Comment recevoir votre commande ?
                        </p>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <button
                                type="button"
                                onClick={() => setDeliveryMethod('DELIVERY')}
                                className={`relative flex flex-col items-start p-4 sm:p-5 rounded-2xl border-2 transition-all text-left group ${
                                    deliveryMethod === 'DELIVERY'
                                        ? 'border-blue-600 bg-[#F5F2EB]/80 shadow-lg shadow-blue-600/10'
                                        : 'border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-slate-50'
                                }`}
                            >
                                <div
                                    className={`p-2 rounded-full mb-3 transition-colors ${deliveryMethod === 'DELIVERY' ? 'bg-[#C59A63] text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-blue-100 group-hover:text-[#C59A63]'}`}
                                >
                                    <Truck size={20} />
                                </div>
                                <span
                                    className={`font-black text-xs sm:text-sm uppercase tracking-widest mb-1 ${deliveryMethod === 'DELIVERY' ? 'text-blue-900' : 'text-slate-700'}`}
                                >
                                    Livraison
                                </span>
                                <span className="text-[10px] sm:text-xs font-medium text-slate-500 leading-snug">
                                    À domicile ou bureau
                                </span>
                                <div className="absolute top-4 right-4 transition-all">
                                    {deliveryMethod === 'DELIVERY' ? (
                                        <CheckCircle2
                                            size={22}
                                            fill="currentColor"
                                            className="text-[#C59A63] bg-white rounded-full shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-[22px] h-[22px] rounded-full border-2 border-slate-300 bg-white group-hover:border-blue-300" />
                                    )}
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setDeliveryMethod('PICKUP');
                                    setPaymentMethod('COD');
                                }}
                                className={`relative flex flex-col items-start p-4 sm:p-5 rounded-2xl border-2 transition-all text-left group ${
                                    deliveryMethod === 'PICKUP'
                                        ? 'border-blue-600 bg-[#F5F2EB]/80 shadow-lg shadow-blue-600/10'
                                        : 'border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-slate-50'
                                }`}
                            >
                                <div
                                    className={`p-2 rounded-full mb-3 transition-colors ${deliveryMethod === 'PICKUP' ? 'bg-[#C59A63] text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-blue-100 group-hover:text-[#C59A63]'}`}
                                >
                                    <Store size={20} />
                                </div>
                                <span
                                    className={`font-black text-xs sm:text-sm uppercase tracking-widest mb-1 ${deliveryMethod === 'PICKUP' ? 'text-blue-900' : 'text-slate-700'}`}
                                >
                                    Retrait
                                </span>
                                <span className="text-[10px] sm:text-xs font-medium text-slate-500 leading-snug">
                                    En boutique (Gratuit)
                                </span>
                                <div className="absolute top-4 right-4 transition-all">
                                    {deliveryMethod === 'PICKUP' ? (
                                        <CheckCircle2
                                            size={22}
                                            fill="currentColor"
                                            className="text-[#C59A63] bg-white rounded-full shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-[22px] h-[22px] rounded-full border-2 border-slate-300 bg-white group-hover:border-blue-300" />
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* ── 2. Infos Client ── */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            {deliveryMethod === 'DELIVERY'
                                ? 'Vos coordonnées de livraison'
                                : 'Vos coordonnées pour le retrait'}
                        </p>

                        <AnimatePresence mode="wait">
                            {/* ── Adresse complète déjà sélectionnée ── */}
                            {selectedAddress && deliveryMethod === 'DELIVERY' ? (
                                <motion.div
                                    key="selected-address"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="group relative bg-[#F5F2EB]/50 p-5 rounded-[2rem] border border-blue-100 transition-all"
                                >
                                    <div className="pr-10">
                                        <p className="font-black text-blue-900 text-sm mb-1">
                                            {selectedAddress.name}
                                        </p>
                                        <p className="text-xs text-blue-700 font-bold">
                                            Tél. {selectedAddress.phone}
                                        </p>
                                        <p className="text-xs text-[#C59A63]/80 mt-1 leading-relaxed">
                                            {selectedAddress.street}, {selectedAddress.city}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedAddress(null)}
                                        className="absolute top-4 right-4 p-2 bg-white rounded-xl text-[#C59A63] shadow-sm hover:bg-[#C59A63] hover:text-white transition-all"
                                    >
                                        <SquarePenIcon size={16} />
                                    </button>
                                </motion.div>
                            ) : (
                                /* ── Formulaire Express ── */
                                <motion.div
                                    key="quick-form"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="space-y-4"
                                >
                                    {/* ── Section Contact ── */}
                                    <div className="pt-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                            Informations personnelles
                                        </p>
                                        <div className="space-y-4">
                                            {/* Nom complet */}
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#C59A63] transition-colors pointer-events-none">
                                                    <UserIcon size={18} />
                                                </div>
                                                <input
                                                    name="name"
                                                    value={quickInfo.name}
                                                    onChange={handleQuickChange}
                                                    type="text"
                                                    placeholder="Votre nom complet"
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-[#C59A63] focus:bg-white outline-none rounded-2xl text-sm font-bold text-slate-800 transition-all placeholder:font-medium placeholder:text-slate-400 shadow-inner"
                                                />
                                            </div>

                                            {/* Téléphone */}
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#C59A63] transition-colors pointer-events-none">
                                                    <PhoneIcon size={18} />
                                                </div>
                                                <input
                                                    name="phone"
                                                    value={quickInfo.phone}
                                                    onChange={handleQuickChange}
                                                    type="tel"
                                                    placeholder="Téléphone (ex: 77 783 27 98)"
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-[#C59A63] focus:bg-white outline-none rounded-2xl text-sm font-bold text-slate-800 transition-all placeholder:font-medium placeholder:text-slate-400 shadow-inner"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Section Adresse ── */}
                                    {deliveryMethod === 'DELIVERY' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="pt-6"
                                        >
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center justify-between">
                                                <span>Adresse de livraison</span>
                                                <span className="text-[9px] text-[#C59A63] lowercase bg-[#F5F2EB] px-2 py-0.5 rounded-full">
                                                    obligatoire
                                                </span>
                                            </p>
                                            <div className="space-y-4">
                                                {/* Région */}
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#C59A63] transition-colors pointer-events-none">
                                                        <Map size={18} />
                                                    </div>
                                                    <select
                                                        name="region"
                                                        value={quickInfo.region}
                                                        onChange={handleRegionChange}
                                                        className="w-full pl-12 pr-10 py-4 bg-slate-50 border-2 border-transparent focus:border-[#C59A63] focus:bg-white outline-none rounded-2xl text-sm font-bold text-slate-800 transition-all cursor-pointer appearance-none shadow-inner"
                                                    >
                                                        {regions.map((r) => (
                                                            <option key={r} value={r}>
                                                                {r}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                        <ChevronDown size={18} />
                                                    </div>
                                                </div>

                                                {/* Zone */}
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#C59A63] transition-colors pointer-events-none">
                                                        <Building2 size={18} />
                                                    </div>
                                                    <select
                                                        name="zone"
                                                        value={quickInfo.zone}
                                                        onChange={handleQuickChange}
                                                        className={`w-full pl-12 pr-10 py-4 bg-slate-50 border-2 border-transparent focus:border-[#C59A63] focus:bg-white outline-none rounded-2xl text-sm font-bold transition-all cursor-pointer appearance-none shadow-inner ${quickInfo.zone === '' ? 'text-slate-400' : 'text-slate-800'}`}
                                                    >
                                                        <option value="" disabled hidden>
                                                            Sélectionnez votre quartier/ville...
                                                        </option>
                                                        {getZonesForRegion(quickInfo.region).map(
                                                            (z) => (
                                                                <option
                                                                    key={z.name}
                                                                    value={z.name}
                                                                    className="text-slate-800"
                                                                >
                                                                    {z.name}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                        <ChevronDown size={18} />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Lien optionnel — adresses enregistrées uniquement */}
                                    {deliveryMethod === 'DELIVERY' && addressList.length > 0 && (
                                        <details className="group/details border border-slate-100 bg-slate-50 rounded-2xl overflow-hidden">
                                            <summary className="flex items-center justify-between p-4 cursor-pointer list-none text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#C59A63] transition-colors">
                                                <span className="flex items-center gap-2">
                                                    <PlusIcon size={14} />
                                                    Mes adresses enregistrées
                                                </span>
                                                <ChevronDown
                                                    size={14}
                                                    className="transition-transform group-open/details:rotate-180"
                                                />
                                            </summary>
                                            <div className="p-4 pt-0 flex flex-col gap-3 border-t border-slate-100 mt-2 bg-white">
                                                <div className="relative">
                                                    <select
                                                        className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-xl outline-none font-bold text-xs text-slate-700 focus:border-[#C59A63] transition-all appearance-none cursor-pointer"
                                                        onChange={(e) => {
                                                            if (e.target.value !== '')
                                                                setSelectedAddress(
                                                                    addressList[e.target.value]
                                                                );
                                                        }}
                                                        defaultValue=""
                                                    >
                                                        <option value="" disabled>
                                                            Choisir une adresse…
                                                        </option>
                                                        {addressList.map((addr, idx) => (
                                                            <option key={idx} value={idx}>
                                                                {addr.name} — {addr.city}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                        <ChevronDown size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        </details>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── 3. Paiement ── */}
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            Mode de paiement
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0">
                            {paymentOptions.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setPaymentMethod(option.id)}
                                    className={`relative shrink-0 snap-start flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 min-w-[7.5rem] sm:min-w-0 ${effectivePaymentMethod === option.id ? 'bg-white border-[#C59A63] shadow-lg shadow-sm sm:scale-105' : 'bg-white border-slate-100 opacity-70 hover:opacity-100 hover:border-slate-200'} ${option.unavailable ? 'cursor-not-allowed grayscale opacity-50 hover:opacity-50' : ''}`}
                                >
                                    <div className="flex items-center justify-center h-10 w-full">
                                        {option.icon}
                                    </div>
                                    <span className="font-black text-[10px] uppercase tracking-widest text-slate-900 text-center leading-tight">
                                        {option.label}
                                    </span>
                                    {effectivePaymentMethod === option.id && (
                                        <motion.div
                                            layoutId="check"
                                            className="absolute top-2 right-2 text-[#C59A63]"
                                        >
                                            <CheckCircle2 size={16} fill="white" />
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Info Transfert Manuel */}
                        <AnimatePresence>
                            {effectivePaymentMethod === 'WAVE' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 p-4 bg-[#F5F2EB] border border-blue-100 rounded-2xl"
                                >
                                    <p className="text-[10px] font-bold text-blue-800 leading-relaxed text-center">
                                        Cliquez sur le bouton ci-dessous pour être redirigé vers
                                        Wave et finaliser votre paiement.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── 3.5 Coupons ── */}
                    <div className="pt-2">
                        <details
                            className="group/coupon border-none bg-transparent"
                            open={showCoupon || appliedCoupon}
                        >
                            <summary
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowCoupon(!showCoupon);
                                }}
                                className="flex items-center gap-2 cursor-pointer list-none text-xs font-bold text-slate-500 hover:text-[#C59A63] transition-colors"
                            >
                                <PlusIcon
                                    size={14}
                                    className={`transition-transform ${showCoupon || appliedCoupon ? 'rotate-45 text-[#C59A63]' : ''}`}
                                />
                                <span
                                    className={showCoupon || appliedCoupon ? 'text-[#C59A63]' : ''}
                                >
                                    Avez-vous un code promo ?
                                </span>
                            </summary>
                            <div className="pt-4 flex gap-2">
                                <div className="relative flex-1 group">
                                    <input
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        disabled={appliedCoupon}
                                        type="text"
                                        placeholder="Saisissez votre code"
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-[#C59A63] focus:bg-white outline-none rounded-xl text-xs font-bold text-slate-800 transition-all placeholder:font-medium placeholder:text-slate-400 shadow-inner"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={
                                        appliedCoupon
                                            ? () => {
                                                  setAppliedCoupon(null);
                                                  setCouponCode('');
                                              }
                                            : handleApplyCoupon
                                    }
                                    disabled={isValidatingCoupon || (!couponCode && !appliedCoupon)}
                                    className={`px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 ${appliedCoupon ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-900/10'}`}
                                >
                                    {isValidatingCoupon
                                        ? '...'
                                        : appliedCoupon
                                          ? 'Retirer'
                                          : 'Appliquer'}
                                </button>
                            </div>
                            {appliedCoupon && (
                                <p className="mt-2 text-[10px] text-[#C59A63] font-bold flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Réduction de{' '}
                                    {appliedCoupon.discount.toLocaleString('fr-SN')} FCFA appliquée
                                    !
                                </p>
                            )}
                        </details>
                    </div>

                    {/* ── 4. Total & Confirmer ── */}
                    <div className="pt-6 border-t border-slate-100">
                        <div className="flex flex-col gap-3 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Sous-total
                                </span>
                                <span className="font-bold text-slate-700">
                                    {totalPrice.toLocaleString('fr-SN')}{' '}
                                    <small className="text-[10px]">FCFA</small>
                                </span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-[#C59A63] uppercase tracking-widest">
                                        Réduction ({appliedCoupon.code})
                                    </span>
                                    <span className="font-bold text-[#C59A63]">
                                        -{discountAmount.toLocaleString('fr-SN')}{' '}
                                        <small className="text-[10px]">FCFA</small>
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Livraison
                                </span>
                                <span className="font-bold text-slate-700">
                                    {rawDeliveryFee === 0 ? (
                                        <span className="text-[#C59A63] bg-[#F5F2EB] px-2 py-0.5 rounded-md text-xs font-black uppercase tracking-widest">
                                            Gratuit
                                        </span>
                                    ) : rawDeliveryFee === -1 ? (
                                        <span className="text-[#C59A63] bg-[#F5F2EB] px-2 py-0.5 rounded-md text-xs font-black uppercase tracking-widest">
                                            À déterminer
                                        </span>
                                    ) : (
                                        `${rawDeliveryFee.toLocaleString('fr-SN')} FCFA`
                                    )}
                                </span>
                            </div>
                            <div className="h-px w-full bg-slate-100 my-1" />
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
                                    Total à payer
                                </span>
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">
                                    {finalTotal.toLocaleString('fr-SN')}
                                    <small className="text-sm ml-1 text-slate-400">
                                        {currency}
                                    </small>
                                </span>
                            </div>
                            {rawDeliveryFee === -1 && (
                                <p className="text-[9px] text-slate-400 font-bold text-right italic">
                                    * Frais de livraison à calculer (Hors Dakar)
                                </p>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, translateY: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handlePlaceOrder}
                            disabled={isLoading}
                            className="hidden lg:flex w-full bg-[#C59A63] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-[#C59A63]/25 hover:bg-[#B4874F] transition-all items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="animate-spin h-5 w-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        />
                                    </svg>
                                    Traitement…
                                </span>
                            ) : (
                                <>
                                    {effectivePaymentMethod === 'WAVE'
                                        ? 'Payer via Wave'
                                        : 'Confirmer la commande'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>

            <CartStickyCheckout
                itemCount={itemCount}
                finalTotal={finalTotal}
                currency={currency}
                isLoading={isLoading}
                onConfirm={handleStickyConfirm}
                deliveryNote={
                    deliveryMethod === 'PICKUP'
                        ? 'Retrait Mermoz, Dakar'
                        : rawDeliveryFee === -1
                          ? 'Livraison hors Dakar'
                          : 'Livraison Dakar 2 000 F'
                }
            />
        </>
    );
};

export default OrderSummary;
