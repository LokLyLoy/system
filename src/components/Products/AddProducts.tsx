import React, { useState } from 'react';
import { Product } from '@/types';
import { Package, RefreshCw, Upload, X, CheckCircle } from 'lucide-react';
import categoriesData from '@/data/category.json';

interface AddProductProps {
    products: Product[];
    setProducts: (products: Product[]) => void;
    setActiveView: (view: string) => void;
}

const CATEGORIES = categoriesData;

const AddProduct: React.FC<AddProductProps> = ({ products, setProducts, setActiveView }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        category: '',
        cost: '',
        price: '',
        description: '',
        image: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Generate random product code
    const generateProductCode = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const prefix = formData.category ? formData.category.substring(0, 3).toUpperCase() : 'PRD';
            const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            const generatedCode = `${prefix}-${randomNum}`;

            // Check if code already exists
            if (products.some(p => p.sku === generatedCode)) {
                generateProductCode(); // Regenerate if exists
            } else {
                setFormData({ ...formData, code: generatedCode });
                setErrors({ ...errors, code: '' });
            }
            setIsGenerating(false);
        }, 300);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors({ ...errors, image: 'Image size should be less than 5MB' });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setFormData({ ...formData, image: reader.result as string });
                setErrors({ ...errors, image: '' });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview('');
        setFormData({ ...formData, image: '' });
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        }

        if (!formData.code.trim()) {
            newErrors.code = 'Product code is required';
        } else if (products.some(p => p.sku === formData.code)) {
            newErrors.code = 'Product code already exists';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.cost || parseFloat(formData.cost) <= 0) {
            newErrors.cost = 'Cost must be greater than 0';
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Price must be greater than 0';
        } else if (parseFloat(formData.price) < parseFloat(formData.cost)) {
            newErrors.price = 'Selling price should be greater than cost';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const newProduct: Product = {
            id: Date.now().toString(),
            name: formData.name.trim(),
            sku: formData.code.trim().toUpperCase(),
            price: parseFloat(formData.price),
            stock: 0, // Initial stock is 0, will be updated via purchases
            minStock: 10, // Default minimum stock
            category: formData.category,
            cost: parseFloat(formData.cost),
            description: formData.description.trim(),
            image: formData.image
        };

        setProducts([...products, newProduct]);

        // Show success animation
        setShowSuccess(true);
        setTimeout(() => {
            setFormData({ name: '', code: '', category: '', cost: '', price: '', description: '', image: '' });
            setImagePreview('');
            setActiveView('products-list');
        }, 1500);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const calculateProfit = () => {
        const cost = parseFloat(formData.cost) || 0;
        const price = parseFloat(formData.price) || 0;
        const profit = price - cost;
        const margin = cost > 0 ? (profit / cost) * 100 : 0;
        return { profit, margin };
    };

    const { profit, margin } = calculateProfit();

    return (
        <div className="p-6 animate-fadeIn">
            <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                    <Package className="mr-2" />
                    Add New Product
                </h2>
                <p className="text-gray-600 mt-1">Fill in the product details to add it to your inventory</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300">
                {showSuccess && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-xl animate-bounceIn">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <p className="text-xl font-semibold text-center">Product Added Successfully!</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Name and Code */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="animate-slideInLeft">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                    errors.name ? 'border-red-500 shake' : 'border-gray-300'
                                }`}
                                placeholder="Enter product name"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.name}</p>}
                        </div>

                        <div className="animate-slideInRight">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Code <span className="text-red-500">*</span>
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => handleInputChange('code', e.target.value)}
                                    className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                        errors.code ? 'border-red-500 shake' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., PRD-001"
                                />
                                <button
                                    type="button"
                                    onClick={generateProductCode}
                                    disabled={isGenerating}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 flex items-center"
                                    title="Auto-generate code"
                                >
                                    <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                                </button>
                            </div>
                            {errors.code && <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.code}</p>}
                        </div>
                    </div>

                    {/* Category Dropdown */}
                    <div className="animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                errors.category ? 'border-red-500 shake' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select a category</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.category && <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.category}</p>}
                    </div>

                    {/* Cost and Price */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Cost (Buy Price) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.cost}
                                onChange={(e) => handleInputChange('cost', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                    errors.cost ? 'border-red-500 shake' : 'border-gray-300'
                                }`}
                                placeholder="0.00"
                                min="0"
                            />
                            {errors.cost && <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.cost}</p>}
                        </div>

                        <div className="animate-slideInUp" style={{ animationDelay: '0.3s' }}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Selling Price <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => handleInputChange('price', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                    errors.price ? 'border-red-500 shake' : 'border-gray-300'
                                }`}
                                placeholder="0.00"
                                min="0"
                            />
                            {errors.price && <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.price}</p>}
                        </div>

                        <div className="animate-slideInRight" style={{ animationDelay: '0.4s' }}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Profit Info</label>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm">
                                    Profit: <span className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ${profit.toFixed(2)}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-600">
                                    Margin: {margin.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="animate-slideInLeft" style={{ animationDelay: '0.5s' }}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            rows={3}
                            placeholder="Enter product description (optional)"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="animate-slideInUp" style={{ animationDelay: '0.6s' }}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Image
                        </label>
                        <div className="flex items-center space-x-4">
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Product preview"
                                        className="w-32 h-32 object-cover rounded-lg shadow-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-all">
                                    <Upload className="w-8 h-8 text-gray-400" />
                                    <span className="mt-2 text-sm text-gray-500">Upload Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            )}
                            {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
                        </div>
                    </div>

                    {/* Form Summary */}
                    {formData.name && formData.cost && formData.price && (
                        <div className="bg-blue-50 p-4 rounded-lg animate-fadeIn">
                            <h4 className="text-sm font-semibold text-blue-800 mb-2">Product Summary</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div>
                                    <span className="text-blue-600">Name:</span>
                                    <p className="font-medium text-blue-900">{formData.name}</p>
                                </div>
                                <div>
                                    <span className="text-blue-600">Category:</span>
                                    <p className="font-medium text-blue-900">{formData.category || 'Not set'}</p>
                                </div>
                                <div>
                                    <span className="text-blue-600">Profit:</span>
                                    <p className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ${profit.toFixed(2)} ({margin.toFixed(1)}%)
                                    </p>
                                </div>
                                <div>
                                    <span className="text-blue-600">Code:</span>
                                    <p className="font-medium text-blue-900">{formData.code || 'Not set'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => setActiveView('products-list')}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                        >
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;

// Add these CSS animations to your global CSS file (globals.css)
/*
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

.animate-slideInLeft {
  animation: slideInLeft 0.5s ease-out forwards;
  opacity: 0;
}

.animate-slideInRight {
  animation: slideInRight 0.5s ease-out forwards;
  opacity: 0;
}

.animate-slideInUp {
  animation: slideInUp 0.5s ease-out forwards;
  opacity: 0;
}

.animate-bounceIn {
  animation: bounceIn 0.5s ease-out;
}

.shake {
  animation: shake 0.3s ease-out;
}
*/