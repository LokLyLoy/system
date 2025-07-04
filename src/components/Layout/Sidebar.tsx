'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Package,
    Plus,
    ShoppingCart,
    FileText,
    Calendar,
    TrendingUp,
    ScrollText,
    HandCoins
} from 'lucide-react';

const Sidebar: React.FC = () => {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="bg-gray-100 w-64 min-h-screen p-4 hidden md:block fixed md:relative z-30">
            <nav className="space-y-2 text-sm">
                <Link
                    href="/dashboard"
                    className={`w-full block px-4 py-2 rounded flex items-center space-x-2 ${
                        isActive('/dashboard') ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                    }`}
                >
                    <Home className="w-5 h-5" />
                    <span>Dashboard</span>
                </Link>

                <div className="pt-4">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Products</h3>
                    <Link
                        href="/products/list"
                        className={`w-full block px-4 py-2 rounded flex items-center space-x-2 ${
                            isActive('/products/list') ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                        }`}
                    >
                        <Package className="w-5 h-5" />
                        <span>List Products</span>
                    </Link>
                    <Link
                        href="/products/add"
                        className={`w-full block px-4 py-2 rounded flex items-center space-x-2 ${
                            isActive('/products/add') ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                        }`}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Product</span>
                    </Link>
                </div>

                <div className="pt-4">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Sales</h3>
                    <Link
                        href="/sales/list"
                        className={`w-full block px-4 py-2 rounded flex items-center space-x-2 ${
                            isActive('/sales/list') ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                        }`}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span>List Sales</span>
                    </Link>
                    <Link
                        href="/sales/add"
                        className={`w-full block px-4 py-2 rounded flex items-center space-x-2 ${
                            isActive('/sales/add') ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                        }`}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Sale</span>
                    </Link>
                </div>

                <div className="pt-4">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Purchases</h3>
                    <Link
                        href="/purchases/list"
                        className={`w-full block px-4 py-2 rounded flex items-center space-x-2 ${
                            isActive('/purchases/list') ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                        }`}
                    >
                        <ScrollText className="w-5 h-5" />
                        <span>List Purchases</span>
                    </Link>
                    <Link
                        href="/purchases/add"
                        className={`w-full block px-4 py-2 rounded flex items-center space-x-2 ${
                            isActive('/purchases/add') ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                        }`}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Purchase</span>
                    </Link>
                </div>

                <div className="pt-4">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Reports</h3>
                    <Link
                        href="/reports/products"
                        className={`w-full block px-4 py-2 rounded flex items-center space-x-2 ${
                            isActive('/reports/products') ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                        }`}
                    >
                        <FileText className="w-5 h-5" />
                        <span>Products Report</span>
                    </Link>
                    <Link
                        href="/reports/daily-sales"
                        className={`w-full block px-4 py-2 rounded flex items-center space-x-2 ${
                            isActive('/reports/daily-sales') ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                        }`}
                    >
                        <Calendar className="w-5 h-5" />
                        <span>Daily Sales</span>
                    </Link>
                    <Link
                        href="/reports/sales"
                        className={`w-full block px-4 py-2 rounded flex items-center space-x-2 ${
                            isActive('/reports/sales') ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                        }`}
                    >
                        <TrendingUp className="w-5 h-5" />
                        <span>Sales Report</span>
                    </Link>
                    <Link
                        href="/reports/payments"
                        className={`w-full block px-4 py-2 rounded flex items-center space-x-2 ${
                            isActive('/reports/payments') ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                        }`}
                    >
                        <HandCoins className="w-5 h-5" />
                        <span>Payments Report</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
