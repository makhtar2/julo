'use client';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
    PlusIcon,
    Trash2Icon,
    Edit2Icon,
    ImageIcon,
    UploadCloudIcon,
    XIcon,
    Loader2Icon,
    ToggleLeftIcon,
    ToggleRightIcon,
    LinkIcon,
} from 'lucide-react';
import Image from 'next/image';
import { addBanner, updateBanner, deleteBanner, getBanners } from '@/app/actions/banner';
import { uploadProductImage } from '@/app/actions/product';

export default function AdminBannersPage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentBannerId, setCurrentBannerId] = useState(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        link: '',
        isActive: true,
        image: '',
    });
    const [previewImage, setPreviewImage] = useState(null);

    const fetchBanners = async () => {
        const res = await getBanners();
        if (res.banners) setBanners(res.banners);
        setLoading(false);
    };

    useEffect(() => {
        let ignore = false;
        (async () => {
            if (!ignore) await fetchBanners();
        })();
        return () => {
            ignore = true;
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage({
                file,
                url: URL.createObjectURL(file),
            });
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            subtitle: '',
            description: '',
            link: '',
            isActive: true,
            image: '',
        });
        setPreviewImage(null);
        setIsEditing(false);
        setIsFormOpen(false);
        setCurrentBannerId(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            let imageUrl = formData.image;

            if (previewImage && !previewImage.isExisting) {
                const uploadRes = await uploadProductImage(previewImage.file);
                if (uploadRes.success) {
                    imageUrl = uploadRes.url;
                } else {
                    throw new Error(uploadRes.error);
                }
            }

            if (!imageUrl) throw new Error('Une image est requise.');

            const bannerData = { ...formData, image: imageUrl };
            let res;

            if (isEditing) {
                res = await updateBanner(currentBannerId, bannerData);
            } else {
                res = await addBanner(bannerData);
            }

            if (res.success) {
                toast.success(res.success);
                resetForm();
                fetchBanners();
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditClick = (banner) => {
        setIsEditing(true);
        setCurrentBannerId(banner.id);
        setFormData({
            title: banner.title || '',
            subtitle: banner.subtitle || '',
            description: banner.description || '',
            link: banner.link || '',
            isActive: banner.isActive,
            image: banner.image,
        });
        setPreviewImage({ url: banner.image, isExisting: true });
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (id) => {
        if (confirm('Supprimer cette bannière ?')) {
            const res = await deleteBanner(id);
            if (res.success) {
                toast.success('Bannière supprimée');
                fetchBanners();
            } else {
                toast.error(res.error);
            }
        }
    };

    const toggleStatus = async (banner) => {
        const res = await updateBanner(banner.id, { isActive: !banner.isActive });
        if (res.success) {
            toast.success('Statut mis à jour');
            fetchBanners();
        }
    };

    if (loading)
        return (
            <div className="flex justify-center py-20">
                <Loader2Icon className="animate-spin text-blue-600" size={48} />
            </div>
        );

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
                <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">
                        Accueil
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                        Bannières
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-2">
                        Pilotez les visuels promotionnels affichés dans le hero.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setIsEditing(false);
                        setIsFormOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all"
                >
                    <PlusIcon size={16} />
                    Nouvelle bannière
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Form Section */}
                <div className={`xl:col-span-5 ${isFormOpen ? 'block' : 'hidden xl:block'}`}>
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-5 sm:p-6 shadow-sm xl:sticky xl:top-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div
                                className={`size-11 rounded-2xl flex items-center justify-center ${isEditing ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}
                            >
                                {isEditing ? <Edit2Icon size={20} /> : <PlusIcon size={20} />}
                            </div>
                            <h2 className="text-xl font-black flex-1">
                                {isEditing ? 'Modifier' : 'Créer'}
                            </h2>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="xl:hidden size-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center"
                            >
                                <XIcon size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Visuel
                                </label>
                                <div
                                    onClick={() => fileInputRef.current.click()}
                                    className="relative aspect-[21/9] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 group transition-all"
                                >
                                    {previewImage ? (
                                        <Image
                                            src={previewImage.url}
                                            alt="preview"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <>
                                            <UploadCloudIcon
                                                size={32}
                                                className="text-slate-300 group-hover:text-blue-600 transition-colors"
                                            />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                                                Cliquer pour uploader
                                            </span>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Surtitre
                                </label>
                                <input
                                    type="text"
                                    name="subtitle"
                                    value={formData.subtitle}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-blue-400 transition-all outline-none text-sm font-bold"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Titre
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-blue-400 transition-all outline-none text-sm font-black"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-blue-400 transition-all outline-none text-sm font-medium resize-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Lien
                                </label>
                                <div className="relative">
                                    <LinkIcon
                                        size={14}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        type="text"
                                        name="link"
                                        value={formData.link}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-blue-400 transition-all outline-none text-sm font-bold"
                                        placeholder="/shop?category=..."
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 py-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="size-4 accent-blue-600"
                                />
                                <label
                                    htmlFor="isActive"
                                    className="text-xs font-black text-slate-600 uppercase tracking-widest cursor-pointer"
                                >
                                    Activer immédiatement
                                </label>
                            </div>

                            <div className="flex flex-col gap-3 pt-4">
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {submitting && (
                                        <Loader2Icon size={16} className="animate-spin" />
                                    )}
                                    {isEditing ? 'METTRE À JOUR' : 'PUBLIER LA BANNIÈRE'}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                                    >
                                        ANNULER
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="xl:col-span-7 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
                            <p className="text-2xl font-black text-slate-900">{banners.length}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                Total
                            </p>
                        </div>
                        <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
                            <p className="text-2xl font-black text-blue-600">
                                {banners.filter((b) => b.isActive).length}
                            </p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                Actives
                            </p>
                        </div>
                    </div>

                    {banners.length === 0 ? (
                        <div className="bg-white rounded-[2rem] py-20 text-center border border-dashed border-slate-200">
                            <ImageIcon size={48} className="text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold">Aucune bannière configurée.</p>
                        </div>
                    ) : (
                        banners.map((banner) => (
                            <div
                                key={banner.id}
                                className="bg-white border border-slate-100 rounded-[2rem] p-4 hover:shadow-xl hover:shadow-slate-200/40 transition-all group overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="relative aspect-[16/7] md:w-72 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                                        <Image
                                            src={banner.image}
                                            alt=""
                                            fill
                                            className="object-cover"
                                        />
                                        <div
                                            className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${banner.isActive ? 'bg-blue-600 text-white' : 'bg-slate-400 text-white'}`}
                                        >
                                            {banner.isActive ? 'Active' : 'Désactivée'}
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">
                                                {banner.subtitle || 'Bannière'}
                                            </p>
                                            <h3 className="font-black text-slate-900 text-lg leading-tight mb-2">
                                                {banner.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-medium line-clamp-2">
                                                {banner.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditClick(banner)}
                                                    className="size-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-amber-500 hover:text-white transition-all"
                                                >
                                                    <Edit2Icon size={16} />
                                                </button>
                                                <button
                                                    onClick={() => toggleStatus(banner)}
                                                    className={`size-10 flex items-center justify-center rounded-xl transition-all ${banner.isActive ? 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-600 hover:text-white'}`}
                                                >
                                                    {banner.isActive ? (
                                                        <ToggleRightIcon size={20} />
                                                    ) : (
                                                        <ToggleLeftIcon size={20} />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(banner.id)}
                                                    className="size-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <Trash2Icon size={16} />
                                                </button>
                                            </div>
                                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                {new Date(banner.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
