'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    HomeIcon,
    ShoppingBasketIcon,
    ClipboardListIcon,
    BarChart3Icon,
    ImageDown,
    BookOpen,
    LayersIcon,
    TicketIcon,
} from 'lucide-react';

export const adminMenuLinks = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Commandes', href: '/admin/orders', icon: ClipboardListIcon },
    { name: 'Produits', href: '/admin/products', icon: ShoppingBasketIcon },
    { name: 'Catégories', href: '/admin/categories', icon: LayersIcon },
    { name: 'Coupons', href: '/admin/coupons', icon: TicketIcon },
    { name: 'Bannières', href: '/admin/banners', icon: ImageDown },
    { name: 'Blog', href: '/admin/blog', icon: BookOpen },
    { name: 'Analyse', href: '/admin/analytics', icon: BarChart3Icon },
];

const AdminMenu = () => {
    const pathname = usePathname();

    return (
        <nav className="relative">
            <div className="flex lg:flex-col items-center lg:items-stretch overflow-x-auto no-scrollbar gap-2 lg:gap-1">
                {adminMenuLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all ${
                                isActive
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            <Icon size={16} />
                            {link.name}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default AdminMenu;
