'use client';
import { useEffect, useState } from 'react';
import {
    PlusIcon,
    Trash2Icon,
    TicketIcon,
    CalendarIcon,
    TagIcon,
    XIcon,
    AlertCircleIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getCoupons, addCoupon, deleteCoupon } from '@/app/actions/coupon';
import Loading from '@/components/Loading';

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        code: '',
        type: 'FIXED',
        value: '',
        minOrderAmount: '',
        maxDiscountAmount: '',
        expirationDate: '',
        usageLimit: '100',
    });

    const fetchCoupons = async () => {
        const { coupons, error } = await getCoupons();
        if (error) {
            toast.error(error);
        } else {
            setCoupons(coupons);
        }
        setLoading(false);
    };

    useEffect(() => {
        let ignore = false;
        (async () => {
            if (!ignore) await fetchCoupons();
        })();
        return () => {
            ignore = true;
        };
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce coupon ?')) return;
        const { success, error } = await deleteCoupon(id);
        if (success) {
            toast.success(success);
            fetchCoupons();
        } else {
            toast.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const { success, error } = await addCoupon(formData);
        setIsLoading(false);

        if (success) {
            toast.success(success);
            setShowModal(false);
            setFormData({
                code: '',
                type: 'FIXED',
                value: '',
                minOrderAmount: '',
                maxDiscountAmount: '',
                expirationDate: '',
                usageLimit: '100',
            });
            fetchCoupons();
        } else {
            toast.error(error);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Gestion des Coupons
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">
                        Créez et gérez vos codes promotionnels
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                    <PlusIcon size={16} /> Nouveau Coupon
                </button>
            </div>

            {/* Coupons Table */}
            <div className="bg-white border border-slate-100 rounded-[2rem] shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Code
                                </th>
                                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Réduction
                                </th>
                                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Usage
                                </th>
                                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Expiration
                                </th>
                                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {coupons.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-300">
                                            <TicketIcon size={40} />
                                            <p className="font-bold text-sm">Aucun coupon trouvé</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                coupons.map((coupon) => (
                                    <tr
                                        key={coupon.id}
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="py-4 px-6">
                                            <span className="bg-slate-100 text-slate-900 px-3 py-1 rounded-lg font-black text-xs">
                                                {coupon.code}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 text-sm">
                                                    {coupon.type === 'PERCENTAGE'
                                                        ? `${coupon.value}%`
                                                        : `${Number(coupon.value).toLocaleString('fr-SN')} FCFA`}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    Min:{' '}
                                                    {Number(coupon.minOrderAmount).toLocaleString(
                                                        'fr-SN'
                                                    )}{' '}
                                                    F
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500"
                                                        style={{
                                                            width: `${Math.min(100, (coupon.usedCount / coupon.usageLimit) * 100)}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-slate-600">
                                                    {coupon.usedCount}/{coupon.usageLimit}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                <CalendarIcon size={14} />
                                                {coupon.expirationDate
                                                    ? new Date(
                                                          coupon.expirationDate
                                                      ).toLocaleDateString('fr-FR')
                                                    : 'Jamais'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => handleDelete(coupon.id)}
                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2Icon size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de création */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    />
                    <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                                    Nouveau Code Promo
                                </h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <XIcon size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Code */}
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                        Code du coupon
                                    </label>
                                    <input
                                        required
                                        value={formData.code}
                                        onChange={(e) =>
                                            setFormData({ ...formData, code: e.target.value })
                                        }
                                        placeholder="EX: FETE2024"
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none font-bold text-sm transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Type */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                            Type
                                        </label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) =>
                                                setFormData({ ...formData, type: e.target.value })
                                            }
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none font-bold text-sm transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="FIXED">Montant Fixe (FCFA)</option>
                                            <option value="PERCENTAGE">Pourcentage (%)</option>
                                        </select>
                                    </div>
                                    {/* Valeur */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                            Valeur
                                        </label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.value}
                                            onChange={(e) =>
                                                setFormData({ ...formData, value: e.target.value })
                                            }
                                            placeholder="500 ou 10"
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none font-bold text-sm transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Min Order */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                            Achat Min (FCFA)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.minOrderAmount}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    minOrderAmount: e.target.value,
                                                })
                                            }
                                            placeholder="0"
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none font-bold text-sm transition-all"
                                        />
                                    </div>
                                    {/* Limit */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                            Limite d&apos;usage
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.usageLimit}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    usageLimit: e.target.value,
                                                })
                                            }
                                            placeholder="100"
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none font-bold text-sm transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Expiration & Max Discount */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                            Expiration (Optionnel)
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.expirationDate}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    expirationDate: e.target.value,
                                                })
                                            }
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none font-bold text-sm transition-all"
                                        />
                                    </div>
                                    {formData.type === 'PERCENTAGE' && (
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                Plafond (FCFA)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.maxDiscountAmount}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        maxDiscountAmount: e.target.value,
                                                    })
                                                }
                                                placeholder="ex: 5000"
                                                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl outline-none font-bold text-sm transition-all"
                                            />
                                        </div>
                                    )}
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:bg-black transition-all disabled:opacity-50 mt-4"
                                >
                                    {isSubmitting ? 'Création...' : 'Créer le coupon'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
