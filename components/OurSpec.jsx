'use client';
import React from 'react';
import { ourSpecsData } from '@/assets/assets';

const OurSpecs = () => {
    return (
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                    Pourquoi choisir JULO ?
                </h2>
                <p className="mt-2 text-zinc-500 text-sm">
                    Une exigence absolue sur la qualité de nos produits et la rapidité de notre
                    service.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {ourSpecsData.map((spec, index) => {
                    const Icon = spec.icon;
                    return (
                        <div
                            key={index}
                            className="rounded-2xl bg-zinc-50 border border-zinc-200/80 p-6 flex flex-col justify-between hover:bg-white hover:border-zinc-950 hover:shadow-lg transition-all duration-200 group"
                        >
                            <div>
                                <div
                                    className="size-11 rounded-xl flex items-center justify-center text-white mb-5 group-hover:scale-105 transition-transform shadow-sm"
                                    style={{ backgroundColor: spec.accent }}
                                >
                                    <Icon size={20} />
                                </div>
                                <h3 className="font-bold text-sm text-zinc-900 group-hover:text-amber-600 transition-colors">
                                    {spec.title}
                                </h3>
                                <p className="text-xs font-normal text-zinc-500 mt-2 leading-relaxed">
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
