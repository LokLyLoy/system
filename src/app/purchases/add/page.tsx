'use client';

import { useRouter } from 'next/navigation';
import AddPurchase from '@/components/Purchases/AddPurchase';
import { useAppContext } from '@/contexts/AppContext';

export default function AddPurchasePage() {
    const { products, purchases, setPurchases, setProducts } = useAppContext();
    const router = useRouter();

    const handleSetActiveView = (view: string) => {
        if (view === 'purchases-list') {
            router.push('/purchases/list');
        }
    };

    return (
        <AddPurchase
            products={products}
            purchases={purchases}
            setPurchases={setPurchases}
            setProducts={setProducts}
            setActiveView={handleSetActiveView}
        />
    );
}