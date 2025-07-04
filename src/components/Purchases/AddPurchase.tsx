import React, { useState } from 'react';
import { Product, Purchase } from '@/types';
import { Package, Plus, Trash2, AlertCircle, TrendingUp } from 'lucide-react';

interface AddPurchaseProps {
    products: Product[];
    purchases: Purchase[];
    setPurchases: (purchases: Purchase[]) => void;
    setProducts: (products: Product[]) => void;
    setActiveView: (view: string) => void;
}

const AddPurchase: React.FC<AddPurchaseProps> = ({
                                                     products,
                                                     purchases,
                                                     setPurchases,
                                                     setProducts,
                                                     setActiveView
                                                 }) => {
    const [supplier, setSupplier] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [cost, setCost] = useState('');
    const [purchaseItems, setPurchaseItems] = useState<{ productId: string; quantity: number; cost: number }[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [notes, setNotes] = useState('');

    // Get suggested suppliers from previous purchases
    const suggestedSuppliers = Array.from(new Set(purchases.map(p => p.supplier))).slice(0, 5);

    const validateAddItem = () => {
        const newErrors: Record<string, string> = {};

        if (!selectedProduct) {
            newErrors.product = 'Please select a product';
        }

        if (!quantity || parseInt(quantity) <= 0) {
            newErrors.quantity = 'Quantity must be greater than 0';
        }

        if (!cost || parseFloat(cost) <= 0) {
            newErrors.cost = 'Cost must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddItem = () => {
        if (!validateAddItem()) return;

        const product = products.find(p => p.id === selectedProduct);
        if (product) {
            const existingItem = purchaseItems.find(item => item.productId === selectedProduct);

            if (existingItem) {
                setPurchaseItems(purchaseItems.map(item =>
                    item.productId === selectedProduct
                        ? {
                            ...item,
                            quantity: item.quantity + parseInt(quantity),
                            cost: parseFloat(cost) // Update to latest cost
                        }
                        : item
                ));
            } else {
                setPurchaseItems([...purchaseItems, {
                    productId: selectedProduct,
                    quantity: parseInt(quantity),
                    cost: parseFloat(cost)
                }]);
            }

            // Auto-fill cost with selling price suggestion
            const nextProduct = products.find(p => p.id === selectedProduct);
            if (nextProduct) {
                setCost((nextProduct.price * 0.6).toFixed(2)); // Suggest 60% of selling price
            } else {
                setCost('');
            }

            setSelectedProduct('');
            setQuantity('');
            setErrors({});
        }
    };

    const removeItem = (index: number) => {
        setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: 'quantity' | 'cost', value: string) => {
        const numValue = field === 'quantity' ? parseInt(value) : parseFloat(value);
        if (numValue > 0) {
            setPurchaseItems(purchaseItems.map((item, i) =>
                i === index ? { ...item, [field]: numValue } : item
            ));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!supplier.trim()) {
            newErrors.supplier = 'Supplier name is required';
        }

        if (purchaseItems.length === 0) {
            newErrors.items = 'Please add at least one product';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const total = purchaseItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
        const newPurchase: Purchase = {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            supplier: supplier.trim(),
            products: purchaseItems,
            total
        };

        setPurchases([...purchases, newPurchase]);

        // Update stock
        const updatedProducts = products.map(product => {
            const purchaseItem = purchaseItems.find(item => item.productId === product.id);
            if (purchaseItem) {
                return { ...product, stock: product.stock + purchaseItem.quantity };
            }
            return product;
        });
        setProducts(updatedProducts);

        // Reset form
        setSupplier('');
        setPurchaseItems([]);
        setNotes('');
        setActiveView('purchases-list');
    };

    const subtotal = purchaseItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
    const estimatedProfit = purchaseItems.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            return sum + ((product.price - item.cost) * item.quantity);
        }
        return sum;
    }, 0);
    const profitMargin = subtotal > 0 ? (estimatedProfit / subtotal) * 100 : 0;

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">New Purchase Order</h2>
                <p className="text-gray-600 mt-1">Record new inventory purchases from suppliers</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Supplier & Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Supplier Information */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-4">Supplier Information</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Supplier Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={supplier}
                                    onChange={(e) => {
                                        setSupplier(e.target.value);
                                        if (errors.supplier) setErrors({ ...errors, supplier: '' });
                                    }}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.supplier ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter supplier name"
                                    list="suppliers"
                                />
                                <datalist id="suppliers">
                                    {suggestedSuppliers.map(s => (
                                        <option key={s} value={s} />
                                    ))}
                                </datalist>
                                {errors.supplier && <p className="mt-1 text-sm text-red-600">{errors.supplier}</p>}

                                {suggestedSuppliers.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-xs text-gray-600 mb-1">Previous suppliers:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {suggestedSuppliers.map(s => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setSupplier(s)}
                                                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                    placeholder="Add any notes about this purchase..."
                                />
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

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                                    <select
                                        value={selectedProduct}
                                        onChange={(e) => {
                                            setSelectedProduct(e.target.value);
                                            if (errors.product) setErrors({ ...errors, product: '' });
                                            // Auto-suggest cost based on product
                                            const product = products.find(p => p.id === e.target.value);
                                            if (product) {
                                                setCost((product.price * 0.6).toFixed(2)); // Suggest 60% of selling price
                                            }
                                        }}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.product ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Select a product</option>
                                        {products.map(product => (
                                            <option key={product.id} value={product.id}>
                                                {product.name} (Current stock: {product.stock})
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost/Unit</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={cost}
                                        onChange={(e) => {
                                            setCost(e.target.value);
                                            if (errors.cost) setErrors({ ...errors, cost: '' });
                                        }}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.cost ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="0.00"
                                        min="0.01"
                                    />
                                    {errors.cost && <p className="mt-1 text-sm text-red-600">{errors.cost}</p>}
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

                            {/* Purchase Items */}
                            {purchaseItems.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-medium mb-3">Purchase Items</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cost/Unit</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Selling Price</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Est. Profit</th>
                                                <th className="px-4 py-2"></th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                            {purchaseItems.map((item, index) => {
                                                const product = products.find(p => p.id === item.productId);
                                                const itemProfit = product ? (product.price - item.cost) * item.quantity : 0;
                                                const itemMargin = product ? ((product.price - item.cost) / product.price) * 100 : 0;

                                                return (
                                                    <tr key={index}>
                                                        <td className="px-4 py-3">
                                                            <div>
                                                                <p className="font-medium">{product?.name}</p>
                                                                <p className="text-sm text-gray-500">SKU: {product?.sku}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                                className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                min="1"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                value={item.cost}
                                                                onChange={(e) => updateItem(index, 'cost', e.target.value)}
                                                                className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                min="0.01"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            ${product?.price.toFixed(2) || '0.00'}
                                                        </td>
                                                        <td className="px-4 py-3 font-medium">
                                                            ${(item.cost * item.quantity).toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div>
                                                                <p className={`font-medium ${itemProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                    ${itemProfit.toFixed(2)}
                                                                </p>
                                                                <p className="text-xs text-gray-500">{itemMargin.toFixed(1)}%</p>
                                                            </div>
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
                                <Package className="w-5 h-5 mr-2" />
                                Order Summary
                            </h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Estimated Profit</span>
                                    <span className={`font-medium ${estimatedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${estimatedProfit.toFixed(2)}
                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Profit Margin</span>
                                    <span className="font-medium">{profitMargin.toFixed(1)}%</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Total Cost</span>
                                        <span className="text-xl font-bold text-red-600">${subtotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {estimatedProfit > 0 && (
                                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                                    <div className="flex items-start">
                                        <TrendingUp className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-green-800">Good margin!</p>
                                            <p className="text-xs text-green-700 mt-1">
                                                This purchase will yield {profitMargin.toFixed(1)}% profit margin
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Complete Purchase
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveView('purchases-list')}
                                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>

                            {purchaseItems.length > 0 && (
                                <div className="mt-6 space-y-2">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>Items:</strong> {purchaseItems.reduce((sum, item) => sum + item.quantity, 0)} units
                                        </p>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>Supplier:</strong> {supplier || 'Not specified'}
                                        </p>
                                    </div>
                                    {notes && (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-700">
                                                <strong>Notes:</strong> {notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddPurchase;