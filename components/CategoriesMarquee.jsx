'use client';
import Link from 'next/link';

const CategoriesMarquee = ({ categories = [] }) => {
    return (
        <div className="overflow-hidden w-full relative max-w-7xl mx-auto select-none group sm:my-20">
            <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
            <div className="flex min-w-[200%] animate-[marqueeScroll_10s_linear_infinite] sm:animate-[marqueeScroll_40s_linear_infinite] group-hover:[animation-play-state:paused] gap-4">
                {[...categories, ...categories, ...categories, ...categories].map(
                    (category, index) => (
                        <Link key={index} href={`/shop?category=${category}`}>
                            <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-700 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
                                {category}
                            </button>
                        </Link>
                    )
                )}
            </div>
            <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
        </div>
    );
};

export default CategoriesMarquee;
