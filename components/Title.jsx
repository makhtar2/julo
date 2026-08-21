'use client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Title = ({ title, description, visibleButton = true, href = '' }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {title}
                </h2>
                <p className="text-slate-600 font-medium mt-3 text-sm sm:text-base">
                    {description}
                </p>
            </div>
            {visibleButton && (
                <Link
                    href={href}
                    className="group inline-flex items-center gap-2 bg-slate-50 text-slate-900 px-6 py-3 rounded-2xl font-bold text-sm border border-slate-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300"
                >
                    Voir tout le catalogue{' '}
                    <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                    />
                </Link>
            )}
        </div>
    );
};

export default Title;
