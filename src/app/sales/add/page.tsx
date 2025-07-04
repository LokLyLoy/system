'use client';

import { useRouter } from 'next/navigation';
import AddSale from '@/components/Sales/AddSale';
import { useAppContext } from '@/contexts/AppContext';

export default function AddSalePage() {
    const { products, sales, setSales, setProducts } = useAppContext();
    const router = useRouter();

    const handleSetActiveView = (view: string) => {
        if (view === 'sales-list') {
            router.push('/sales/list');
        }
    };

    return (
        <AddSale
            products={products}
            sales={sales}
            setSales={setSales}
            setProducts={setProducts}
            setActiveView={handleSetActiveView}
        />
    );
}