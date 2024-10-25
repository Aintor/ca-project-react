import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingComponent from './LoadingComponent';
import AddAddressModal from './Modals/AddAddressModal';
import EditAddressModal from './Modals/EditAddressModal';
import DeleteAddressModal from './Modals/DeleteAddressModal';

const AddressManagement = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Fetch addresses on mount
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/addresses`, {
                    withCredentials: true,
                });
                if (response.data.success || Array.isArray(response.data)) {
                    setAddresses(response.data);
                } else {
                    setError(response.data.message || 'Failed to fetch addresses.');
                }
            } catch (err) {
                console.error('Error fetching addresses:', err);
                setError('An error occurred while fetching addresses.');
            } finally {
                setLoading(false);
            }
        };

        fetchAddresses();
    }, [apiBaseUrl]);

    const handleAddAddress = (newAddress) => {
        setAddresses([...addresses, newAddress]);
    };

    const handleUpdateAddress = (updatedAddress) => {
        setAddresses(addresses.map(addr => addr.id === updatedAddress.id ? updatedAddress : addr));
    };

    const handleDeleteAddress = (deletedAddressId) => {
        setAddresses(addresses.filter(addr => addr.id !== deletedAddressId));
    };

    if (loading) {
        return <LoadingComponent />;
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Address Management</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="
                        bg-green-600 hover:bg-green-500
                        text-white font-semibold py-2 px-4 rounded-md
                        transition-colors duration-200
                    "
                >
                    Add New Address
                </button>
            </div>
            {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}
            {addresses.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No addresses found. Please add one.</p>
            ) : (
                <ul className="space-y-4">
                    {addresses.map(address => (
                        <li key={address.id} className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-800 dark:text-gray-200">{address.street}, {address.city}, {address.state}, {address.country}, {address.zipCode}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedAddress(address);
                                            setShowEditModal(true);
                                        }}
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedAddress(address);
                                            setShowDeleteModal(true);
                                        }}
                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Add Address Modal */}
            {showAddModal && (
                <AddAddressModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={handleAddAddress}
                />
            )}

            {/* Edit Address Modal */}
            {showEditModal && selectedAddress && (
                <EditAddressModal
                    address={selectedAddress}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={handleUpdateAddress}
                />
            )}

            {/* Delete Address Modal */}
            {showDeleteModal && selectedAddress && (
                <DeleteAddressModal
                    address={selectedAddress}
                    onClose={() => setShowDeleteModal(false)}
                    onDelete={handleDeleteAddress}
                />
            )}
        </div>
    );
};

export default AddressManagement;