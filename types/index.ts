export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'USER' | 'ADMIN';
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    mrp: number;
    price: number;
    images: string[];
    categoryId?: string;
    inStock: boolean;
    stock: number;
    createdAt: string;
}

export interface Address {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zip?: string;
    country: string;
    latitude?: number;
    longitude?: number;
    createdAt: string;
}

export type OrderStatus =
    | 'ORDER_PLACED'
    | 'CONFIRMED'
    | 'PAID'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED';

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    createdAt: string;
    product?: Product;
}

export interface Order {
    id: string;
    userId: string;
    addressId?: string;
    total: number;
    status: OrderStatus;
    paymentMethod: string;
    createdAt: string;

    // Relations
    user?: User;
    address?: Address;
    orderItems?: OrderItem[];
}
