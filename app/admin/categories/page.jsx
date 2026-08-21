'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { LayersIcon, Loader2Icon, PlusIcon, SearchIcon, TagIcon, Trash2Icon } from 'lucide-react';
import { addCategory, deleteCategory, getCategories } from '@/app/actions/category';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        const res = await getCategories();
        if (res.categories) setCategories(res.categories);
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

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setSubmitting(true);
        const res = await addCategory(newCategoryName.trim());
        setSubmitting(false);

        if (res.success) {
            toast.success(res.success);
            setNewCategoryName('');
            fetchData();
        } else {
            toast.error(res.error);
        }
    };

    const handleDeleteCategory = async (catId, catName) => {
        if (
            window.confirm(
                `Supprimer la catégorie "${catName}" ? Cette action peut affecter les produits liés.`
            )
        ) {
            const res = await deleteCategory(catId);
            if (res.success) {
                toast.success(res.success);
                fetchData();
            } else {
                toast.error(res.error);
            }
        }
    };

    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2Icon className="animate-spin text-blue-600" size={44} />
                <p className="font-bold text-slate-500">Chargement des catégories...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
                <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">
                        Organisation
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                        Catégories
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-2">
                        Structurez la boutique pour aider vos clients à trouver vite.
                    </p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-100 px-5 py-4 shadow-sm">
                    <p className="text-2xl font-black text-slate-900">{categories.length}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Catégories
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-4">
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-5 sm:p-6 shadow-sm lg:sticky lg:top-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <PlusIcon size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-900">
                                    Nouvelle catégorie
                                </h2>
                                <p className="text-xs font-medium text-slate-400">
                                    Ex: Climatisation, Électroménager
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleAddCategory} className="space-y-4">
                            <input
                                required
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-400 transition-all outline-none text-sm font-bold text-slate-700"
                                placeholder="Nom de la catégorie"
                            />
                            <button
                                type="submit"
                                disabled={submitting || !newCategoryName.trim()}
                                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-slate-900/10 hover:bg-black disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {submitting && <Loader2Icon size={16} className="animate-spin" />}
                                Ajouter
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-4">
                    <div className="relative group">
                        <SearchIcon
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Rechercher une catégorie..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-blue-400 w-full transition-all text-sm font-bold shadow-sm"
                        />
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[2rem] p-4 sm:p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <div className="flex items-center gap-2">
                                <LayersIcon size={18} className="text-blue-600" />
                                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                    Liste
                                </h2>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {filteredCategories.length} affichées
                            </span>
                        </div>

                        {filteredCategories.length === 0 ? (
                            <div className="py-20 text-center opacity-40">
                                <TagIcon size={44} className="mx-auto mb-4" />
                                <p className="font-bold">Aucune catégorie trouvée</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {filteredCategories.map((cat) => (
                                    <div
                                        key={cat.id}
                                        className="group flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-slate-200/40 transition-all"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="size-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600">
                                                <TagIcon size={18} />
                                            </div>
                                            <span className="font-black text-slate-700 truncate">
                                                {cat.name}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                            className="size-9 flex items-center justify-center rounded-xl bg-white text-slate-300 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            title="Supprimer"
                                        >
                                            <Trash2Icon size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
