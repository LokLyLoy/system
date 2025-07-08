'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Settings, LogOut, Users, AlertCircle } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import Image from "next/image";

const Navigation: React.FC = () => {
    const router = useRouter();
    const {
        notifications,
        showNotifications,
        setShowNotifications,
        showUserMenu,
        setShowUserMenu
    } = useAppContext();

    const handleSettings = () => {
        // Navigate to settings page when it exists
        // router.push('/settings');
        console.log('Settings clicked');
        setShowUserMenu(false);
    };

    const handleLogout = () => {
        // Handle logout logic here
        // Clear any auth tokens, user data, etc.
        // Then redirect to login page
        // router.push('/login');
        console.log('Logout clicked');
        setShowUserMenu(false);
    };

    return (
        <header className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
            {/* Logo / Title */}
            <h1
                className="text-xl font-bold text-gray-800 tracking-tight cursor-pointer flex items-center gap-2"
                onClick={() => router.push('/dashboard')}
            >
                <Image
                    src={'/images/myLogo.jpg'}
                    alt={'logo'}
                    width={200}
                    height={100}
                    className='w-[50px] h-auto'
                />

                LokLy&apos;s <span className="text-blue-600">System</span>
            </h1>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-6">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowNotifications(!showNotifications);
                        }}
                        className="relative p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <Bell className="w-5 h-5 text-gray-700" />
                        {notifications.filter(n => !n.read).length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
                            <div className="px-4 py-3 border-b">
                                <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <p className="p-4 text-sm text-gray-500 text-center">No notifications</p>
                                ) : (
                                    notifications.map(notif => (
                                        <div
                                            key={notif.id}
                                            className="px-4 py-3 hover:bg-gray-50 flex items-start border-b text-sm text-gray-800 cursor-pointer"
                                        >
                                            <AlertCircle className="w-4 h-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                                            <span>{notif.message}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowUserMenu(!showUserMenu);
                        }}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
                    >
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">Admin</span>
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg z-50 overflow-hidden border">
                            <button
                                onClick={handleSettings}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center text-sm text-gray-700 transition"
                            >
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center text-sm text-gray-700 transition"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navigation;