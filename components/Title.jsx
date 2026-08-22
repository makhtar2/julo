'use client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Title = ({ title, description, visibleButton = true, href = '' }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
                <h2 className="text-2xl sm:text-3xl font-black text-[#1C1B1F] tracking-tight">
                    {title}
                </h2>
                {description && (
                    <p className="text-[#8C8275] font-normal mt-2 text-sm sm:text-base">
                        {description}
                    </p>
                )}
            </div>
            {visibleButton && (
                <Link
                    href={href}
                    className="group inline-flex items-center gap-2 text-xs font-bold text-[#1C1B1F] hover:text-[#C59A63] underline underline-offset-4 transition-colors self-start md:self-auto"
                >
                    <span>Voir tout</span>
                    <ArrowRight
                        size={13}
                        className="group-hover:translate-x-1 transition-transform"
                    />
                </Link>
            )}
        </div>
    );
};

export default Title;
