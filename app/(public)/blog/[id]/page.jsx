'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPost } from '@/app/actions/blog';
import { motion } from 'framer-motion';
import {
    ArrowLeftIcon,
    CalendarIcon,
    ClockIcon,
    Share2Icon,
    FacebookIcon,
    MessageCircleIcon,
} from 'lucide-react';
import Loading from '@/components/Loading';
import Link from 'next/link';

export default function BlogPostPage() {
    const { id } = useParams();
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            const res = await getPost(id);
            if (res.post) setPost(res.post);
            else router.push('/blog');
            setLoading(false);
        };
        fetchPost();
    }, [id, router]);

    if (loading) return <Loading />;
    if (!post) return null;

    // Simple Markdown Parser pour ###, **gras** et listes (-)
    const renderContent = (content) => {
        const lines = content.split('\n');
        let inList = false;
        let listItems = [];
        const renderedElements = [];

        const flushList = () => {
            if (inList && listItems.length > 0) {
                renderedElements.push(
                    <ul key={`ul-${renderedElements.length}`} className="mb-10 space-y-4">
                        {listItems.map((li, idx) => (
                            <li
                                key={idx}
                                className="flex gap-4 items-start text-lg sm:text-xl text-slate-600 font-medium leading-[1.8]"
                            >
                                <span className="mt-2.5 size-2 shrink-0 rounded-full bg-blue-500" />
                                <span dangerouslySetInnerHTML={{ __html: li }} />
                            </li>
                        ))}
                    </ul>
                );
                listItems = [];
                inList = false;
            }
        };

        lines.forEach((line, index) => {
            // Rendu du gras (**)
            let formattedLine = line.replace(
                /\*\*(.*?)\*\*/g,
                '<strong class="font-black text-slate-900">$1</strong>'
            );

            if (line.trim().startsWith('### ')) {
                flushList();
                renderedElements.push(
                    <h3
                        key={`h3-${index}`}
                        className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-16 mb-6"
                    >
                        {line.replace('### ', '')}
                    </h3>
                );
            } else if (line.trim().startsWith('- ')) {
                inList = true;
                listItems.push(formattedLine.replace('- ', ''));
            } else if (line.trim() === '') {
                flushList();
            } else {
                flushList();
                renderedElements.push(
                    <p
                        key={`p-${index}`}
                        className="text-lg sm:text-xl text-slate-600 font-medium leading-[1.8] mb-8"
                        dangerouslySetInnerHTML={{ __html: formattedLine }}
                    />
                );
            }
        });

        flushList(); // Vider la dernière liste s'il y en a une
        return renderedElements;
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Minimalist Header */}
            <div className="bg-white border-b border-slate-100 py-16 sm:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 transition-all mb-12 w-fit"
                    >
                        <ArrowLeftIcon size={16} />
                        Retour aux articles
                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex flex-wrap items-center gap-6 text-xs font-black text-blue-600 uppercase tracking-[0.2em]">
                            <span className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                                <CalendarIcon size={14} />
                                {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>
                            <span className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                                <ClockIcon size={14} />5 MIN LECTURE
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1]">
                            {post.title}
                        </h1>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    {/* Share Sidebar */}
                    <div className="lg:w-16 lg:sticky lg:top-32 h-fit flex lg:flex-col gap-4">
                        <button className="size-14 bg-white border border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-900 rounded-[1.25rem] shadow-sm flex items-center justify-center transition-all">
                            <Share2Icon size={20} />
                        </button>
                        <button className="size-14 bg-white border border-slate-100 text-slate-400 hover:border-[#1877F2] hover:text-[#1877F2] rounded-[1.25rem] shadow-sm flex items-center justify-center transition-all">
                            <FacebookIcon size={20} />
                        </button>
                        <button className="size-14 bg-white border border-slate-100 text-slate-400 hover:border-[#25D366] hover:text-[#25D366] rounded-[1.25rem] shadow-sm flex items-center justify-center transition-all">
                            <MessageCircleIcon size={20} />
                        </button>
                    </div>

                    {/* Article Body */}
                    <div className="flex-1">
                        <div className="prose-none max-w-none">{renderContent(post.content)}</div>

                        {/* Tag/Category Footer */}
                        <div className="mt-20 pt-16 border-t border-slate-200 flex flex-wrap gap-4">
                            <span className="px-6 py-3 bg-white border border-slate-100 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm">
                                Électroménager
                            </span>
                            <span className="px-6 py-3 bg-white border border-slate-100 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm">
                                Sénégal
                            </span>
                            <span className="px-6 py-3 bg-white border border-slate-100 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm">
                                Global Air
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-slate-900 py-24 px-4 mt-12 rounded-t-[3rem] sm:rounded-t-[5rem]">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-8">
                        L&apos;excellence pour votre foyer.
                    </h3>
                    <p className="text-slate-400 font-medium mb-12 max-w-xl mx-auto text-lg sm:text-xl leading-relaxed">
                        Découvrez notre sélection premium d&apos;équipements adaptés au climat
                        sénégalais.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-flex px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 shadow-2xl shadow-blue-600/20 transition-all"
                    >
                        Explorer la boutique
                    </Link>
                </div>
            </div>
        </div>
    );
}
