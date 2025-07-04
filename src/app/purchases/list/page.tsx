'use client';

import PurchasesList from '@/components/Purchases/PurchasesList';
import { useAppContext } from '@/contexts/AppContext';

export default function PurchasesListPage() {
    const { purchases, products } = useAppContext();

    return <PurchasesList purchases={purchases} products={products} />;
}