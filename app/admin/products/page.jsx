'use client';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
    Edit2Icon,
    Trash2Icon,
    PlusIcon,
    SearchIcon,
    ImageIcon,
    PackageOpenIcon,
    XIcon,
    UploadCloudIcon,
    Loader2Icon,
} from 'lucide-react';
import Image from 'next/image';
import {
    addProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    uploadProductImage,
} from '@/app/actions/product';
import { getCategories } from '@/app/actions/category';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [stockFilter, setStockFilter] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const fileInputRef = useRef(null);

    // Form state for creating/editing
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        mrp: 0,
        price: 0,
        categoryId: '',
        stock: 0,
        guarantee: '6 mois',
    });

    const fetchData = async () => {
        const [prodRes, catRes] = await Promise.all([getProducts(), getCategories()]);
        if (prodRes.products) setProducts(prodRes.products);
        if (catRes.categories) setCategories(catRes.categories);
        setLoading(false);
    };

    useEffect(() => {
        let ignore = false;
        (async () => {
            if (!ignore) await fetchData();
        })();
        return () => {
            ignore = true;
        };
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setSelectedImages((prev) => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        const updatedImages = [...selectedImages];
        if (!updatedImages[index].isExisting) {
            URL.revokeObjectURL(updatedImages[index].url);
        }
        updatedImages.splice(index, 1);
        setSelectedImages(updatedImages);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            mrp: 0,
            price: 0,
            categoryId: '',
            stock: 0,
            guarantee: '6 mois',
        });
        setSelectedImages([]);
        setIsEditing(false);
        setCurrentProductId(null);
        setIsFormOpen(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // 1. Handle image uploads for new files
            const imageUrls = [];

            for (const img of selectedImages) {
                if (img.isExisting) {
                    imageUrls.push(img.url);
                } else {
                    const uploadRes = await uploadProductImage(img.file);
                    if (uploadRes.success) {
                        imageUrls.push(uploadRes.url);
                    } else {
                        throw new Error(uploadRes.error || "Erreur lors de l'upload d'une image");
                    }
                }
            }

            const productData = {
                ...formData,
                images: imageUrls,
            };

            let res;
            if (isEditing) {
                res = await updateProduct(currentProductId, productData);
            } else {
                res = await addProduct(productData);
            }

            if (res.success) {
                toast.success(res.success);
                resetForm();
                fetchData();
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            toast.error(error.message || 'Une erreur est survenue');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditClick = (product) => {
        setIsEditing(true);
        setCurrentProductId(product.id);
        setFormData({
            name: product.name,
            description: product.description,
            mrp: product.mrp,
            price: product.price,
            categoryId: product.categoryId,
            stock: product.stock || 0,
            guarantee: product.guarantee || '6 mois',
        });

        const existingImages = (product.images || []).map((imgUrl) => ({
            url: imgUrl,
            isExisting: true,
        }));
        setSelectedImages(existingImages);
        setIsFormOpen(true);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            const res = await deleteProduct(id);
            if (res.success) {
                toast.success('Produit supprimé!');
                fetchData();
            } else {
                toast.error(res.error);
            }
        }
    };

    const toggleStock = async (id, currentInStock) => {
        const newInStock = !currentInStock;
        // If marking as in stock but stock is 0, set to default 10
        const product = products.find((p) => p.id === id);
        const newStock = newInStock && (product?.stock || 0) === 0 ? 10 : newInStock ? 10 : 0;

        const res = await updateProduct(id, { stock: newStock });
        if (res.success) {
            toast.success(`Stock mis à jour!`);
            fetchData();
        } else {
            toast.error(res.error);
        }
    };

    const filteredProducts = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStock =
            stockFilter === 'all'
                ? true
                : stockFilter === 'low'
                  ? (p.stock || 0) > 0 && (p.stock || 0) <= 5
                  : stockFilter === 'out'
                    ? !p.inStock || (p.stock || 0) <= 0
                    : p.inStock && (p.stock || 0) > 0;
        return matchesSearch && matchesStock;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2Icon className="animate-spin text-blue-600" size={48} />
                <p className="font-bold text-slate-500">Chargement du catalogue...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                        Catalogue
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                        Produits
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Ajoutez, modifiez et surveillez le stock de la boutique.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            setIsEditing(false);
                            setIsFormOpen(true);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all"
                    >
                        <PlusIcon size={16} />
                        Ajouter
                    </button>
                    <div className="relative group w-full sm:w-80">
                        <SearchIcon
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Rechercher un produit..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-400 w-full transition-all text-sm font-bold shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar rounded-[2rem] bg-white border border-slate-100 p-3 shadow-sm">
                {[
                    { value: 'all', label: `Tous (${products.length})` },
                    {
                        value: 'in',
                        label: `En stock (${products.filter((p) => p.inStock && (p.stock || 0) > 0).length})`,
                    },
                    {
                        value: 'low',
                        label: `Stock faible (${products.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length})`,
                    },
                    {
                        value: 'out',
                        label: `Épuisés (${products.filter((p) => !p.inStock || (p.stock || 0) <= 0).length})`,
                    },
                ].map((filter) => (
                    <button
                        key={filter.value}
                        type="button"
                        onClick={() => setStockFilter(filter.value)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${stockFilter === filter.value ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
                {/* Form Section */}
                <div
                    className={`xl:col-span-5 order-1 xl:order-1 ${isFormOpen ? 'block' : 'hidden xl:block'}`}
                >
                    <div className="bg-white border border-slate-200 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-slate-200/50 xl:sticky xl:top-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div
                                className={`p-3 rounded-2xl ${isEditing ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}
                            >
                                {isEditing ? <Edit2Icon size={24} /> : <PlusIcon size={24} />}
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 flex-1">
                                {isEditing ? "Modifier l'Article" : 'Nouvel Article'}
                            </h2>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="xl:hidden size-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center"
                            >
                                <XIcon size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Image Upload Area */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                    Images du Produit
                                </label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {selectedImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group"
                                        >
                                            <Image
                                                src={img.url}
                                                alt="preview"
                                                fill
                                                className="object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-white/90 text-red-500 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <XIcon size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        disabled={submitting}
                                        onClick={() => fileInputRef.current.click()}
                                        className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all bg-slate-50/50 disabled:opacity-50"
                                    >
                                        <UploadCloudIcon size={20} />
                                        <span className="text-[10px] font-bold uppercase">
                                            Ajouter
                                        </span>
                                    </button>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                    Nom du produit
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-400 transition-all outline-none text-sm font-bold text-slate-700"
                                    placeholder="ex: Ventilateur GE 1030"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                        Prix (FCFA)
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-400 transition-all outline-none text-sm font-black text-blue-600"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                        Ancien Prix
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        name="mrp"
                                        value={formData.mrp}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-400 transition-all outline-none text-sm font-bold text-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                        Catégorie
                                    </label>
                                    <select
                                        required
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-400 transition-all outline-none text-sm font-bold text-slate-600 appearance-none"
                                    >
                                        <option value="" disabled>
                                            Choisir une catégorie...
                                        </option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                        Stock (Quantité)
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-400 transition-all outline-none text-sm font-bold text-slate-700"
                                        placeholder="ex: 10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                    Garantie
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="guarantee"
                                    value={formData.guarantee || '6 mois'}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-400 transition-all outline-none text-sm font-bold text-slate-700"
                                    placeholder="ex: 6 mois, 1 an"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                    Description
                                </label>
                                <textarea
                                    required
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-400 transition-all outline-none resize-none text-sm font-medium leading-relaxed"
                                    placeholder="Détails du produit..."
                                />
                            </div>

                            <div className="flex flex-col gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full py-4 rounded-2xl text-white font-black text-sm tracking-widest transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2 ${isEditing ? 'bg-amber-500 shadow-amber-500/20 hover:bg-amber-600' : 'bg-slate-900 shadow-slate-900/20 hover:bg-black'} disabled:opacity-70`}
                                >
                                    {submitting && (
                                        <Loader2Icon size={18} className="animate-spin" />
                                    )}
                                    {isEditing
                                        ? 'METTRE À JOUR LE PRODUIT'
                                        : 'AJOUTER AU CATALOGUE'}
                                </button>
                                {isEditing && !submitting && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-colors"
                                    >
                                        ANNULER
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="xl:col-span-7 order-2 xl:order-2">
                    {filteredProducts.length === 0 ? (
                        <div className="bg-slate-50 rounded-[2.5rem] py-32 text-center border border-dashed border-slate-200 px-6">
                            <PackageOpenIcon size={60} className="text-slate-200 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-slate-400">
                                Aucun produit trouvé
                            </h3>
                            <p className="text-slate-400 text-sm mt-2">
                                Essayez un autre mot-clé ou ajoutez un produit.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="hidden md:flex items-center px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                                <span className="w-16">Image</span>
                                <span className="flex-1 ml-6">Produit</span>
                                <span className="w-32">Prix</span>
                                <span className="w-32">Statut</span>
                                <span className="w-32 text-right">Actions</span>
                            </div>
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white border border-slate-100 rounded-3xl p-4 md:p-5 md:px-8 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 group relative"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="size-16 md:size-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 p-2 relative overflow-hidden">
                                            {product.images && product.images.length > 0 ? (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    className="object-contain p-2"
                                                />
                                            ) : (
                                                <ImageIcon className="text-slate-200" size={24} />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">
                                                        {product.Category?.name || 'Sans catégorie'}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-slate-800 truncate text-base md:text-lg tracking-tight">
                                                    {product.name}
                                                </h3>
                                            </div>

                                            <div className="flex items-center gap-8 md:gap-12">
                                                <div className="w-24 md:w-32">
                                                    <p className="font-black text-slate-900 text-sm md:text-base">
                                                        {product.price.toLocaleString('fr-SN')}{' '}
                                                        <small className="text-[10px] text-slate-400">
                                                            FCFA
                                                        </small>
                                                    </p>
                                                </div>

                                                <div className="w-24 md:w-32">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.inStock ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}
                                                    >
                                                        {product.inStock ? 'En Stock' : 'Épuisé'}
                                                    </span>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase text-center">
                                                        {product.stock || 0} unités
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 md:w-32 md:justify-end">
                                                    <button
                                                        onClick={() => handleEditClick(product)}
                                                        className="size-9 md:size-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                                                        title="Modifier"
                                                    >
                                                        <Edit2Icon size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            toggleStock(product.id, product.inStock)
                                                        }
                                                        className={`size-9 md:size-10 flex items-center justify-center rounded-xl transition-all shadow-sm ${product.inStock ? 'bg-slate-50 text-slate-400 hover:bg-blue-500 hover:text-white' : 'bg-red-50 text-red-500 hover:bg-red-600 hover:text-white'}`}
                                                        title={
                                                            product.inStock
                                                                ? 'Marquer comme épuisé'
                                                                : 'Marquer comme en stock'
                                                        }
                                                    >
                                                        <PackageOpenIcon size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteClick(product.id)
                                                        }
                                                        className="size-9 md:size-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2Icon size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
