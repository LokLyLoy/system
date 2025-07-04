'use client';

import SalesReport from '@/components/Reports/SalesReport';
import { useAppContext } from '@/contexts/AppContext';

export default function SalesReportPage() {
    const { sales } = useAppContext();

    return <SalesReport sales={sales} />;
}