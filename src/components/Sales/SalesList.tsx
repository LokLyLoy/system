import React, { useState } from 'react';
import { Search, Calendar, Filter, Download, Eye } from 'lucide-react';
import { Sale, Product } from '@/types';
import InvoiceModal from "@/components/Invoice/SaleInvoice";

interface SalesListProps {
    sales: Sale[];
    products?: Product[];
}

const SalesList: React.FC<SalesListProps> = ({ sales, products }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [showDetails, setShowDetails] = useState<string | null>(null);
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

    // Get unique payment methods
    const paymentMethods = Array.from(new Set(sales.map(s => s.paymentMethod)));

    // Filter sales
    const filteredSales = sales.filter(sale => {
        const matchesSearch = sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.id.includes(searchTerm);
        const matchesDate = !dateFilter || sale.date === dateFilter;
        const matchesPayment = paymentFilter === 'all' || sale.paymentMethod === paymentFilter;

        return matchesSearch && matchesDate && matchesPayment;
    });

    // Sort sales by date (newest first)
    const sortedSales = [...filteredSales].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Calculate totals
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalTransactions = filteredSales.length;

    const getProductName = (productId: string) => {
        if (!products) return `Product #${productId}`;
        const product = products.find(p => p.id === productId);
        return product ? product.name : `Unknown Product`;
    };

    const exportToCSV = () => {
        const headers = ['Date', 'ID', 'Customer', 'Items', 'Payment Method', 'Total'];
        const rows = sortedSales.map(sale => [
            sale.date,
            sale.id,
            sale.customer,
            sale.products.length,
            sale.paymentMethod,
            sale.total.toFixed(2)
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sales-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Sales List</h2>
                    <button
                        onClick={exportToCSV}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">Total Transactions</p>
                        <p className="text-2xl font-bold text-blue-600">{totalTransactions}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">Average Sale</p>
                        <p className="text-2xl font-bold text-purple-600">
                            ${totalTransactions > 0 ? (totalRevenue / totalTransactions).toFixed(2) : '0.00'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by customer name or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <select
                            value={paymentFilter}
                            onChange={(e) => setPaymentFilter(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Payment Methods</option>
                            {paymentMethods.map(method => (
                                <option key={method} value={method}>{method}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {(searchTerm || dateFilter || paymentFilter !== 'all') && (
                    <div className="mt-3 flex items-center text-sm text-gray-600">
                        <Filter className="w-4 h-4 mr-1" />
                        Showing {filteredSales.length} of {sales.length} sales
                        {(searchTerm || dateFilter || paymentFilter !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setDateFilter('');
                                    setPaymentFilter('all');
                                }}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Sales Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sale ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Items
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Payment
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {sortedSales.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    No sales found matching your criteria
                                </td>
                            </tr>
                        ) : (
                            sortedSales.map(sale => (
                                <React.Fragment key={sale.id}>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{sale.date}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-mono text-gray-500">#{sale.id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{sale.customer}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {sale.products.length} {sale.products.length === 1 ? 'item' : 'items'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                        <span
                                className={`px-2 py-1 text-xs rounded-full ${sale.paymentMethod.toLowerCase() === 'due'
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-green-100 text-green-700'}`}>
                                  {sale.paymentMethod}
                        </span>

                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">${sale.total.toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => setSelectedSale(sale)}
                                                className="text-green-600 hover:text-green-800 cursor-pointer"
                                            >
                                                <Eye className="w-5 h-5" />

                                            </button>
                                        </td>
                                    </tr>
                                    {showDetails === sale.id && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 bg-gray-50">
                                                <div className="text-sm">
                                                    <h4 className="font-semibold mb-2">Sale Details</h4>
                                                    <table className="w-full">
                                                        <thead>
                                                        <tr className="text-left">
                                                            <th className="pb-2">Product</th>
                                                            <th className="pb-2">Quantity</th>
                                                            <th className="pb-2">Unit Price</th>
                                                            <th className="pb-2">Subtotal</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {sale.products.map((item, index) => (
                                                            <tr key={index}>
                                                                <td className="py-1">{getProductName(item.productId)}</td>
                                                                <td className="py-1">{item.quantity}</td>
                                                                <td className="py-1">${item.price.toFixed(2)}</td>
                                                                <td className="py-1">${(item.quantity * item.price).toFixed(2)}</td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedSale && (
                <InvoiceModal
                    sale={selectedSale}
                    products={products}
                    onClose={() => setSelectedSale(null)}
                />
            )}


        </div>


    );
};

export default SalesList;