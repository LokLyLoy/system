import React, { useState } from 'react';
import { Sale } from '@/types';
import { CreditCard, DollarSign, TrendingUp, Calendar, PieChart, Download, Banknote, Smartphone } from 'lucide-react';

interface PaymentsReportProps {
    sales: Sale[];
}

const PaymentsReport: React.FC<PaymentsReportProps> = ({ sales }) => {
    const [dateRange, setDateRange] = useState<'week' | 'month' | 'year' | 'all'>('month');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Filter sales based on date range
    const filterSalesByDateRange = () => {
        const now = new Date();

        switch (dateRange) {
            case 'week':
                const weekAgo = new Date(now);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return sales.filter(s => new Date(s.date) >= weekAgo);

            case 'month':
                return sales.filter(s => {
                    const saleDate = new Date(s.date);
                    return saleDate.getMonth() === selectedMonth && saleDate.getFullYear() === selectedYear;
                });

            case 'year':
                return sales.filter(s => new Date(s.date).getFullYear() === selectedYear);

            case 'all':
            default:
                return sales;
        }
    };

    const filteredSales = filterSalesByDateRange();
    const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);

    // Group by payment method
    const paymentMethods = filteredSales.reduce((acc, sale) => {
        if (!acc[sale.paymentMethod]) {
            acc[sale.paymentMethod] = {
                count: 0,
                total: 0,
                avgTransaction: 0,
                minTransaction: Infinity,
                maxTransaction: 0
            };
        }
        acc[sale.paymentMethod].count++;
        acc[sale.paymentMethod].total += sale.total;
        acc[sale.paymentMethod].minTransaction = Math.min(acc[sale.paymentMethod].minTransaction, sale.total);
        acc[sale.paymentMethod].maxTransaction = Math.max(acc[sale.paymentMethod].maxTransaction, sale.total);
        return acc;
    }, {} as Record<string, {
        count: number;
        total: number;
        avgTransaction: number;
        minTransaction: number;
        maxTransaction: number;
    }>);

    // Calculate averages
    Object.keys(paymentMethods).forEach(method => {
        paymentMethods[method].avgTransaction = paymentMethods[method].total / paymentMethods[method].count;
    });

    // Most used payment method
    const mostUsedMethod = Object.entries(paymentMethods).reduce(
        (most, [method, data]) => (data.count > most.count ? { method, ...data } : most),
        { method: '', count: 0, total: 0, avgTransaction: 0, minTransaction: 0, maxTransaction: 0 }
    );

    // Payment trends over time
    const paymentTrends = filteredSales.reduce((acc, sale) => {
        const date = sale.date;
        if (!acc[date]) {
            acc[date] = {};
        }
        if (!acc[date][sale.paymentMethod]) {
            acc[date][sale.paymentMethod] = { count: 0, total: 0 };
        }
        acc[date][sale.paymentMethod].count++;
        acc[date][sale.paymentMethod].total += sale.total;
        return acc;
    }, {} as Record<string, Record<string, { count: number; total: number }>>);

    // Get unique payment methods for colors
    const methodColors: Record<string, string> = {
        'Cash': 'bg-green-500',
        'Credit Card': 'bg-blue-500',
        'Debit Card': 'bg-purple-500',
        'Bank Transfer': 'bg-yellow-500',
        'Mobile Payment': 'bg-pink-500'
    };

    // Payment method icons
    const methodIcons: Record<string, React.ReactNode> = {
        'Cash': <Banknote className="w-5 h-5" />,
        'Credit Card': <CreditCard className="w-5 h-5" />,
        'Debit Card': <CreditCard className="w-5 h-5" />,
        'Bank Transfer': <DollarSign className="w-5 h-5" />,
        'Mobile Payment': <Smartphone className="w-5 h-5" />
    };

    // Calculate processing fees (simulated)
    const processingFees = Object.entries(paymentMethods).reduce((acc, [method, data]) => {
        const feeRate = method === 'Cash' ? 0 : method === 'Bank Transfer' ? 0.005 : 0.029; // 2.9% for cards
        const fees = data.total * feeRate;
        acc[method] = fees;
        return acc;
    }, {} as Record<string, number>);

    const totalFees = Object.values(processingFees).reduce((sum, fee) => sum + fee, 0);

    const exportToCSV = () => {
        const headers = ['Payment Method', 'Transactions', 'Total Amount', 'Average', 'Min', 'Max', 'Est. Fees'];
        const rows = Object.entries(paymentMethods).map(([method, data]) => [
            method,
            data.count,
            data.total.toFixed(2),
            data.avgTransaction.toFixed(2),
            data.minTransaction.toFixed(2),
            data.maxTransaction.toFixed(2),
            processingFees[method].toFixed(2)
        ]);

        const csvContent = [
            `Payment Methods Report - ${dateRange}`,
            `Total Revenue: ${totalRevenue.toFixed(2)}`,
            `Total Transactions: ${filteredSales.length}`,
            `Estimated Processing Fees: ${totalFees.toFixed(2)}`,
            '',
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payments-report-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center">
                            <CreditCard className="mr-2" />
                            Payments Report
                        </h2>
                        <p className="text-gray-600 mt-1">Payment methods analysis and processing insights</p>
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center transition-colors"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </button>
                </div>

                {/* Date Range Filter */}
                <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div className="flex space-x-2">
                        {(['week', 'month', 'year', 'all'] as const).map(range => (
                            <button
                                key={range}
                                onClick={() => setDateRange(range)}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    dateRange === range
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </button>
                        ))}
                    </div>

                    {dateRange === 'month' && (
                        <div className="flex items-center space-x-2 ml-4">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {months.map((month, index) => (
                                    <option key={month} value={index}>{month}</option>
                                ))}
                            </select>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {[2023, 2024, 2025].map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign className="w-8 h-8 text-green-500" />
                        <span className="text-2xl font-bold">${totalRevenue.toFixed(0)}</span>
                    </div>
                    <p className="text-sm text-gray-600">Total Processed</p>
                    <p className="text-xs text-gray-500 mt-1">{filteredSales.length} transactions</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-2">
                        <PieChart className="w-8 h-8 text-blue-500" />
                        <span className="text-2xl font-bold">{Object.keys(paymentMethods).length}</span>
                    </div>
                    <p className="text-sm text-gray-600">Payment Methods</p>
                    <p className="text-xs text-gray-500 mt-1">Active channels</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-2">
                        {methodIcons[mostUsedMethod.method] || <CreditCard className="w-8 h-8 text-purple-500" />}
                        <span className="text-2xl font-bold">{mostUsedMethod.count}</span>
                    </div>
                    <p className="text-sm text-gray-600">Most Used</p>
                    <p className="text-xs text-gray-500 mt-1">{mostUsedMethod.method}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="w-8 h-8 text-red-500" />
                        <span className="text-2xl font-bold">${totalFees.toFixed(0)}</span>
                    </div>
                    <p className="text-sm text-gray-600">Processing Fees</p>
                    <p className="text-xs text-gray-500 mt-1">Estimated cost</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Payment Methods Distribution */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Payment Methods Distribution</h3>
                    <div className="space-y-4">
                        {Object.entries(paymentMethods).map(([method, data]) => {
                            const percentage = (data.total / totalRevenue) * 100;
                            return (
                                <div key={method}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center">
                                            <span className="mr-2">{methodIcons[method]}</span>
                                            <span className="font-medium">{method}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">${data.total.toFixed(2)}</p>
                                            <p className="text-xs text-gray-600">{data.count} transactions</p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full transition-all duration-500 ${methodColors[method] || 'bg-gray-500'}`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>{percentage.toFixed(1)}% of revenue</span>
                                        <span>Avg: ${data.avgTransaction.toFixed(2)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Payment Method Stats */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Payment Statistics</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Min</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Avg</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Max</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Fees</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {Object.entries(paymentMethods).map(([method, data]) => (
                                <tr key={method}>
                                    <td className="px-3 py-3 text-sm font-medium">{method}</td>
                                    <td className="px-3 py-3 text-sm text-right">
                                        ${data.minTransaction === Infinity ? '0' : data.minTransaction.toFixed(2)}
                                    </td>
                                    <td className="px-3 py-3 text-sm text-right">${data.avgTransaction.toFixed(2)}</td>
                                    <td className="px-3 py-3 text-sm text-right">${data.maxTransaction.toFixed(2)}</td>
                                    <td className="px-3 py-3 text-sm text-right text-red-600">
                                        ${processingFees[method].toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                            <tr>
                                <td className="px-3 py-3 font-semibold">Total</td>
                                <td colSpan={3}></td>
                                <td className="px-3 py-3 text-right font-semibold text-red-600">
                                    ${totalFees.toFixed(2)}
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            {/* Payment Trends Over Time */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-semibold mb-4">Payment Method Trends</h3>
                <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                        <div className="flex items-end space-x-2" style={{ height: '250px' }}>
                            {Object.entries(paymentTrends)
                                .sort(([a], [b]) => a.localeCompare(b))
                                .slice(-30) // Last 30 days
                                .map(([date, methods]) => {
                                    const dayTotal = Object.values(methods).reduce((sum, m) => sum + m.total, 0);
                                    const maxDayTotal = Math.max(...Object.values(paymentTrends).map(day =>
                                        Object.values(day).reduce((sum, m) => sum + m.total, 0)
                                    ));

                                    return (
                                        <div key={date} className="flex-1 flex flex-col items-center">
                                            <div className="w-full flex flex-col">
                                                {Object.entries(methods).map(([method, data]) => {
                                                    const height = dayTotal > 0 ? (data.total / maxDayTotal) * 100 : 0;
                                                    return (
                                                        <div
                                                            key={method}
                                                            className={`w-full ${methodColors[method] || 'bg-gray-500'} opacity-80 hover:opacity-100`}
                                                            style={{ height: `${height}%` }}
                                                            title={`${date} - ${method}: ${data.total.toFixed(2)}`}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-600">
                            <span>30 days ago</span>
                            <span>Today</span>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                    {Object.keys(paymentMethods).map(method => (
                        <div key={method} className="flex items-center">
                            <div className={`w-3 h-3 rounded ${methodColors[method] || 'bg-gray-500'} mr-2`} />
                            <span className="text-sm">{method}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Est. Fee</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Net Amount</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {filteredSales.slice(-20).reverse().map(sale => {
                            const feeRate = sale.paymentMethod === 'Cash' ? 0 :
                                sale.paymentMethod === 'Bank Transfer' ? 0.005 : 0.029;
                            const fee = sale.total * feeRate;
                            const netAmount = sale.total - fee;

                            return (
                                <tr key={sale.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm">{sale.date}</td>
                                    <td className="px-4 py-3 text-sm font-medium">{sale.customer}</td>
                                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                          methodColors[sale.paymentMethod] || 'bg-gray-500'
                      } bg-opacity-20`}>
                        {sale.paymentMethod}
                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right font-medium">${sale.total.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-sm text-right text-red-600">${fee.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-sm text-right font-semibold">${netAmount.toFixed(2)}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentsReport;