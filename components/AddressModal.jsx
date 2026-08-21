'use client';
import { XIcon, MapPinIcon, TargetIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useCartStore } from '@/lib/store';
import { validatePhone } from '@/lib/validations';

const AddressModal = ({ setShowAddressModal, onSuccess }) => {
    const addAddressToCart = useCartStore((state) => state.addAddress);
    const [isLocating, setIsLocating] = useState(false);
    const [address, setAddress] = useState({
        name: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'Sénégal',
        phone: '',
        latitude: null,
        longitude: null,
    });

    const handleGeolocate = () => {
        if (!navigator.geolocation) {
            toast.error("La géolocalisation n'est pas supportée par votre navigateur.");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setAddress({
                    ...address,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setIsLocating(false);
                toast.success('Position récupérée avec succès !');
            },
            (error) => {
                setIsLocating(false);
                console.error('Geolocation error:', error);
                toast.error('Impossible de récupérer votre position.');
            }
        );
    };

    const handleAddressChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePhone(address.phone)) {
            toast.error('Numéro de téléphone sénégalais invalide (ex: 771234567).');
            return;
        }

        if (onSuccess) {
            await onSuccess(address);
        } else {
            addAddressToCart(address);
            toast.success('Adresse enregistrée pour cette commande !');
        }

        setShowAddressModal(false);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                onClick={() => setShowAddressModal(false)}
            />

            <form
                onSubmit={handleSubmit}
                className="relative bg-white w-full max-w-lg rounded-[3rem] p-8 sm:p-12 shadow-2xl animate-in zoom-in duration-300 border border-slate-100"
            >
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="size-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            <MapPinIcon size={24} />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Nouvelle <span className="text-blue-600">Adresse</span>
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                        className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <XIcon size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Geolocation Button */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black text-blue-700 uppercase tracking-widest mb-1">
                                Position GPS
                            </p>
                            <p className="text-[10px] text-blue-600 font-medium">
                                {address.latitude
                                    ? `Coordonnées capturées : ${address.latitude.toFixed(4)}, ${address.longitude.toFixed(4)}`
                                    : 'Précisez votre emplacement exact pour la livraison.'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleGeolocate}
                            disabled={isLocating}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                        >
                            {isLocating ? (
                                <Loader2Icon size={14} className="animate-spin" />
                            ) : (
                                <TargetIcon size={14} />
                            )}
                            {address.latitude ? 'ACTUALISER' : 'ME GÉOLOCALISER'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                                Nom complet
                            </label>
                            <input
                                name="name"
                                onChange={handleAddressChange}
                                value={address.name}
                                className="p-4 bg-slate-50 border border-transparent focus:border-blue-400 focus:bg-white outline-none rounded-2xl w-full text-sm font-bold transition-all"
                                type="text"
                                placeholder="Mamadou Diop"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                                Téléphone
                            </label>
                            <input
                                name="phone"
                                onChange={handleAddressChange}
                                value={address.phone}
                                className="p-4 bg-slate-50 border border-transparent focus:border-blue-400 focus:bg-white outline-none rounded-2xl w-full text-sm font-bold transition-all"
                                type="text"
                                placeholder="77 783 27 98"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                            Adresse e-mail
                        </label>
                        <input
                            name="email"
                            onChange={handleAddressChange}
                            value={address.email}
                            className="p-4 bg-slate-50 border border-transparent focus:border-blue-400 focus:bg-white outline-none rounded-2xl w-full text-sm font-bold transition-all"
                            type="email"
                            placeholder="client@exemple.sn"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                            Rue et Quartier
                        </label>
                        <input
                            name="street"
                            onChange={handleAddressChange}
                            value={address.street}
                            className="p-4 bg-slate-50 border border-transparent focus:border-blue-400 focus:bg-white outline-none rounded-2xl w-full text-sm font-bold transition-all"
                            type="text"
                            placeholder="Rue 10 x 12, Médina"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                                Ville
                            </label>
                            <input
                                name="city"
                                onChange={handleAddressChange}
                                value={address.city}
                                className="p-4 bg-slate-50 border border-transparent focus:border-blue-400 focus:bg-white outline-none rounded-2xl w-full text-sm font-bold transition-all"
                                type="text"
                                placeholder="Dakar"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                                Région
                            </label>
                            <input
                                name="state"
                                onChange={handleAddressChange}
                                value={address.state}
                                className="p-4 bg-slate-50 border border-transparent focus:border-blue-400 focus:bg-white outline-none rounded-2xl w-full text-sm font-bold transition-all"
                                type="text"
                                placeholder="Dakar"
                                required
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest mt-10 hover:bg-black active:scale-95 transition-all shadow-xl shadow-slate-900/20"
                >
                    ENREGISTRER L&apos;ADRESSE
                </button>
            </form>
        </div>
    );
};

export default AddressModal;
