'use client';
import Link from 'next/link';

const CategoriesMarquee = ({ categories = [] }) => {
    return (
        <div className="overflow-hidden w-full relative max-w-7xl mx-auto select-none group my-6 sm:my-10">
            <div className="absolute left-0 top-0 h-full w-16 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
            <div className="flex min-w-[200%] animate-[marqueeScroll_12s_linear_infinite] sm:animate-[marqueeScroll_35s_linear_infinite] group-hover:[animation-play-state:paused] gap-3">
                {[...categories, ...categories, ...categories, ...categories].map(
                    (category, index) => (
                        <Link key={index} href={`/shop?category=${encodeURIComponent(category)}`}>
                            <span className="inline-block px-4 py-2 bg-zinc-100 rounded-xl text-zinc-800 text-xs font-bold hover:bg-zinc-950 hover:text-white border border-zinc-200 transition-all duration-200">
                                {category}
                            </span>
                        </Link>
                    )
                )}
            </div>
            <div className="absolute right-0 top-0 h-full w-16 md:w-32 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
        </div>
    );
};

export default CategoriesMarquee;
