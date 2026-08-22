'use client';
import React from 'react';
import { motion } from 'framer-motion';

const WhatsAppIcon = ({ size = 24, className = '' }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        width={size}
        height={size}
        className={className}
    >
        <path d="M12.004 2c-5.51 0-9.993 4.483-9.993 9.993 0 1.763.457 3.42 1.257 4.874L2 22l5.282-1.385c1.41.77 3.012 1.205 4.718 1.205 5.51 0 9.996-4.486 9.996-9.996 0-5.51-4.486-9.993-9.996-9.993zm5.665 14.248c-.244.688-1.21 1.249-1.666 1.291-.454.041-.9-.082-2.88-.867-2.535-1.004-4.133-3.583-4.26-3.753-.127-.17-.936-1.244-.936-2.373 0-1.129.573-1.684.806-1.917.234-.234.509-.297.68-.297.17 0 .34.002.488.01.15.007.34-.056.531.403.19.46.658 1.61.716 1.726.059.117.098.254.02.411-.078.156-.118.254-.235.39-.116.136-.245.304-.35.408-.117.117-.24.244-.103.48.137.234.608 1.004 1.301 1.62.89.794 1.64 1.04 1.874 1.157.234.117.371.098.51-.059.137-.156.59-.688.749-.92.158-.234.318-.196.53-.117.214.078 1.354.638 1.587.755.234.117.39.176.447.273.056.097.056.559-.188 1.247z" />
    </svg>
);

const WhatsAppButton = () => {
    const phoneNumber = '221754469097';
    const message =
        'Bonjour JULO, je souhaiterais avoir des informations sur vos smartphones, ordinateurs et accessoires disponibles.';

    const handleClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="fixed bottom-20 sm:bottom-8 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white p-3 sm:px-5 sm:py-3 rounded-full shadow-lg shadow-[#25D366]/25 border border-white/30 transition-all"
            aria-label="Contactez-nous sur WhatsApp"
        >
            <div className="relative">
                <WhatsAppIcon size={24} className="brightness-0 invert" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
            </div>

            <span className="hidden sm:block font-bold text-xs text-white uppercase tracking-wider">
                WhatsApp
            </span>
        </motion.button>
    );
};

export default WhatsAppButton;
