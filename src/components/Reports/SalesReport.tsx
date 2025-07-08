'use client';

import React, { useState } from 'react';
import { Sale } from '@/types';
import { TrendingUp, DollarSign, CalendarDays, Users, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

interface SalesReportProps {
    sales: Sale[];
}

type SortBy = 'date' | 'paymentRef' | 'saleRef' | 'customer' | 'payment' | 'amount';
type SortOrder = 'asc' | 'desc';

const SalesReport: React.FC<SalesReportProps> = ({ sales }) => {
    const [sortBy, setSortBy] = useState<SortBy>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const averageSale = sales.length > 0 ? totalRevenue / sales.length : 0;

    // Generate payment reference (simulated)
    const generatePaymentRef = (sale: Sale) => {
        return `PAY${Math.floor(10000 + Math.random() * 90000)}`;
    };

    // Generate sale reference (simulated)
    const generateSaleRef = (sale: Sale) => {
        return `SALE/POS${sale.id.padStart(4, '0')}`;
    };

    // Enhanced sales data with references
    const enhancedSales = sales.map(sale => ({
        ...sale,
        paymentRef: generatePaymentRef(sale),
        saleRef: generateSaleRef(sale),
        dateTime: `${sale.date} ${new Date().toLocaleTimeString('en-US', { hour12: false })}`
    }));

    // Sorting logic
    const sortedSales = [...enhancedSales].sort((a, b) => {
        let compareValue = 0;

        switch (sortBy) {
            case 'date':
                compareValue = new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
                break;
            case 'paymentRef':
                compareValue = a.paymentRef.localeCompare(b.paymentRef);
                break;
            case 'saleRef':
                compareValue = a.saleRef.localeCompare(b.saleRef);
                break;
            case 'customer':
                compareValue = a.customer.localeCompare(b.customer);
                break;
            case 'payment':
                compareValue = a.paymentMethod.localeCompare(b.paymentMethod);
                break;
            case 'amount':
                compareValue = b.total - a.total;
                break;
            default:
                compareValue = 0;
        }

        return sortOrder === 'asc' ? -compareValue : compareValue;
    });

    // Pagination
    const totalPages = Math.ceil(sortedSales.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentSales = sortedSales.slice(startIndex, endIndex);

    // Sales by date summary
    const salesByDate = sales.reduce((acc, sale) => {
        if (!acc[sale.date]) acc[sale.date] = { count: 0, total: 0 };
        acc[sale.date].count++;
        acc[sale.date].total += sale.total;
        return acc;
    }, {} as Record<string, { count: number; total: number }>);

    const bestDay = Object.entries(salesByDate).reduce(
        (best, [date, data]) => (data.total > best.total ? { date, ...data } : best),
        { date: '', count: 0, total: 0 }
    );

    const customerStats = sales.reduce((acc, sale) => {
        if (!acc[sale.customer]) acc[sale.customer] = { count: 0, total: 0 };
        acc[sale.customer].count++;
        acc[sale.customer].total += sale.total;
        return acc;
    }, {} as Record<string, { count: number; total: number }>);

    const topCustomers = Object.entries(customerStats)
        .sort(([, a], [, b]) => b.total - a.total)
        .slice(0, 5);

    const handleSort = (column: SortBy) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 Sales Report</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-100 p-6 rounded-lg shadow flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600">Total Sales</p>
                        <p className="text-3xl font-bold text-blue-700">{sales.length}</p>
                    </div>
                    <Users className="w-6 h-6 text-blue-500" />
                </div>

                <div className="bg-green-100 p-6 rounded-lg shadow flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-3xl font-bold text-green-700">${totalRevenue.toFixed(2)}</p>
                    </div>
                    <DollarSign className="w-6 h-6 text-green-500" />
                </div>

                <div className="bg-purple-100 p-6 rounded-lg shadow flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600">Average Sale</p>
                        <p className="text-3xl font-bold text-purple-700">${averageSale.toFixed(2)}</p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                </div>

                <div className="bg-orange-100 p-6 rounded-lg shadow flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600">Best Day</p>
                        <p className="text-2xl font-bold text-orange-700">${bestDay.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-600">{bestDay.date}</p>
                    </div>
                    <CalendarDays className="w-6 h-6 text-orange-500" />
                </div>
            </div>

            {/* Enhanced Sales Table */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Sales Transactions</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="px-4 py-3 text-left">
                                <button
                                    onClick={() => handleSort('date')}
                                    className="flex items-center space-x-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                                >
                                    <span>Date (yyyy-mm-dd)</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                                <button
                                    onClick={() => handleSort('paymentRef')}
                                    className="flex items-center space-x-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                                >
                                    <span>Payment Reference</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                                <button
                                    onClick={() => handleSort('saleRef')}
                                    className="flex items-center space-x-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                                >
                                    <span>Sale Reference</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                                <button
                                    onClick={() => handleSort('customer')}
                                    className="flex items-center space-x-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                                >
                                    <span>Paid by</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                                <button
                                    onClick={() => handleSort('payment')}
                                    className="flex items-center space-x-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                                >
                                    <span>Method</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-right">
                                <button
                                    onClick={() => handleSort('amount')}
                                    className="flex items-center space-x-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900 ml-auto"
                                >
                                    <span>Amount</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-right">
                                <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Status</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {currentSales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm">{sale.dateTime}</td>
                                <td className="px-4 py-3 text-sm font-mono">{sale.paymentRef}</td>
                                <td className="px-4 py-3 text-sm font-mono">{sale.saleRef}</td>
                                <td className="px-4 py-3 text-sm">{sale.customer}</td>
                                <td className="px-4 py-3 text-sm">{sale.paymentMethod}</td>
                                <td className="px-4 py-3 text-sm text-right font-medium">{sale.total.toFixed(2)}</td>
                                <td className="px-4 py-3 text-sm text-right">
                                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                            Received
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr className="bg-gray-50 font-semibold">
                            <td colSpan={5} className="px-4 py-3 text-sm">[Type]</td>
                            <td className="px-4 py-3 text-sm text-right">{currentSales.reduce((sum, s) => sum + s.total, 0).toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-right">0.00</td>
                        </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-4 py-3 border-t flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing {startIndex + 1} to {Math.min(endIndex, sortedSales.length)} of {sortedSales.length} entries
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Page numbers */}
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => goToPage(pageNum)}
                                    className={`px-3 py-1 text-sm rounded ${
                                        currentPage === pageNum
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        {totalPages > 5 && (
                            <>
                                <span className="text-gray-500">...</span>
                                <button
                                    onClick={() => goToPage(totalPages)}
                                    className={`px-3 py-1 text-sm rounded ${
                                        currentPage === totalPages
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Top Customers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🏆 Top Customers</h3>
                    {topCustomers.length === 0 ? (
                        <p className="text-gray-500">No customer data available</p>
                    ) : (
                        <ul className="space-y-3">
                            {topCustomers.map(([customer, data], index) => (
                                <li key={customer} className="flex justify-between items-center py-2 border-b">
                                    <div className="flex items-center">
                                        <span className="text-sm font-bold text-gray-400 mr-3">#{index + 1}</span>
                                        <div>
                                            <p className="font-medium">{customer}</p>
                                            <p className="text-xs text-gray-500">{data.count} purchases</p>
                                        </div>
                                    </div>
                                    <p className="text-base font-semibold text-green-700">
                                        ${data.total.toFixed(2)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Sales Summary by Date */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Daily Summary</h3>
                    <div className="overflow-y-auto max-h-64">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-gray-50 border-b">
                            <tr>
                                <th className="text-left py-2 px-4">Date</th>
                                <th className="text-center py-2 px-4">Transactions</th>
                                <th className="text-right py-2 px-4">Revenue</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(salesByDate)
                                .sort(([a], [b]) => b.localeCompare(a))
                                .slice(0, 10)
                                .map(([date, data]) => (
                                    <tr key={date} className="border-b hover:bg-gray-50">
                                        <td className="py-2 px-4">{date}</td>
                                        <td className="py-2 px-4 text-center">{data.count}</td>
                                        <td className="py-2 px-4 text-right font-medium text-green-600">
                                            ${data.total.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesReport;