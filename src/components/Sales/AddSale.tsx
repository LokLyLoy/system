import React, { useState } from 'react';
import { Product, Sale } from '@/types';
import { ShoppingCart, Plus, Trash2, AlertCircle } from 'lucide-react';

interface AddSaleProps {
    products: Product[];
    sales: Sale[];
    setSales: (sales: Sale[]) => void;
    setProducts: (products: Product[]) => void;
    setActiveView: (view: string) => void;
}

const AddSale: React.FC<AddSaleProps> = ({
                                             products,
                                             sales,
                                             setSales,
                                             setProducts,
                                             setActiveView
                                         }) => {
    const [customer, setCustomer] = useState('Walk-in Customer');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [saleItems, setSaleItems] = useState<{ productId: string; quantity: number; price: number }[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const availableProducts = products.filter(p => p.stock > 0);

    const validateAddItem = () => {
        const newErrors: Record<string, string> = {};

        if (!selectedProduct) {
            newErrors.product = 'Please select a product';
        }

        if (!quantity || parseInt(quantity) <= 0) {
            newErrors.quantity = 'Quantity must be greater than 0';
        } else {
            const product = products.find(p => p.id === selectedProduct);
            const alreadyAdded = saleItems.find(item => item.productId === selectedProduct);
            const totalQuantity = (alreadyAdded?.quantity || 0) + parseInt(quantity);

            if (product && totalQuantity > product.stock) {
                newErrors.quantity = `Only ${product.stock} units available`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddItem = () => {
        if (!validateAddItem()) return;

        const product = products.find(p => p.id === selectedProduct);
        if (product) {
            const existingItem = saleItems.find(item => item.productId === selectedProduct);

            if (existingItem) {
                setSaleItems(saleItems.map(item =>
                    item.productId === selectedProduct
                        ? { ...item, quantity: item.quantity + parseInt(quantity) }
                        : item
                ));
            } else {
                setSaleItems([...saleItems, {
                    productId: selectedProduct,
                    quantity: parseInt(quantity),
                    price: product.price
                }]);
            }

            setSelectedProduct('');
            setQuantity('');
            setErrors({});
        }
    };

    const removeItem = (index: number) => {
        setSaleItems(saleItems.filter((_, i) => i !== index));
    };

    const updateItemQuantity = (index: number, newQuantity: string) => {
        const qty = parseInt(newQuantity);
        if (qty > 0) {
            const item = saleItems[index];
            const product = products.find(p => p.id === item.productId);

            if (product && qty <= product.stock) {
                setSaleItems(saleItems.map((item, i) =>
                    i === index ? { ...item, quantity: qty } : item
                ));
            }
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!customer.trim()) {
            newErrors.customer = 'Customer name is required';
        }

        if (saleItems.length === 0) {
            newErrors.items = 'Please add at least one product';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const total = saleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newSale: Sale = {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            customer: customer.trim(),
            products: saleItems,
            total,
            paymentMethod
        };

        setSales([...sales, newSale]);

        // Update stock
        const updatedProducts = products.map(product => {
            const saleItem = saleItems.find(item => item.productId === product.id);
            if (saleItem) {
                return { ...product, stock: product.stock - saleItem.quantity };
            }
            return product;
        });
        setProducts(updatedProducts);

        // Reset form
        setCustomer('');
        setSaleItems([]);
        setPaymentMethod('Cash');
        setActiveView('sales-list');
    };

    const subtotal = saleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">New Sale</h2>
                <p className="text-gray-600 mt-1">Create a new sales transaction</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Customer & Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Information */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Customer Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={customer}
                                        onChange={(e) => {
                                            setCustomer(e.target.value);
                                            if (errors.customer) setErrors({ ...errors, customer: '' });
                                        }}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.customer ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter customer name"
                                    />
                                    {errors.customer && <p className="mt-1 text-sm text-red-600">{errors.customer}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Payment Method
                                    </label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Due">Due</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Credit Card">ABA Bank</option>
                                        <option value="Debit Card">Acleda Back</option>

                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Add Products */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-4">Add Products</h3>
                            {errors.items && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    <p className="text-sm">{errors.items}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                                    <select
                                        value={selectedProduct}
                                        onChange={(e) => {
                                            setSelectedProduct(e.target.value);
                                            if (errors.product) setErrors({ ...errors, product: '' });
                                        }}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.product ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Select a product</option>
                                        {availableProducts.map(product => (
                                            <option key={product.id} value={product.id}>
                                                {product.name} - ${product.price} (Stock: {product.stock})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.product && <p className="mt-1 text-sm text-red-600">{errors.product}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => {
                                            setQuantity(e.target.value);
                                            if (errors.quantity) setErrors({ ...errors, quantity: '' });
                                        }}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.quantity ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="0"
                                        min="1"
                                    />
                                    {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
                                </div>

                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={handleAddItem}
                                        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add
                                    </button>
                                </div>
                            </div>

                            {/* Sale Items */}
                            {saleItems.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-medium mb-3">Sale Items</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                                <th className="px-4 py-2"></th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                            {saleItems.map((item, index) => {
                                                const product = products.find(p => p.id === item.productId);
                                                return (
                                                    <tr key={index}>
                                                        <td className="px-4 py-3">
                                                            <div>
                                                                <p className="font-medium">{product?.name}</p>
                                                                <p className="text-sm text-gray-500">SKU: {product?.sku}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">${item.price.toFixed(2)}</td>
                                                        <td className="px-4 py-3">
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => updateItemQuantity(index, e.target.value)}
                                                                className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                min="1"
                                                                max={product?.stock}
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3 font-medium">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(index)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow sticky top-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Order Summary
                            </h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax (10%)</span>
                                    <span className="font-medium">${tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Total</span>
                                        <span className="text-xl font-bold text-green-600">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Complete Sale
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveView('sales-list')}
                                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>

                            {saleItems.length > 0 && (
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <strong>Items:</strong> {saleItems.reduce((sum, item) => sum + item.quantity, 0)} units
                                    </p>
                                    <p className="text-sm text-blue-800 mt-1">
                                        <strong>Customer:</strong> {customer || 'Not specified'}
                                    </p>
                                    <p className="text-sm text-blue-800 mt-1">
                                        <strong>Payment:</strong> {paymentMethod}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddSale;