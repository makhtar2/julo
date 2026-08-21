'use client';
import { useState, useEffect } from 'react';
import { getPosts } from '@/app/actions/blog';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpenIcon, ArrowRightIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import Loading from '@/components/Loading';

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await getPosts();
            if (res.posts) setPosts(res.posts.filter((p) => p.isPublished));
            setLoading(false);
        };
        fetchPosts();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-slate-50/50 py-16 sm:py-24 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8"
                    >
                        <BookOpenIcon size={16} />
                        Conseils & Expertises
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter"
                    >
                        Le Blog <span className="text-blue-600">Global Air</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 text-slate-500 font-medium max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed"
                    >
                        Découvrez nos guides d&apos;entretien, conseils d&apos;achat et astuces pour
                        optimiser le confort de votre foyer au Sénégal.
                    </motion.p>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl">
                        <BookOpenIcon size={64} className="text-slate-200 mx-auto mb-6" />
                        <p className="text-slate-400 font-bold text-xl">
                            Bientôt de nouveaux articles !
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8 sm:gap-10">
                        {posts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 sm:p-12 hover:-translate-y-2 transition-all duration-500 hover:border-blue-100"
                            >
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-wrap items-center gap-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-2">
                                            <CalendarIcon size={14} className="text-blue-500" />
                                            {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <ClockIcon size={14} className="text-blue-500" />5 min
                                            lecture
                                        </span>
                                    </div>

                                    <Link href={`/blog/${post.id}`}>
                                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors leading-[1.1]">
                                            {post.title}
                                        </h2>
                                    </Link>

                                    <p className="text-slate-500 text-base sm:text-lg font-medium leading-relaxed max-w-4xl">
                                        {post.excerpt || post.content.substring(0, 200) + '...'}
                                    </p>

                                    <div className="pt-4">
                                        <Link
                                            href={`/blog/${post.id}`}
                                            className="inline-flex items-center gap-3 text-blue-600 font-black text-sm uppercase tracking-widest group/btn hover:text-blue-700 transition-colors"
                                        >
                                            Lire l&apos;article complet
                                            <div className="size-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all duration-300">
                                                <ArrowRightIcon
                                                    size={18}
                                                    className="group-hover/btn:translate-x-1 transition-transform"
                                                />
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
