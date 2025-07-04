'use client';

import { useRouter } from 'next/navigation';
import AddProduct from '@/components/Products/AddProducts';
import { useAppContext } from '@/contexts/AppContext';

export default function AddProductPage() {
    const { products, setProducts } = useAppContext();
    const router = useRouter();

    const handleSetActiveView = (view: string) => {
        if (view === 'products-list') {
            router.push('/products/list');
        }
    };

    return (
        <AddProduct
            products={products}
            setProducts={setProducts}
            setActiveView={handleSetActiveView}
        />
    );
}