'use client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Title = ({ title, description, visibleButton = true, href = '' }) => {
    return (
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-8">
            <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-[#1C1B1F] tracking-tight">
                    {title}
                </h2>
                {description && (
                    <p className="text-[#8C8275] font-normal mt-0.5 sm:mt-1.5 text-xs sm:text-sm truncate">
                        {description}
                    </p>
                )}
            </div>
            {visibleButton && (
                <Link
                    href={href}
                    className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#10B981] hover:text-[#059669] shrink-0 transition-colors"
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
