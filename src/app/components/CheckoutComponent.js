{/*
Author: Wang Jiaxuan
*/}
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LoadingComponent from './LoadingComponent';
import AddressModal from './AddressModal';
import ErrorComponent from './ErrorComponent';
import valid from 'card-validator';

const CheckoutComponent = () => {
    const router = useRouter();
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [creditCardDetails, setCreditCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolderName: '',
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cartLoading, setCartLoading] = useState(true); // Loading state for cart data
    const [cartItems, setCartItems] = useState([]); // Cart items state
    const [cartError, setCartError] = useState(false); // Error when no cart items
    const [addressUpdateState, setAddressUpdateState] = useState(true);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Fetch cart data on component mount
    useEffect(() => {
        fetchCartData();
    }, []);

    // Fetch cart items
    const fetchCartData = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/cart`, {
                timeout: 10000,
                withCredentials: true,
            });
            const data = response.data;

            if (data.success) {
                setCartItems(data.items);
                if (data.items.length === 0) {
                    // Show error and start redirection after 5 seconds
                    setCartError(true);
                    setTimeout(() => {
                        router.push('/');
                    }, 5000);
                }
            } else {
                setErrorMessage(data.message || 'Failed to fetch cart items.');
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            let message = 'Failed to load cart. Please try again.';
            if (error.code === 'ECONNABORTED') {
                message = 'The request timed out.';
            } else if (error.response) {
                message = `Server error (${error.response.status}): ${error.response.data.message || 'Please contact support.'}`;
            } else if (error.request) {
                message = 'Network error: Unable to reach the server. Please check your connection.';
            }
            setErrorMessage(message);
        } finally {
            setCartLoading(false); // Set cart loading state to false after fetch
        }
    };

    // Fetch addresses on component mount (only if cart has items)
    useEffect(() => {
        if (cartItems.length > 0 && addressUpdateState) {
            fetchAddresses();
            setAddressUpdateState(false);
        }
    }, [cartItems, addressUpdateState]);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiBaseUrl}/addresses`, {
                timeout: 10000,
                withCredentials: true,
            });

            const data = response.data;

            if (Array.isArray(data)) {
                setAddresses(data);
                if (data.length > 0) {
                    setSelectedAddressId(data[0].id); // Automatically select the first address if available
                }
            } else {
                throw new Error('Unexpected response format. Expected an array of addresses.');
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);

            let message = 'Failed to load addresses. Please try again.';

            if (error.code === 'ECONNABORTED') {
                message = 'The request timed out.';
            } else if (error.response) {
                message = `Server error (${error.response.status}): ${error.response.data.message || 'Please contact support.'}`;
            } else if (error.request) {
                message = 'Network error: Unable to reach the server. Please check your connection.';
            }

            setErrorMessage(message);
            triggerErrorAnimation();
        } finally {
            setLoading(false);
        }
    };

    const handleAddressSelect = (addressId) => {
        setSelectedAddressId(addressId);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value;

        if (name === 'expiryDate') {
            updatedValue = value.replace(/[^\d]/g, '');
            if (updatedValue.length > 2) {
                updatedValue = `${updatedValue.slice(0, 2)}/${updatedValue.slice(2, 4)}`;
            }
        }

        setCreditCardDetails({
            ...creditCardDetails,
            [name]: updatedValue,
        });
    };

    const validateCreditCard = () => {
        const errors = {};
        const { cardNumber, expiryDate, cvv, cardHolderName } = creditCardDetails;

        const cardValidation = valid.number(cardNumber);
        if (!cardValidation.isValid) {
            errors.cardNumber = 'Invalid card number.';
        }

        const expiryValidation = valid.expirationDate(expiryDate);
        if (!expiryValidation.isValid) {
            errors.expiryDate = 'Invalid expiry date.';
        }

        const cvvValidation = valid.cvv(cvv, cardValidation.card ? cardValidation.card.code.size : undefined);
        if (!cvvValidation.isValid) {
            errors.cvv = 'Invalid CVV.';
        }

        if (!cardHolderName.trim()) {
            errors.cardHolderName = 'Card holder name is required.';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCheckout = async () => {
        if (!selectedAddressId) {
            setErrorMessage('Please select an address.');
            triggerErrorAnimation();
            return;
        }

        if (!validateCreditCard()) {
            setErrorMessage('Please correct the errors in the payment form.');
            triggerErrorAnimation();
            return;
        }

        setErrorMessage('');
        setLoading(true);

        try {
            const response = await axios.post(
                `${apiBaseUrl}/cart/checkout?addressId=${selectedAddressId}`,
                {
                    ...creditCardDetails,
                },
                {
                    timeout: 10000,
                    withCredentials: true,
                }
            );

            const data = response.data;
            if (data.success) {
                setCheckoutSuccess(true);
            } else {
                setErrorMessage(data.message || 'Checkout failed. Please try again.');
                triggerErrorAnimation();
            }
        } catch (error) {
            console.error('Checkout error:', error);
            let message = 'Checkout failed. Please try again.';
            if (error.code === 'ECONNABORTED') {
                message = 'The request timed out.';
            } else if (error.response) {
                message = `Server error (${error.response.status}): ${error.response.data.message || 'Please contact support.'}`;
            } else if (error.request) {
                message = 'Network error: Unable to reach the server. Please check your connection.';
            }
            setErrorMessage(message);
            triggerErrorAnimation();
        } finally {
            setLoading(false);
        }
    };

    const handleAddressAdded = (newAddress) => {
        setAddresses([newAddress, ...addresses]);
        setSelectedAddressId(newAddress.id);
    };

    const handleDeleteAddress = async (addressId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this address?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`${apiBaseUrl}/addresses?addressId=${addressId}`, {
                timeout: 10000,
                withCredentials: true,
            });
            setAddresses(addresses.filter(address => address.id !== addressId));
            if (selectedAddressId === addressId) {
                setSelectedAddressId(addresses.length > 1 ? addresses[0].id : null);
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            let message = 'Failed to delete address. Please try again.';
            if (error.code === 'ECONNABORTED') {
                message = 'The request timed out.';
            } else if (error.response) {
                message = `Server error (${error.response.status}): ${error.response.data.message || 'Please contact support.'}`;
            } else if (error.request) {
                message = 'Network error: Unable to reach the server. Please check your connection.';
            }
            setErrorMessage(message);
            triggerErrorAnimation();
        }
    };

    if (cartLoading || loading) {
        return <LoadingComponent />;
    }

    if (cartError) {
        // Display error message when cart is empty
        return (
            <ErrorComponent message="Your cart is empty. Redirecting to homepage in 5 seconds..." />
        );
    }

    if (checkoutSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
                <div className="bg-gray-800 p-8 rounded-2xl shadow-lg">
                    <h1 className="text-3xl font-extrabold text-gray-100 mb-4">
                        Payment Successful!
                    </h1>
                    <p className="text-lg text-gray-300 mb-6">
                        Thank you for your purchase.
                    </p>
                    <button
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-2xl transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        onClick={() => router.push('/')}
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-gray-900 p-6 lg:p-8 gap-x-8 relative">
            {/* Address Selection Section */}
            <section
                className="w-full lg:w-2/3 bg-transparent p-4 rounded-2xl shadow-none overflow-y-auto max-h-screen">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Select Shipping Address
                </h2>
                {errorMessage && (
                    <div className="mb-4 text-red-500 dark:text-red-400 font-semibold">
                        {errorMessage}
                    </div>
                )}
                {addresses.length === 0 ? (
                    <div
                        className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-600 dark:border-gray-500 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-300 backdrop-filter backdrop-blur-md bg-gray-50 dark:bg-gray-800"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <span className="text-gray-400 dark:text-gray-300 text-4xl">+</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {/* Add New Address Button at the Top */}
                        <div
                            className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 dark:border-gray-500 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-300 backdrop-filter backdrop-blur-md bg-gray-50 dark:bg-gray-800"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <span className="text-gray-400 dark:text-gray-300 text-3xl">+</span>
                        </div>

                        {/* Existing Addresses */}
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className={`relative p-4 rounded-2xl border min-h-[100px] ${
                                    selectedAddressId === address.id
                                        ? 'border-blue-500 bg-gray-100 dark:bg-gray-700'
                                        : 'border-gray-600 dark:border-gray-500 bg-gray-50 dark:bg-gray-800'
                                } cursor-pointer transition-transform duration-300 hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700`}
                                onClick={() => handleAddressSelect(address.id)}
                            >
                                {/* Delete Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteAddress(address.id);
                                    }}
                                    className="
                                                absolute top-2 right-2
                                                text-gray-400 dark:text-gray-500
                                                hover:text-red-500 dark:hover:text-red-400
                                                transition-transform duration-300
                                                transform hover:rotate-90
                                                focus:outline-none
                                              "
                                    aria-label="Delete Address"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>

                                {/* Address Details */}
                                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                    {address.street}, {address.city}, {address.state}, {address.country}, {address.zipCode}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Payment Method Sidebar */}
            <aside
                className="
        w-full lg:w-1/3 h-full p-10
        bg-gray-200 bg-opacity-30
        backdrop-filter backdrop-blur-lg
        rounded-3xl box-border shadow-lg
        sticky top-20
        dark:bg-gray-800 dark:bg-opacity-50 dark:backdrop-blur-md
    "
            >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Payment Method
                </h2>
                <div className="space-y-4">
                    {/* Card Holder Name */}
                    <div>
                        <label className="block text-gray-500 dark:text-gray-300 font-semibold mb-2">
                            Card Holder Name
                        </label>
                        <input
                            type="text"
                            name="cardHolderName"
                            value={creditCardDetails.cardHolderName}
                            onChange={handleInputChange}
                            className={`w-full p-2 rounded-2xl border ${
                                validationErrors.cardHolderName ? 'border-red-500 dark:border-red-400' : 'border-gray-600 dark:border-gray-500'
                            } text-gray-500 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400`}
                        />
                        {validationErrors.cardHolderName && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{validationErrors.cardHolderName}</p>
                        )}
                    </div>

                    {/* Card Number */}
                    <div>
                        <label className="block text-gray-500 dark:text-gray-300 font-semibold mb-2">
                            Card Number
                        </label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={creditCardDetails.cardNumber}
                            onChange={handleInputChange}
                            className={`w-full p-2 rounded-2xl border ${
                                validationErrors.cardNumber ? 'border-red-500 dark:border-red-400' : 'border-gray-600 dark:border-gray-500'
                            } text-gray-500 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400`}
                            placeholder="1234 5678 1234 5678"
                            maxLength="19"
                        />
                        {validationErrors.cardNumber && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{validationErrors.cardNumber}</p>
                        )}
                    </div>

                    {/* Expiry Date and CVV */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Expiry Date */}
                        <div className="flex flex-col">
                            <label className="block text-gray-500 dark:text-gray-300 font-semibold mb-2">
                                Expiry Date
                            </label>
                            <input
                                type="text"
                                name="expiryDate"
                                value={creditCardDetails.expiryDate}
                                onChange={handleInputChange}
                                className={`w-full p-2 rounded-2xl border ${
                                    validationErrors.expiryDate ? 'border-red-500 dark:border-red-400' : 'border-gray-600 dark:border-gray-500'
                                } text-gray-500 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400`}
                                placeholder="MM/YY"
                                maxLength="5"
                            />
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1 min-h-[1.25rem]">
                                {validationErrors.expiryDate || ''}
                            </p>
                        </div>

                        {/* CVV */}
                        <div className="flex flex-col">
                            <label className="block text-gray-500 dark:text-gray-300 font-semibold mb-2">
                                CVV
                            </label>
                            <input
                                type="password"
                                name="cvv"
                                value={creditCardDetails.cvv}
                                onChange={handleInputChange}
                                className={`w-full p-2 rounded-2xl border ${
                                    validationErrors.cvv ? 'border-red-500 dark:border-red-400' : 'border-gray-600 dark:border-gray-500'
                                } text-gray-500 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400`}
                                placeholder="123"
                                maxLength="4"
                            />
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1 min-h-[1.25rem]">
                                {validationErrors.cvv || ''}
                            </p>
                        </div>
                    </div>

                    {/* Place Order Button */}
                    <button
                        onClick={handleCheckout}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-2xl transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                        Place Order
                    </button>
                </div>
            </aside>

            {/* Address Modal */}
            <AddressModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setAddressUpdateState(true);
                }}
            />
        </div>
    );

};

export default CheckoutComponent;