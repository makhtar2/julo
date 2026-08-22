'use client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Title = ({ title, description, visibleButton = true, href = '' }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                    {title}
                </h2>
                {description && (
                    <p className="text-zinc-500 font-normal mt-2 text-sm sm:text-base">
                        {description}
                    </p>
                )}
            </div>
            {visibleButton && (
                <Link
                    href={href}
                    className="group inline-flex items-center gap-2 bg-zinc-950 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-amber-500 hover:text-zinc-950 transition-all duration-200 self-start md:self-auto shadow-sm"
                >
                    <span>Voir tout</span>
                    <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                    />
                </Link>
            )}
        </div>
    );
};

export default Title;
