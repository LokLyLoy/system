'use client';

import Dashboard from '@/components/Dashboard/Dashboard';
import { useAppContext } from '@/contexts/AppContext';

export default function DashboardPage() {
    const { products, sales, purchases } = useAppContext();

    return <Dashboard products={products} sales={sales} purchases={purchases} />;
}