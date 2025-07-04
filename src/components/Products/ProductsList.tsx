import React, { useState } from 'react';
import {Search, Filter} from 'lucide-react';
import {Package} from '@phosphor-icons/react'
import { Product } from '@/types';

interface ProductsListProps {
    products: Product[];
}

const ProductsList: React.FC<ProductsListProps> = ({ products }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
                <Package className="text-gray-800 w-8 h-8" />
                Products List
            </h2>


            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="w-full sm:flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
                            />
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                        <Filter className="w-5 h-5" />
                        Filter
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">SKU</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                            <td className="px-6 py-4 text-gray-500">{product.sku}</td>
                            <td className="px-6 py-4 text-gray-500">{product.category}</td>
                            <td className="px-6 py-4 text-gray-900">${product.price.toFixed(2)}</td>
                            <td className="px-6 py-4 text-gray-900">{product.stock}</td>
                            <td className="px-6 py-4">
                                {product.stock < product.minStock ? (
                                    <span className="inline-block px-3 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">
                                            Low Stock
                                        </span>
                                ) : (
                                    <span className="inline-block px-3 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full">
                                            In Stock
                                        </span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductsList;
