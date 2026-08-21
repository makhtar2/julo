'use client';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

const PageTitle = ({ heading, text, path = '/', linkText }) => {
    return (
        <div className="mb-10">
            {linkText && (
                <Link
                    href={path}
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-colors mb-6 group"
                >
                    <ArrowLeftIcon
                        size={14}
                        className="group-hover:-translate-x-1 transition-transform"
                    />
                    {linkText}
                </Link>
            )}
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {heading}
            </h2>
            <p className="text-slate-500 mt-2 font-medium text-sm sm:text-base">{text}</p>
        </div>
    );
};

export default PageTitle;
