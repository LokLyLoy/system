import React from 'react';
import { Sale } from '@/types';

interface SalesReportProps {
    sales: Sale[];
}

const SalesReport: React.FC<SalesReportProps> = ({ sales }) => {
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const averageSale = sales.length > 0 ? totalRevenue / sales.length : 0;

    // Group sales by date
    const salesByDate = sales.reduce((acc, sale) => {
        if (!acc[sale.date]) acc[sale.date] = { count: 0, total: 0 };
        acc[sale.date].count++;
        acc[sale.date].total += sale.total;
        return acc;
    }, {} as Record<string, { count: number; total: number }>);

    // Calculate best day
    const bestDay = Object.entries(salesByDate).reduce(
        (best, [date, data]) => (data.total > best.total ? { date, ...data } : best),
        { date: '', count: 0, total: 0 }
    );

    // Group by customer
    const customerStats = sales.reduce((acc, sale) => {
        if (!acc[sale.customer]) acc[sale.customer] = { count: 0, total: 0 };
        acc[sale.customer].count++;
        acc[sale.customer].total += sale.total;
        return acc;
    }, {} as Record<string, { count: number; total: number }>);

    // Top customers
    const topCustomers = Object.entries(customerStats)
        .sort(([, a], [, b]) => b.total - a.total)
        .slice(0, 5);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Sales Report</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
                    <p className="text-3xl font-bold text-blue-600">{sales.length}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Average Sale</h3>
                    <p className="text-3xl font-bold text-purple-600">${averageSale.toFixed(2)}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Best Day</h3>
                    <p className="text-2xl font-bold text-orange-600">${bestDay.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{bestDay.date}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Sales by Date</h3>
                    <div className="overflow-y-auto max-h-64">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b sticky top-0 bg-white">
                                <th className="text-left py-2">Date</th>
                                <th className="text-left py-2">Sales</th>
                                <th className="text-left py-2">Revenue</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(salesByDate)
                                .sort(([a], [b]) => b.localeCompare(a))
                                .map(([date, data]) => (
                                    <tr key={date} className="border-b">
                                        <td className="py-2">{date}</td>
                                        <td className="py-2">{data.count}</td>
                                        <td className="py-2">${data.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Top Customers</h3>
                    {topCustomers.length === 0 ? (
                        <p className="text-gray-500">No customer data available</p>
                    ) : (
                        <div className="space-y-3">
                            {topCustomers.map(([customer, data], index) => (
                                <div key={customer} className="flex justify-between items-center py-2 border-b">
                                    <div className="flex items-center">
                                        <span className="text-lg font-semibold text-gray-500 mr-3">#{index + 1}</span>
                                        <div>
                                            <p className="font-medium">{customer}</p>
                                            <p className="text-sm text-gray-600">{data.count} purchases</p>
                                        </div>
                                    </div>
                                    <p className="text-lg font-semibold">${data.total.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesReport;