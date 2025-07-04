'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Sale, Purchase, Notification } from '@/types';
import productsData from '@/data/products.json';
import salesData from '@/data/sales.json';
import purchasesData from '@/data/purchases.json';

interface AppContextType {
    // Products
    products: Product[];
    setProducts: (products: Product[]) => void;

    // Sales
    sales: Sale[];
    setSales: (sales: Sale[]) => void;

    // Purchases
    purchases: Purchase[];
    setPurchases: (purchases: Purchase[]) => void;

    // Notifications
    notifications: Notification[];
    setNotifications: (notifications: Notification[]) => void;

    // UI State
    showNotifications: boolean;
    setShowNotifications: (show: boolean) => void;
    showUserMenu: boolean;
    setShowUserMenu: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    // Data states
    const [products, setProducts] = useState<Product[]>(productsData);
    const [sales, setSales] = useState<Sale[]>(salesData);
    const [purchases, setPurchases] = useState<Purchase[]>(purchasesData);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // UI states
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Check for low stock notifications
    useEffect(() => {
        const lowStockProducts = products.filter(p => p.stock < p.minStock);
        const newNotifications = lowStockProducts.map(p => ({
            id: `notif-${p.id}`,
            message: `Low stock alert: ${p.name} (${p.stock} units remaining)`,
            type: 'warning' as const,
            read: false
        }));
        setNotifications(newNotifications);
    }, [products]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setShowNotifications(false);
            setShowUserMenu(false);
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <AppContext.Provider value={{
            products, setProducts,
            sales, setSales,
            purchases, setPurchases,
            notifications, setNotifications,
            showNotifications, setShowNotifications,
            showUserMenu, setShowUserMenu
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
}