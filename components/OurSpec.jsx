'use client';
import React from 'react';
import { ourSpecsData } from '@/assets/assets';

const OurSpecs = () => {
    return (
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-blanka tracking-wider text-zinc-700 mb-3">
                    LE STANDARD JULO
                </div>
                <h2 className="font-blanka text-3xl sm:text-4xl text-zinc-950 tracking-wider uppercase">
                    ENGAGEMENTS &amp; QUALITÉ.
                </h2>
                <p className="mt-3 text-zinc-600 text-sm font-medium">
                    Une exigence absolue sur la provenance de nos équipements et le savoir-faire de
                    notre atelier d&apos;impression.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {ourSpecsData.map((spec, index) => {
                    const Icon = spec.icon;
                    return (
                        <div
                            key={index}
                            className="rounded-3xl bg-zinc-50 border border-zinc-200/80 p-6 sm:p-7 flex flex-col justify-between hover:bg-white hover:border-zinc-950 hover:shadow-xl transition-all duration-300 group"
                        >
                            <div>
                                <div
                                    className="size-12 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform shadow-md"
                                    style={{ backgroundColor: spec.accent }}
                                >
                                    <Icon size={22} />
                                </div>
                                <h3 className="font-black text-base text-zinc-900 group-hover:text-amber-600 transition-colors">
                                    {spec.title}
                                </h3>
                                <p className="text-xs font-medium text-zinc-500 mt-2.5 leading-relaxed">
                                    {spec.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default OurSpecs;
