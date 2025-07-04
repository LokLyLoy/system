import React from 'react';
import { Product } from '@/types';
import {Package} from "lucide-react";

interface ProductsReportProps {
    products: Product[];
}

const ProductsReport: React.FC<ProductsReportProps> = ({ products }) => {
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStockProducts = products.filter(p => p.stock < p.minStock);
    const totalItems = products.reduce((sum, p) => sum + p.stock, 0);

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
                <Package className="text-gray-800 w-8 h-8" />
                Products Report
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Products</h3>
                    <p className="text-2xl font-bold text-blue-600">{products.length}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Items</h3>
                    <p className="text-2xl font-bold text-purple-600">{totalItems}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Inventory Value</h3>
                    <p className="text-2xl font-bold text-green-600">${totalValue.toFixed(2)}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Low Stock Items</h3>
                    <p className="text-2xl font-bold text-red-600">{lowStockProducts.length}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">📦 Inventory Summary</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 border-b text-xs uppercase text-gray-500 tracking-wider">
                        <tr>
                            <th className="px-4 py-3">Product</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Stock</th>
                            <th className="px-4 py-3">Min Stock</th>
                            <th className="px-4 py-3">Unit Price</th>
                            <th className="px-4 py-3">Value</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-700">{product.name}</td>
                                <td className="px-4 py-3">{product.category}</td>
                                <td className="px-4 py-3">{product.stock}</td>
                                <td className="px-4 py-3">{product.minStock}</td>
                                <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                                <td className="px-4 py-3">${(product.price * product.stock).toFixed(2)}</td>
                                <td className="px-4 py-3">
                                    {product.stock < product.minStock ? (
                                        <span className="inline-block px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded">Low Stock</span>
                                    ) : product.stock === 0 ? (
                                        <span className="inline-block px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded">Out of Stock</span>
                                    ) : (
                                        <span className="inline-block px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded">OK</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductsReport;
