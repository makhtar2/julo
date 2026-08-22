'use client';
import React from 'react';
import { CheckCircle2, Clock, Package, Truck, Home } from 'lucide-react';

const statuses = [
    { id: 'ORDER_PLACED', label: 'En attente', icon: Clock },
    { id: ['PAID', 'CONFIRMED'], label: 'Validée', icon: CheckCircle2 },
    { id: 'PROCESSING', label: 'Préparation', icon: Package },
    { id: 'SHIPPED', label: 'Expédiée', icon: Truck },
    { id: 'DELIVERED', label: 'Livrée', icon: Home },
];

const OrderStatusProgress = ({ currentStatus }) => {
    const currentIndex = statuses.findIndex((s) =>
        Array.isArray(s.id) ? s.id.includes(currentStatus) : s.id === currentStatus
    );

    return (
        <div className="w-full py-6">
            <div className="relative flex justify-between">
                {/* Progress Line Background */}
                <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-10" />

                {/* Active Progress Line */}
                <div
                    className="absolute top-5 left-0 h-0.5 bg-[#10B981] transition-all duration-1000 -z-10"
                    style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
                />

                {statuses.map((status, index) => {
                    const Icon = status.icon;
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const isPending = index > currentIndex;

                    return (
                        <div key={status.id} className="flex flex-col items-center gap-2">
                            <div
                                className={`size-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 shadow-sm
                  ${
                      isCompleted
                          ? 'bg-[#10B981] border-[#10B981] text-white'
                          : isCurrent
                            ? 'bg-white border-[#10B981] text-[#10B981] scale-110 shadow-md shadow-[#10B981]/20'
                            : 'bg-white border-slate-100 text-slate-300'
                  }
                `}
                            >
                                {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                            </div>
                            <span
                                className={`text-[9px] font-black uppercase tracking-widest ${isCurrent ? 'text-[#10B981]' : 'text-slate-400'}`}
                            >
                                {status.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderStatusProgress;
