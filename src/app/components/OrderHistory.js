import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingComponent from './LoadingComponent';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/cart/order/history`, {
                    withCredentials: true,
                });
                if (response.data.success || Array.isArray(response.data)) {
                    setOrders(response.data);
                } else {
                    setError(response.data.message || 'Failed to fetch order history.');
                }
            } catch (err) {
                console.error('Error fetching order history:', err);
                setError('An error occurred while fetching order history.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, [apiBaseUrl]);

    if (loading) {
        return <LoadingComponent />;
    }

    if (error) {
        return <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>;
    }

    if (orders.length === 0) {
        return <p className="text-gray-600 dark:text-gray-400">You have no past orders.</p>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Order History</h2>
            {orders.map((order, index) => (
                <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-md shadow">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-700 dark:text-gray-300">Order #{index + 1}</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">Total: ${order.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Items:</h3>
                        <ul className="list-disc list-inside space-y-2">
                            {order.orderItems.map((item, idx) => (
                                <li key={idx} className="text-gray-700 dark:text-gray-300">
                                    {item.quantity} x {item.product.name} - ${item.product.price.toFixed(2)} each
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Shipping Address:</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            {order.address.street}, {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipCode}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Date:</h3>
                        <p className="text-gray-700 dark:text-gray-300">{new Date(order.user.timestamp).toLocaleDateString()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderHistory;