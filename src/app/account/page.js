// pages/user.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'; // Using next/router for navigation
import LoadingComponent from '../components/LoadingComponent'; // Assuming it's in the components folder
import ErrorComponent from '../components/ErrorComponent'; // Assuming it's in the components folder

const UserPage = () => {
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [ordersError, setOrdersError] = useState('');

    const [logoutLoading, setLogoutLoading] = useState(false);
    const [logoutError, setLogoutError] = useState('');

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Fetch order history
    const fetchOrderHistory = async () => {
        setLoadingOrders(true);
        setOrdersError('');
        try {
            const response = await axios.get(`${apiBaseUrl}/cart/order/history`, {
                timeout: 10000,
                withCredentials: true,
            });
            if (Array.isArray(response.data)) {
                setOrders(response.data);
            } else {
                throw new Error('Unexpected response format.');
            }
        } catch (error) {
            console.error('Error fetching order history:', error);
            let message = 'Unable to retrieve order history. Please try again later.';
            if (error.code === 'ECONNABORTED') {
                message = 'The request timed out. Please try again later.';
            } else if (error.response) {
                message = `Server error (${error.response.status}): ${error.response.data.message || 'Please contact support.'}`;
            } else if (error.request) {
                message = 'Network error: Unable to reach the server. Please check your connection.';
            }
            setOrdersError(message);
        } finally {
            setLoadingOrders(false);
        }
    };

    // Handle "View Order History" button click
    const handleViewOrderHistory = () => {
        setIsModalOpen(true);
        fetchOrderHistory();
    };

    // Handle logout
    const handleLogout = async () => {
        setLogoutLoading(true);
        setLogoutError('');
        try {
            const response = await axios.post(`${apiBaseUrl}/api/logout`, {}, {
                timeout: 10000,
                withCredentials: true,
            });
            if (response.data.success) {
                router.push('/login'); // Redirect to login page upon successful logout
            } else {
                throw new Error(response.data.message || 'Logout failed.');
            }
        } catch (error) {
            console.error('Logout error:', error);
            let message = 'Logout failed. Please try again later.';
            if (error.code === 'ECONNABORTED') {
                message = 'The request timed out. Please try again later.';
            } else if (error.response) {
                message = `Server error (${error.response.status}): ${error.response.data.message || 'Please contact support.'}`;
            } else if (error.request) {
                message = 'Network error: Unable to reach the server. Please check your connection.';
            }
            setLogoutError(message);
        } finally {
            setLogoutLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-sans font-extrabold text-gray-100 mb-8">User Center</h1>

            {/* Button Group */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* View Order History Button */}
                <button
                    onClick={handleViewOrderHistory}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-2xl transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    View Order History
                </button>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-2xl transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
                    disabled={logoutLoading}
                >
                    {logoutLoading ? 'Logging out...' : 'Logout'}
                </button>
            </div>

            {/* Logout Error Message */}
            {logoutError && (
                <div className="mt-4">
                    <ErrorComponent message={logoutError} />
                </div>
            )}

            {/* Order History Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-800 dark:bg-gray-900 p-6 rounded-2xl shadow-lg max-w-3xl w-full max-h-full overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-sans font-bold text-gray-100">Order History</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-300 hover:text-gray-100 transition-colors duration-300 text-2xl font-bold"
                            >
                                &times;
                            </button>
                        </div>

                        {loadingOrders ? (
                            <LoadingComponent />
                        ) : ordersError ? (
                            <ErrorComponent message={ordersError} />
                        ) : orders.length === 0 ? (
                            <p className="text-gray-300">You have no order history.</p>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order, index) => (
                                    <div key={index} className="bg-gray-700 dark:bg-gray-800 p-4 rounded-2xl shadow-inner">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-lg font-semibold text-gray-100">Order #{index + 1}</span>
                                            <span className="text-sm text-gray-400">Total: ${order.totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-sm text-gray-400">Shipping Address:</span>
                                            <p className="text-sm text-gray-300">
                                                {order.address.street}, {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipCode}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-400">Products:</span>
                                            <ul className="mt-2 space-y-2">
                                                {order.orderItems.map((item, idx) => (
                                                    <li key={idx} className="flex justify-between items-center">
                                                        <span className="text-gray-100">{item.product.name} × {item.quantity}</span>
                                                        <span className="text-gray-300">${(item.product.price * item.quantity).toFixed(2)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPage;