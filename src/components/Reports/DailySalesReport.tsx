import React from 'react';
import { Sale } from '@/types';

interface DailySalesReportProps {
    sales: Sale[];
}

const DailySalesReport: React.FC<DailySalesReportProps> = ({ sales }) => {
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter(s => s.date === today);
    const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0);
    const averageSale = todaySales.length > 0 ? todayTotal / todaySales.length : 0;

    // Group by payment method
    const paymentMethods = todaySales.reduce((acc, sale) => {
        if (!acc[sale.paymentMethod]) {
            acc[sale.paymentMethod] = { count: 0, total: 0 };
        }
        acc[sale.paymentMethod].count++;
        acc[sale.paymentMethod].total += sale.total;
        return acc;
    }, {} as Record<string, { count: number; total: number }>);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Daily Sales Report - {today}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
                    <p className="text-3xl font-bold text-blue-600">{todaySales.length}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-green-600">${todayTotal.toFixed(2)}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Average Sale</h3>
                    <p className="text-3xl font-bold text-purple-600">${averageSale.toFixed(2)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
                    {Object.keys(paymentMethods).length === 0 ? (
                        <p className="text-gray-500">No sales recorded today</p>
                    ) : (
                        <div className="space-y-3">
                            {Object.entries(paymentMethods).map(([method, data]) => (
                                <div key={method} className="flex justify-between items-center py-2 border-b">
                                    <div>
                                        <p className="font-medium">{method}</p>
                                        <p className="text-sm text-gray-600">{data.count} transactions</p>
                                    </div>
                                    <p className="text-lg font-semibold">${data.total.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Today's Transactions</h3>
                    {todaySales.length === 0 ? (
                        <p className="text-gray-500">No sales recorded today</p>
                    ) : (
                        <div className="overflow-y-auto max-h-64">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Customer</th>
                                    <th className="text-left py-2">Items</th>
                                    <th className="text-left py-2">Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {todaySales.map(sale => (
                                    <tr key={sale.id} className="border-b">
                                        <td className="py-2">{sale.customer}</td>
                                        <td className="py-2">{sale.products.length}</td>
                                        <td className="py-2">${sale.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DailySalesReport;