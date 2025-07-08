'use client';

import React from 'react';
import { Sale } from '@/types';
import { CreditCard, Users, DollarSign } from 'lucide-react';

interface DailySalesReportProps {
    sales: Sale[];
}

const DailySalesReport: React.FC<DailySalesReportProps> = ({ sales }) => {
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter(s => s.date === today);
    const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0);
    const averageSale = todaySales.length > 0 ? todayTotal / todaySales.length : 0;

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
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                📅 Daily Sales Report — <span className="text-blue-600">{today}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-xl shadow hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm text-gray-600">Total Sales</h3>
                            <p className="text-3xl font-bold text-blue-800">{todaySales.length}</p>
                        </div>
                        <Users className="w-6 h-6 text-blue-600" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-xl shadow hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm text-gray-600">Total Revenue</h3>
                            <p className="text-3xl font-bold text-green-800">${todayTotal.toFixed(2)}</p>
                        </div>
                        <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-6 rounded-xl shadow hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm text-gray-600">Average Sale</h3>
                            <p className="text-3xl font-bold text-purple-800">${averageSale.toFixed(2)}</p>
                        </div>
                        <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">💳 Payment Methods</h3>
                    {Object.keys(paymentMethods).length === 0 ? (
                        <p className="text-gray-500">No sales recorded today</p>
                    ) : (
                        <ul className="space-y-3">
                            {Object.entries(paymentMethods).map(([method, data]) => (
                                <li
                                    key={method}
                                    className="flex justify-between items-center border-b py-2"
                                >
                                    <div>
                                        <span className="text-gray-800 font-medium">{method}</span>
                                        <p className="text-sm text-gray-500">{data.count} transaction(s)</p>
                                    </div>
                                    <span className="text-lg font-semibold text-green-700">
                                        ${data.total.toFixed(2)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🧾 Today&apos;s Transactions</h3>
                    {todaySales.length === 0 ? (
                        <p className="text-gray-500">No sales recorded today</p>
                    ) : (
                        <div className="overflow-y-auto max-h-64 border rounded">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-2 px-4">Customer</th>
                                    <th className="text-left py-2 px-4">Items</th>
                                    <th className="text-left py-2 px-4">Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {todaySales.map(sale => (
                                    <tr key={sale.id} className="border-b hover:bg-gray-50">
                                        <td className="py-2 px-4">{sale.customer}</td>
                                        <td className="py-2 px-4">{sale.products.length}</td>
                                        <td className="py-2 px-4 font-medium text-green-600">
                                            ${sale.total.toFixed(2)}
                                        </td>
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
