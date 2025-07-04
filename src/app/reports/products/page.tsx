'use client';

import { useAppContext } from '@/contexts/AppContext';
import ProductsReport from "@/components/Reports/ProductsReport";

export default function PaymentsReportPage() {
    const { products } = useAppContext();

    return <ProductsReport products={products}/>;
}