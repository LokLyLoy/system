import React from 'react';
import { Sale, Product } from '@/types';

interface Props {
    sale: Sale;
    products: Product[] | undefined;
    onClose: () => void;
}

const InvoiceModal: React.FC<Props> = ({ sale, products, onClose }) => {
    const getProductName = (id: string) => {
        const p = products?.find(p => p.id === id);
        return p ? p.name : `Product #${id}`;
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center print:hidden">
            <div className="bg-white w-[650px] max-w-full p-8 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="mb-6 border-b pb-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">INVOICE</h1>
                        <p className="text-sm text-gray-600">Sale ID: #{sale.id}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                        <p>Date: {sale.date}</p>
                        <p>Payment: <span className="font-medium">{sale.paymentMethod}</span></p>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-1">Billed To:</p>
                    <h2 className="text-lg font-semibold">{sale.customer}</h2>
                </div>

                {/* Items */}
                <table className="w-full text-sm border-t border-b mb-6">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 text-left">Product</th>
                        <th className="py-2 text-left">Qty</th>
                        <th className="py-2 text-left">Price</th>
                        <th className="py-2 text-left">Subtotal</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sale.products.map((item, i) => (
                        <tr key={i} className="border-b last:border-b-0">
                            <td className="py-2">{getProductName(item.productId)}</td>
                            <td className="py-2">{item.quantity}</td>
                            <td className="py-2">${item.price.toFixed(2)}</td>
                            <td className="py-2">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Total */}
                <div className="flex justify-end items-center">
                    <div className="w-full max-w-xs text-right">
                        <p className="text-gray-600 text-sm mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-green-600">${sale.total.toFixed(2)}</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-end gap-2 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Print
                    </button>
                    <button
                        onClick={onClose}
                        className="border px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
