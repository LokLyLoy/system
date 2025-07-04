'use client';

import PaymentsReport from '@/components/Reports/PaymentsReport';
import { useAppContext } from '@/contexts/AppContext';

export default function PaymentsReportPage() {
    const { sales } = useAppContext();

    return <PaymentsReport sales={sales} />;
}