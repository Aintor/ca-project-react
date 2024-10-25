import React, { useState } from 'react';
import axios from 'axios';

const AddAddressModal = ({ onClose, onAdd }) => {
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleChange = (e) => {
        setNewAddress({
            ...newAddress,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(`${apiBaseUrl}/addresses`, newAddress, {
                withCredentials: true,
            });
            if (response.data.success) {
                onAdd(response.data.address);
                onClose();
            } else {
                setError(response.data.message || 'Failed to add address.');
            }
        } catch (err) {
            console.error('Error adding address:', err);
            setError('An error occurred while adding the address.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
            {/* Modal Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 z-10 w-11/12 max-w-md">
                <h2 className="text-2xl text-gray-800 dark:text-gray-200 mb-4">Add New Address</h2>
                {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">{error}</div>}
                <div className="space-y-4">
                    <input
                        type="text"
                        name="street"
                        placeholder="Street"
                        value={newAddress.street}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                    <input
                        type="text"
                        name="state"
                        placeholder="State/Province"
                        value={newAddress.state}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={newAddress.country}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                    <input
                        type="text"
                        name="zipcode"
                        placeholder="ZIP Code"
                        value={newAddress.zipcode}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                </div>
                <div className="flex justify-end mt-6 space-x-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200"
                    >
                        {loading ? 'Adding...' : 'Add Address'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddAddressModal;