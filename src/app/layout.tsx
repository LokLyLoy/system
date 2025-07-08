import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/contexts/AppContext';
import Navigation from '@/components/Layout/Navigation';
import Sidebar from '@/components/Layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: "LokLy's Management System",
    description: 'A comprehensive business management system for inventory, sales, and purchases',
};

export default function RootLayout({ children, }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <AppProvider>
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="flex">
                    <Sidebar />
                    <div className="flex-1 overflow-auto">
                        {children}
                    </div>
                </div>
            </div>
        </AppProvider>
        </body>
        </html>
    );
}