export interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    minStock: number;
    category: string;
    cost?: number;
    description?: string;
    image?: string;
}

export interface Sale {
    id: string;
    date: string;
    customer: string;
    products: { productId: string; quantity: number; price: number }[];
    total: number;
    paymentMethod: string;
}

export interface Purchase {
    id: string;
    date: string;
    supplier: string;
    products: { productId: string; quantity: number; cost: number }[];
    total: number;
}

export interface Notification {
    id: string;
    message: string;
    type: 'warning' | 'info';
    read: boolean;
}