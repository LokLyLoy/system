'use client';

import React from 'react';
import { Bell, Settings, LogOut, Users, AlertCircle } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const Navigation: React.FC = () => {
    const {
        notifications,
        showNotifications,
        setShowNotifications,
        showUserMenu,
        setShowUserMenu
    } = useAppContext();

    return (
        <div className="bg-gray-800 text-white p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">LokLy's System</h1>
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowNotifications(!showNotifications);
                            }}
                            className="relative p-2 hover:bg-gray-700 rounded"
                        >
                            <Bell className="w-5 h-5" />
                            {notifications.filter(n => !n.read).length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
                            )}
                        </button>
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-lg z-50">
                                <div className="p-4 border-b">
                                    <h3 className="font-semibold">Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <p className="p-4 text-gray-500">No notifications</p>
                                    ) : (
                                        notifications.map(notif => (
                                            <div key={notif.id} className="p-4 border-b hover:bg-gray-50">
                                                <div className="flex items-start">
                                                    <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 mt-1" />
                                                    <p className="text-sm">{notif.message}</p>
                                                </div>
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
                            className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"
                        >
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5" />
                            </div>
                            <span>Admin</span>
                        </button>
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-50">
                                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </button>
                                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navigation;