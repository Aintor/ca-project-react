// components/UserCenter/Modals/DeleteAddressModal.jsx
import React, { useState } from 'react';
import axios from 'axios';

const DeleteAddressModal = ({ address, onClose, onDelete }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleDelete = async () => {
        setLoading(true);
        setError('');
        try {
            console.log('delete');
            console.log(address);
            const response = await axios.delete(`${apiBaseUrl}/addresses?addressId=${address.id}`, {
                data: { addressId: address.id },
                withCredentials: true,
            });
            if (response.data.success) {
                onDelete(address.id);
                onClose();
            } else {
                setError(response.data.message || 'Failed to delete address.');
            }
        } catch (err) {
            console.error('Error deleting address:', err);
            setError('An error occurred while deleting the address.');
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
                <h2 className="text-2xl text-gray-800 dark:text-gray-200 mb-4">Delete Address</h2>
                {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">{error}</div>}
                <p className="text-gray-700 dark:text-gray-300">Are you sure you want to delete this address?</p>
                <div className="flex justify-end mt-6 space-x-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition-colors duration-200"
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAddressModal;