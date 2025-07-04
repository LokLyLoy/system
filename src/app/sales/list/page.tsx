'use client';

import SalesList from '@/components/Sales/SalesList';
import { useAppContext } from '@/contexts/AppContext';

export default function SalesListPage() {
    const { sales, products } = useAppContext();

    return <SalesList sales={sales} products={products} />;
}