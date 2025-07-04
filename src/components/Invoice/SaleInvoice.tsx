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
        <div className="fixed inset-0 z-50 bg-white/30 backdrop-blur-sm flex justify-center items-center print:hidden">
         <div className="bg-white w-[550px] p-6 rounded-lg shadow-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-2">Invoice</h2>
                <p className="text-sm text-gray-600 mb-4">Sale ID: #{sale.id}</p>
                <div className="mb-4">
                    <p><strong>Date:</strong> {sale.date}</p>
                    <p><strong>Customer:</strong> {sale.customer}</p>
                    <p><strong>Payment Method:</strong> {sale.paymentMethod}</p>
                </div>

                <table className="w-full text-sm mb-4 border-t border-b">
                    <thead>
                    <tr>
                        <th className="py-2 text-left">Product</th>
                        <th className="py-2 text-left">Qty</th>
                        <th className="py-2 text-left">Price</th>
                        <th className="py-2 text-left">Subtotal</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sale.products.map((item, i) => (
                        <tr key={i}>
                            <td className="py-1">{getProductName(item.productId)}</td>
                            <td className="py-1">{item.quantity}</td>
                            <td className="py-1">${item.price.toFixed(2)}</td>
                            <td className="py-1">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <p className="text-right font-semibold text-lg">
                    Total: ${sale.total.toFixed(2)}
                </p>

                <div className="mt-6 flex justify-end space-x-2 print:hidden">
                    <button onClick={handlePrint} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Print
                    </button>
                    <button onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
