{/*
Author: Wang Jiaxuan
*/}
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddressModal = ({ isOpen, onClose, onAddressAdded }) => {
    const initialAddressState = {
        street: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
    };

    const [newAddress, setNewAddress] = useState(initialAddressState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Reset form fields when the modal is opened
    useEffect(() => {
        if (isOpen) {
            setNewAddress(initialAddressState);
            setError('');
            setLoading(false);
        }
    }, [isOpen]);

    // Handle input field changes
    const handleChange = (e) => {
        setNewAddress({
            ...newAddress,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submission
    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            // Convert newAddress object into URL query parameters
            const queryParams = new URLSearchParams(newAddress).toString();

            // Make a POST request with newAddress data as query parameters
            const response = await axios.post(`${apiBaseUrl}/addresses?${queryParams}`, {}, {
                timeout: 10000,
                withCredentials: true,
            });

            // Handle success response
            if (response.data.success) {
                onAddressAdded(response.data.address);
                onClose();
            } else {
                setError(response.data.message || 'Failed to add address. Please try again.');
            }
        } catch (err) {
            console.error('Error adding address:', err);
            setError('Failed to add address. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Don't render the modal if it's not open
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content with Frosted Glass Effect */}
            <div
                className="
                    bg-white bg-opacity-30
                    backdrop-filter backdrop-blur-lg
                    rounded-2xl p-6 z-10 w-11/12 max-w-md
                    shadow-lg
                    transition-transform transform
                    hover:scale-105
                    dark:bg-gray-800 dark:bg-opacity-50 dark:backdrop-blur-md
                "
            >
                <h2 className="text-2xl text-gray-800 dark:text-gray-200 mb-4 font-semibold">
                    Add New Address
                </h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <div className="space-y-4">
                    <input
                        type="text"
                        name="street"
                        placeholder="Street"
                        value={newAddress.street}
                        onChange={handleChange}
                        className="
                            w-full p-2 rounded-2xl
                            bg-gray-200 dark:bg-gray-700
                            text-gray-800 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            transition-transform transform
                            hover:scale-105
                        "
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={handleChange}
                        className="
                            w-full p-2 rounded-2xl
                            bg-gray-200 dark:bg-gray-700
                            text-gray-800 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            transition-transform transform
                            hover:scale-105
                        "
                    />
                    <input
                        type="text"
                        name="state"
                        placeholder="State/Province"
                        value={newAddress.state}
                        onChange={handleChange}
                        className="
                            w-full p-2 rounded-2xl
                            bg-gray-200 dark:bg-gray-700
                            text-gray-800 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            transition-transform transform
                            hover:scale-105
                        "
                    />
                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={newAddress.country}
                        onChange={handleChange}
                        className="
                            w-full p-2 rounded-2xl
                            bg-gray-200 dark:bg-gray-700
                            text-gray-800 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            transition-transform transform
                            hover:scale-105
                        "
                    />
                    <input
                        type="text"
                        name="zipcode"
                        placeholder="ZIP Code"
                        value={newAddress.zipcode}
                        onChange={handleChange}
                        className="
                            w-full p-2 rounded-2xl
                            bg-gray-200 dark:bg-gray-700
                            text-gray-800 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            transition-transform transform
                            hover:scale-105
                        "
                    />
                </div>
                <div className="flex justify-end mt-6 space-x-2">
                    <button
                        onClick={onClose}
                        className="
                            bg-gray-600 text-gray-200 px-4 py-2 rounded-2xl
                            hover:bg-gray-500
                            transition-colors duration-300
                            focus:outline-none focus:ring-2 focus:ring-gray-400
                        "
                    >
                        Close
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`
                            bg-blue-600 text-white px-4 py-2 rounded-2xl 
                            hover:bg-blue-500 
                            transition-colors duration-300 
                            focus:outline-none focus:ring-2 focus:ring-blue-400 
                            ${loading ? 'cursor-not-allowed opacity-50' : ''}
                        `}
                    >
                        {loading ? 'Adding...' : 'Add Address'}
                    </button>
                </div>
            </div>
        </div>
    );

};

export default AddressModal;