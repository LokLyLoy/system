'use client';

import React, { useState } from 'react';

interface DataItem {
    date: string;
    paymentRef: string;
    saleRef: string;
    customer: string;
    purchaseRef: string;
    paidBy: string;
    amount: number;
    type: string;
}

const generateData = (): DataItem[] => {
    return Array.from({ length: 14952 }, (_, i) => ({
        date: `2025-07-${(i % 30 + 1).toString().padStart(2, '0')}`,
        paymentRef: `PAY-${1000 + i}`,
        saleRef: `SALE-${2000 + i}`,
        customer: `Customer ${i + 1}`,
        purchaseRef: `PUR-${3000 + i}`,
        paidBy: i % 2 === 0 ? 'ABA' : 'Cash',
        amount: Math.floor(Math.random() * 1000) + 50,
        type: i % 3 === 0 ? 'Sale' : 'Return',
    }));
};

const columns = [
    { key: 'date', label: 'Date (yyyy-mm-dd)' },
    { key: 'paymentRef', label: 'Payment Reference' },
    { key: 'saleRef', label: 'Sale Reference' },
    { key: 'customer', label: 'Customer' },
    { key: 'purchaseRef', label: 'Purchase Reference' },
    { key: 'paidBy', label: 'Paid by' },
    { key: 'amount', label: 'Amount' },
    { key: 'type', label: 'Type' },
];

type SortKey = keyof DataItem;

const SortableTable: React.FC = () => {
    const [data] = useState<DataItem[]>(generateData());
    const [sortBy, setSortBy] = useState<SortKey>('date');
    const [sortAsc, setSortAsc] = useState(true);
    const [page, setPage] = useState(1);
    const rowsPerPage = 50;

    const handleSort = (key: SortKey) => {
        if (key === sortBy) {
            setSortAsc(!sortAsc);
        } else {
            setSortBy(key);
            setSortAsc(true);
        }
    };

    const sortedData = [...data].sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortAsc ? aVal - bVal : bVal - aVal;
        }

        return sortAsc
            ? String(aVal).localeCompare(String(bVal))
            : String(bVal).localeCompare(String(aVal));
    });

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const currentPageData = sortedData.slice(start, end);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    return (
        <div className="p-6">
            <div className="overflow-x-auto border rounded-lg shadow">
                <table className="min-w-full table-auto text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-4 py-3 cursor-pointer select-none hover:underline"
                                onClick={() => handleSort(col.key as SortKey)}
                            >
                                {col.label}
                                {sortBy === col.key && (
                                    <span className="ml-1">{sortAsc ? '▲' : '▼'}</span>
                                )}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {currentPageData.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{item.date}</td>
                            <td className="px-4 py-2">{item.paymentRef}</td>
                            <td className="px-4 py-2">{item.saleRef}</td>
                            <td className="px-4 py-2">{item.customer}</td>
                            <td className="px-4 py-2">{item.purchaseRef}</td>
                            <td className="px-4 py-2">{item.paidBy}</td>
                            <td className="px-4 py-2 text-right">${item.amount.toFixed(2)}</td>
                            <td className="px-4 py-2">{item.type}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="mt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
                <div className="mb-2 md:mb-0">
                    Showing {start + 1} to {Math.min(end, data.length)} of {data.length} entries
                </div>
                <div className="flex space-x-1">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
                    >
                        &lt; Previous
                    </button>
                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`px-3 py-1 border rounded ${
                                    page === pageNum
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white hover:bg-gray-100'
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
                    >
                        Next &gt;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SortableTable;
