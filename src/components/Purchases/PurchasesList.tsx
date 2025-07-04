'use client'
import React, { useState } from 'react';
import { Search, Calendar, Download, Eye, Package, DollarSign } from 'lucide-react';
import { Purchase, Product } from '@/types';

interface PurchasesListProps {
    purchases: Purchase[];
    products?: Product[];
}

const PurchasesList: React.FC<PurchasesListProps> = ({ purchases, products }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [showDetails, setShowDetails] = useState<string | null>(null);

    if (!purchases) return null;

    const filteredPurchases = purchases.filter(purchase => {
        const matchesSearch = purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
            purchase.id.includes(searchTerm);
        const matchesDate = !dateFilter || purchase.date === dateFilter;
        return matchesSearch && matchesDate;
    });

    const sortedPurchases = [...filteredPurchases].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const totalSpent = filteredPurchases.reduce((sum, purchase) => sum + purchase.total, 0);
    const totalTransactions = filteredPurchases.length;
    const totalItems = filteredPurchases.reduce((sum, purchase) =>
        sum + purchase.products.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    const getProductName = (productId: string) => {
        if (!products) return `Product #${productId}`;
        const product = products.find(p => p.id === productId);
        return product ? product.name : `Unknown Product`;
    };

    const exportToCSV = () => {
        const headers = ['Date', 'ID', 'Supplier', 'Items', 'Total Cost'];
        const rows = sortedPurchases.map(purchase => [
            purchase.date,
            purchase.id,
            purchase.supplier,
            purchase.products.length,
            purchase.total.toFixed(2)
        ]);
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `purchases-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const supplierStats = purchases.reduce((acc, purchase) => {
        if (!acc[purchase.supplier]) {
            acc[purchase.supplier] = { count: 0, total: 0 };
        }
        acc[purchase.supplier].count++;
        acc[purchase.supplier].total += purchase.total;
        return acc;
    }, {} as Record<string, { count: number; total: number }>);

    const topSuppliers = Object.entries(supplierStats)
        .sort(([, a], [, b]) => b.total - a.total)
        .slice(0, 3);

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold">Purchases</h2>
                        <p className="text-gray-600 mt-1">Manage your inventory purchases and suppliers</p>
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Spent</p>
                                <p className="text-2xl font-bold text-red-600">${totalSpent.toFixed(2)}</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-red-200" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold text-blue-600">{totalTransactions}</p>
                            </div>
                            <Package className="w-8 h-8 text-blue-200" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Items Purchased</p>
                                <p className="text-2xl font-bold text-green-600">{totalItems}</p>
                            </div>
                            <Package className="w-8 h-8 text-green-200" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Avg. Order Value</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    ${totalTransactions > 0 ? (totalSpent / totalTransactions).toFixed(2) : '0.00'}
                                </p>
                            </div>
                            <DollarSign className="w-8 h-8 text-purple-200" />
                        </div>
                    </div>
                </div>

                {topSuppliers.length > 0 && (
                    <div className="bg-white p-4 rounded-lg shadow mb-6">
                        <h3 className="font-semibold mb-3">Top Suppliers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {topSuppliers.map(([supplier, data]) => (
                                <div key={supplier} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{supplier}</p>
                                        <p className="text-sm text-gray-600">{data.count} orders</p>
                                    </div>
                                    <p className="font-bold text-lg">${data.total.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by supplier name or ID..."
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
                </div>
                {(searchTerm || dateFilter) && (
                    <div className="mt-3 flex items-center text-sm text-gray-600">
                        Showing {filteredPurchases.length} of {purchases.length} purchases
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setDateFilter('');
                            }}
                            className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {sortedPurchases.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    No purchases found matching your criteria
                                </td>
                            </tr>
                        ) : (
                            sortedPurchases.map(purchase => {
                                const itemCount = purchase.products.reduce((sum, item) => sum + item.quantity, 0);
                                return (
                                    <React.Fragment key={purchase.id}>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">{purchase.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-500">#{purchase.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{purchase.supplier}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{purchase.products.length} {purchase.products.length === 1 ? 'product' : 'products'} ({itemCount} units)</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">${purchase.total.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => setShowDetails(showDetails === purchase.id ? null : purchase.id)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                        {showDetails === purchase.id && (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-4 bg-gray-50">
                                                    <div className="text-sm">
                                                        <h4 className="font-semibold mb-3">Purchase Details</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                            <div>
                                                                <p className="text-gray-600">Supplier: <span className="font-medium text-gray-900">{purchase.supplier}</span></p>
                                                                <p className="text-gray-600">Date: <span className="font-medium text-gray-900">{purchase.date}</span></p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-600">Total Items: <span className="font-medium text-gray-900">{itemCount}</span></p>
                                                                <p className="text-gray-600">Total Cost: <span className="font-medium text-gray-900">${purchase.total.toFixed(2)}</span></p>
                                                            </div>
                                                        </div>
                                                        <table className="w-full">
                                                            <thead className="bg-gray-100">
                                                            <tr>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Cost</th>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-200">
                                                            {purchase.products.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td className="px-4 py-2">{getProductName(item.productId)}</td>
                                                                    <td className="px-4 py-2">{item.quantity}</td>
                                                                    <td className="px-4 py-2">${item.cost.toFixed(2)}</td>
                                                                    <td className="px-4 py-2 font-medium">${(item.quantity * item.cost).toFixed(2)}</td>
                                                                </tr>
                                                            ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PurchasesList;
