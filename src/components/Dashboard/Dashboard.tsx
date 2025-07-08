import React from 'react';
import {
    DollarSign,
    Package,
    AlertCircle,
    ShoppingCart,
    TrendingUp,
    TrendingDown,
    Clock,
    Gauge
} from 'lucide-react';
import { Product, Sale, Purchase } from '@/types';

interface DashboardProps {
    products: Product[];
    sales: Sale[];
    purchases?: Purchase[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, sales, purchases }) => {
    // Calculate metrics
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.stock < p.minStock).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;
    const todaySales = sales.filter(s => s.date === new Date().toISOString().split('T')[0]).length;
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    // Calculate trend (compare today with yesterday)
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const todayRevenue = sales.filter(s => s.date === today).reduce((sum, s) => sum + s.total, 0);
    const yesterdayRevenue = sales.filter(s => s.date === yesterday).reduce((sum, s) => sum + s.total, 0);
    const revenueTrend = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0;

    // Top selling products
    const productSales = sales.reduce((acc, sale) => {
        sale.products.forEach(item => {
            if (!acc[item.productId]) {
                acc[item.productId] = { quantity: 0, revenue: 0 };
            }
            acc[item.productId].quantity += item.quantity;
            acc[item.productId].revenue += item.quantity * item.price;
        });
        return acc;
    }, {} as Record<string, { quantity: number; revenue: number }>);

    const topProducts = Object.entries(productSales)
        .sort(([, a], [, b]) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(([productId, data]) => {
            const product = products.find(p => p.id === productId);
            return { product, ...data };
        });

    // Recent activities
    const recentActivities = [
        ...sales.map(s => ({ type: 'sale', date: s.date, description: `Sale to ${s.customer}`, amount: s.total })),
        ...(purchases || []).map(p => ({ type: 'purchase', date: p.date, description: `Purchase from ${p.supplier}`, amount: p.total }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
                    <Gauge className="text-gray-800 w-8 h-8" />
                    Dashboard
                </h2>

                <p className="text-gray-600">Welcome back! Here&apos;s an overview of your business.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Revenue</p>
                            <p className="text-2xl font-bold mt-1">${totalRevenue.toFixed(2)}</p>
                            {revenueTrend !== 0 && (
                                <div className={`flex items-center mt-2 text-sm ${revenueTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {revenueTrend > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                                    <span>{Math.abs(revenueTrend).toFixed(1)}% vs yesterday</span>
                                </div>
                            )}
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Inventory Value</p>
                            <p className="text-2xl font-bold mt-1">${totalInventoryValue.toFixed(2)}</p>
                            <p className="text-sm text-gray-500 mt-2">{totalProducts} products</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Low Stock Alerts</p>
                            <p className="text-2xl font-bold mt-1">{lowStockCount}</p>
                            {outOfStockCount > 0 && (
                                <p className="text-sm text-red-600 mt-2">{outOfStockCount} out of stock</p>
                            )}
                        </div>
                        <div className={`${lowStockCount > 0 ? 'bg-yellow-100' : 'bg-gray-100'} p-3 rounded-full`}>
                            <AlertCircle className={`w-6 h-6 ${lowStockCount > 0 ? 'text-yellow-600' : 'text-gray-600'}`} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Today&apos;s Sales</p>
                            <p className="text-2xl font-bold mt-1">{todaySales}</p>
                            <p className="text-sm text-gray-500 mt-2">${todayRevenue.toFixed(2)} revenue</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <ShoppingCart className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Sales */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Recent Sales</h3>
                        <button className="text-blue-500 text-sm hover:underline">View all</button>
                    </div>
                    <div className="space-y-3">
                        {sales.slice(0, 5).map(sale => (
                            <div key={sale.id} className="flex justify-between items-center py-2 border-b last:border-0">
                                <div>
                                    <p className="font-medium text-sm">{sale.customer}</p>
                                    <div className="flex items-center text-xs text-gray-600 mt-1">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {sale.date}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm">${sale.total.toFixed(2)}</p>
                                    <p className="text-xs text-gray-600">{sale.paymentMethod}</p>
                                </div>
                            </div>
                        ))}
                        {sales.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No sales yet</p>
                        )}
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Stock Alerts</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${lowStockCount > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
              {lowStockCount} items
            </span>
                    </div>
                    <div className="space-y-3">
                        {products.filter(p => p.stock < p.minStock).slice(0, 5).map(product => (
                            <div key={product.id} className="flex justify-between items-center py-2 border-b last:border-0">
                                <div>
                                    <p className="font-medium text-sm">{product.name}</p>
                                    <p className="text-xs text-gray-600">SKU: {product.sku}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold text-sm ${product.stock === 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                                        {product.stock} left
                                    </p>
                                    <p className="text-xs text-gray-600">Min: {product.minStock}</p>
                                </div>
                            </div>
                        ))}
                        {lowStockCount === 0 && (
                            <p className="text-gray-500 text-center py-4">All products sufficiently stocked</p>
                        )}
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Top Products</h3>
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                        {topProducts.map(({ product, quantity, revenue }, index) => (
                            <div key={product?.id || index} className="flex justify-between items-center py-2 border-b last:border-0">
                                <div className="flex items-center">
                                    <span className="text-lg font-semibold text-gray-400 mr-3">#{index + 1}</span>
                                    <div>
                                        <p className="font-medium text-sm">{product?.name || 'Unknown Product'}</p>
                                        <p className="text-xs text-gray-600">{quantity} units sold</p>
                                    </div>
                                </div>
                                <p className="font-bold text-sm">${revenue.toFixed(2)}</p>
                            </div>
                        ))}
                        {topProducts.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No sales data yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-start">
                            <div className={`mt-0.5 w-2 h-2 rounded-full ${activity.type === 'sale' ? 'bg-green-500' : 'bg-blue-500'}`} />
                            <div className="ml-4 flex-1">
                                <p className="text-sm font-medium">{activity.description}</p>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-xs text-gray-600">{activity.date}</p>
                                    <p className="text-sm font-semibold">${activity.amount.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {recentActivities.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No recent activity</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;