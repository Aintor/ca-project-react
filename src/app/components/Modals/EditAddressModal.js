import React, { useState } from 'react';
import axios from 'axios';

const EditAddressModal = ({ address, onClose, onUpdate }) => {
    console.log(address);
    const [updatedAddress, setUpdatedAddress] = useState({
        street: address.street,
        city: address.city,
        state: address.state,
        country: address.country,
        zipCode: address.zipCode,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleChange = (e) => {
        setUpdatedAddress({
            ...updatedAddress,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.patch(`${apiBaseUrl}/addresses?addressId=${address.id}`, {
                ...updatedAddress,
            }, {
                withCredentials: true,
            });
            if (response.data.success) {
                onUpdate({ id: address.id, ...updatedAddress });
                onClose();
            } else {
                setError(response.data.message || 'Failed to update address.');
            }
        } catch (err) {
            console.error('Error updating address:', err);
            setError('An error occurred while updating the address.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
            {/* Modal Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 z-10 w-11/12 max-w-md shadow-xl">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Edit Address</h2>
                {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">{error}</div>}
                <div className="space-y-4">
                    <input
                        type="text"
                        name="street"
                        placeholder="Street"
                        value={updatedAddress.street ? updatedAddress.street : ''}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={updatedAddress.city ? updatedAddress.city : ''}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <input
                        type="text"
                        name="state"
                        placeholder="State/Province"
                        value={updatedAddress.state ? updatedAddress.state : ''}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={updatedAddress.country ? updatedAddress.country : ''}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <input
                        type="text"
                        name="zipCode"
                        placeholder="ZIP Code"
                        value={updatedAddress.zipCode ? updatedAddress.zipCode : ''}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div className="flex justify-end mt-6 space-x-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg shadow transition-transform transform hover:scale-105"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                        {loading ? 'Updating...' : 'Update Address'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditAddressModal;