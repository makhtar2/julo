'use client';
import React from 'react';
import { ourSpecsData } from '@/assets/assets';

const OurSpecs = () => {
    return (
        <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="h-px w-8 bg-[#D6CEBE]" />
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#8C8275]">
                        LE STANDARD JULO
                    </span>
                    <div className="h-px w-8 bg-[#D6CEBE]" />
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-[#1C1B1F] tracking-tight">
                    L&apos;Excellence à Chaque Étape
                </h2>
                <p className="mt-1.5 text-[#8C8275] text-xs sm:text-sm">
                    Une sélection rigoureuse de smartphones, ordinateurs et équipements high-tech
                    certifiés.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
                {ourSpecsData.map((spec, index) => {
                    const Icon = spec.icon;
                    return (
                        <div
                            key={index}
                            className="rounded-2xl bg-white border border-[#EAE6DF] p-4 sm:p-6 flex flex-col justify-between hover:shadow-xl hover:border-[#C59A63] transition-all duration-300 group"
                        >
                            <div>
                                <div
                                    className="size-10 sm:size-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-3 sm:mb-5 group-hover:scale-105 transition-transform shadow-xs"
                                    style={{ backgroundColor: '#C59A63' }}
                                >
                                    <Icon size={18} />
                                </div>
                                <h3 className="font-bold text-xs sm:text-sm text-[#1C1B1F] group-hover:text-[#C59A63] transition-colors">
                                    {spec.title}
                                </h3>
                                <p className="text-[11px] sm:text-xs font-normal text-[#8C8275] mt-1.5 leading-relaxed">
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
