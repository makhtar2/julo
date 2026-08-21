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
    BookOpenIcon,
    EyeIcon,
} from 'lucide-react';
import Image from 'next/image';
import { addPost, updatePost, deletePost, getPosts } from '@/app/actions/blog';
import { uploadProductImage } from '@/app/actions/product';
import Title from '@/components/Title';
import Link from 'next/link';

export default function AdminBlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPostId, setCurrentPostId] = useState(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        isPublished: true,
        image: '',
    });
    const [previewImage, setPreviewImage] = useState(null);

    const fetchPosts = async () => {
        const res = await getPosts();
        if (res.posts) setPosts(res.posts);
        setLoading(false);
    };

    useEffect(() => {
        let ignore = false;
        (async () => {
            if (!ignore) await fetchPosts();
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
        setFormData({ title: '', content: '', excerpt: '', isPublished: true, image: '' });
        setPreviewImage(null);
        setIsEditing(false);
        setCurrentPostId(null);
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

            const postData = { ...formData, image: imageUrl };
            let res;

            if (isEditing) {
                res = await updatePost(currentPostId, postData);
            } else {
                res = await addPost(postData);
            }

            if (res.success) {
                toast.success(res.success);
                resetForm();
                fetchPosts();
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditClick = (post) => {
        setIsEditing(true);
        setCurrentPostId(post.id);
        setFormData({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt || '',
            isPublished: post.isPublished,
            image: post.image || '',
        });
        if (post.image) {
            setPreviewImage({ url: post.image, isExisting: true });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (id) => {
        if (confirm('Supprimer cet article ?')) {
            const res = await deletePost(id);
            if (res.success) {
                toast.success('Article supprimé');
                fetchPosts();
            } else {
                toast.error(res.error);
            }
        }
    };

    if (loading)
        return (
            <div className="flex justify-center py-20">
                <Loader2Icon className="animate-spin text-blue-600" size={48} />
            </div>
        );

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            <Title
                title="Gestion du Blog"
                description="Publiez des conseils et astuces pour vos clients."
                visibleButton={false}
            />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Form Section */}
                <div className="xl:col-span-5">
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl sticky top-10">
                        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                            {isEditing ? (
                                <Edit2Icon size={20} className="text-amber-500" />
                            ) : (
                                <PlusIcon size={20} className="text-blue-600" />
                            )}
                            {isEditing ? "Modifier l'Article" : 'Nouvel Article'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Image de couverture
                                </label>
                                <div
                                    onClick={() => fileInputRef.current.click()}
                                    className="relative aspect-[16/9] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 group transition-all"
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
                                                Uploader une image
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
                                    Titre de l&apos;article
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-blue-400 transition-all outline-none text-sm font-black"
                                    placeholder="ex: Comment entretenir son climatiseur"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Résumé court
                                </label>
                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-blue-400 transition-all outline-none text-sm font-medium resize-none"
                                    placeholder="Un petit texte pour la liste..."
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Contenu complet
                                </label>
                                <textarea
                                    required
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    rows={8}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-blue-400 transition-all outline-none text-sm font-medium resize-none"
                                    placeholder="Le texte de votre article..."
                                />
                            </div>

                            <div className="flex items-center gap-2 py-2">
                                <input
                                    type="checkbox"
                                    id="isPublished"
                                    name="isPublished"
                                    checked={formData.isPublished}
                                    onChange={handleInputChange}
                                    className="size-4 accent-blue-600"
                                />
                                <label
                                    htmlFor="isPublished"
                                    className="text-xs font-black text-slate-600 uppercase tracking-widest cursor-pointer"
                                >
                                    Publier immédiatement
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
                                    {isEditing ? 'METTRE À JOUR' : "PUBLIER L'ARTICLE"}
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
                    {posts.length === 0 ? (
                        <div className="bg-slate-50 rounded-[2.5rem] py-20 text-center border-2 border-dashed border-slate-200">
                            <BookOpenIcon size={48} className="text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold">Aucun article publié.</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-white border border-slate-100 rounded-[2rem] p-4 hover:shadow-xl transition-all group overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="relative aspect-video md:w-48 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                                        {post.image ? (
                                            <Image
                                                src={post.image}
                                                alt=""
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
                                                <ImageIcon size={32} />
                                            </div>
                                        )}
                                        <div
                                            className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${post.isPublished ? 'bg-blue-600 text-white' : 'bg-slate-400 text-white'}`}
                                        >
                                            {post.isPublished ? 'Publié' : 'Brouillon'}
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-black text-slate-900 text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-medium line-clamp-2">
                                                {post.excerpt ||
                                                    post.content.substring(0, 100) + '...'}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/blog/${post.id}`}
                                                    className="size-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
                                                >
                                                    <EyeIcon size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleEditClick(post)}
                                                    className="size-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-amber-500 hover:text-white transition-all"
                                                >
                                                    <Edit2Icon size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(post.id)}
                                                    className="size-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <Trash2Icon size={16} />
                                                </button>
                                            </div>
                                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                {new Date(post.createdAt).toLocaleDateString()}
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
