'use client';
import React from 'react';
import { ourSpecsData } from '@/assets/assets';

const OurSpecs = () => {
    return (
        <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="h-px w-8 bg-[#D6CEBE]" />
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#8C8275]">
                        LE STANDARD JULO
                    </span>
                    <div className="h-px w-8 bg-[#D6CEBE]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1C1B1F] tracking-tight">
                    L&apos;Excellence à Chaque Étape
                </h2>
                <p className="mt-2 text-[#8C8275] text-sm">
                    Une sélection rigoureuse d&apos;appareils électroniques et un atelier
                    d&apos;impression textile dédié.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {ourSpecsData.map((spec, index) => {
                    const Icon = spec.icon;
                    return (
                        <div
                            key={index}
                            className="rounded-2xl bg-white border border-[#EAE6DF] p-6 flex flex-col justify-between hover:shadow-xl hover:border-[#C59A63] transition-all duration-300 group"
                        >
                            <div>
                                <div
                                    className="size-12 rounded-full flex items-center justify-center text-white mb-5 group-hover:scale-105 transition-transform shadow-md"
                                    style={{ backgroundColor: '#C59A63' }}
                                >
                                    <Icon size={20} />
                                </div>
                                <h3 className="font-bold text-sm text-[#1C1B1F] group-hover:text-[#C59A63] transition-colors">
                                    {spec.title}
                                </h3>
                                <p className="text-xs font-normal text-[#8C8275] mt-2 leading-relaxed">
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
