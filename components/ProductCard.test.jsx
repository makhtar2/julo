import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard';

// Mocking Next.js components
vi.mock('next/image', () => ({
    // eslint-disable-next-line @next/next/no-img-element -- mock stands in for next/image in tests
    default: ({ src, alt }) => <img src={src} alt={alt} />,
}));

vi.mock('next/link', () => ({
    default: ({ children, href }) => <a href={href}>{children}</a>,
}));

// Mocking Next.js navigation (useRouter needs App Router context in tests)
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
    }),
    usePathname: () => '/',
    useParams: () => ({}),
}));

describe('ProductCard', () => {
    const mockProduct = {
        id: '1',
        name: 'Ventilateur Test',
        price: 15000,
        mrp: 20000,
        images: ['/test.jpg'],
        category: 'Ventilateurs',
        rating: [],
        inStock: true,
        stock: 10,
    };

    it('renders product details correctly', () => {
        render(<ProductCard product={mockProduct} />);

        expect(screen.getByText('Ventilateur Test')).toBeInTheDocument();
        // Check formatted price (handle different space characters)
        const priceElement = screen.getByText(/15.*000/);
        expect(priceElement).toBeInTheDocument();
        // Check promo badge
        expect(screen.getByText('-25%')).toBeInTheDocument();
    });

    it('renders "Épuisé" badge for out of stock products', () => {
        const outOfStockProduct = { ...mockProduct, inStock: false, stock: 0 };
        render(<ProductCard product={outOfStockProduct} />);
        expect(screen.getByText('Épuisé')).toBeInTheDocument();
    });

    it('renders without promo badge if mrp equals price', () => {
        const productWithoutPromo = { ...mockProduct, mrp: 15000, inStock: true, stock: 10 };
        render(<ProductCard product={productWithoutPromo} />);
        expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument();
    });
});
