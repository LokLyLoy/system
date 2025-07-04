'use client';

import ProductsList from '@/components/Products/ProductsList';
import { useAppContext } from '@/contexts/AppContext';

export default function ProductsListPage() {
    const { products } = useAppContext();

    return <ProductsList products={products} />;
}