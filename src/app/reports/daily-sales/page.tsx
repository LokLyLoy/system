'use client';

import DailySalesReport from '@/components/Reports/DailySalesReport';
import { useAppContext } from '@/contexts/AppContext';

export default function DailySalesReportPage() {
    const { sales } = useAppContext();

    return <DailySalesReport sales={sales} />;
}