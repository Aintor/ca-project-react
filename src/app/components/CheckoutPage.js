import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LoadingComponent from './LoadingComponent';

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

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Fetch addresses on mount
    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiBaseUrl}/addresses`, {
                timeout: 10000,
                withCredentials: true,
            });
            const data = response.data;
            if (data && (typeof data.success === 'undefined' || data.success)) {
                setAddresses(data);
            } else {
                throw new Error(data.message || 'Failed to fetch addresses.');
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
        } finally {
            setLoading(false);
        }
    };

    const handleAddressSelect = (addressId) => {
        setSelectedAddressId(addressId);
    };

    const handleInputChange = (e) => {
        setCreditCardDetails({
            ...creditCardDetails,
            [e.target.name]: e.target.value,
        });
    };

    const validateCreditCard = () => {
        const errors = {};
        const { cardNumber, expiryDate, cvv, cardHolderName } = creditCardDetails;

        // Simple validation rules
        if (!cardHolderName) errors.cardHolderName = 'Card holder name is required.';
        if (!cardNumber || !/^\d{16}$/.test(cardNumber)) errors.cardNumber = 'Invalid card number.';
        if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) errors.expiryDate = 'Invalid expiry date.';
        if (!cvv || !/^\d{3}$/.test(cvv)) errors.cvv = 'Invalid CVV.';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCheckout = async () => {
        if (!selectedAddressId) {
            setErrorMessage('Please select an address.');
            return;
        }

        if (!validateCreditCard()) {
            setErrorMessage('Please correct the errors in the payment form.');
            return;
        }

        setErrorMessage('');
        setLoading(true);

        try {
            const response = await axios.post(
                `${apiBaseUrl}/cart/checkout`,
                {
                    addressId: selectedAddressId,
                    ...creditCardDetails, // Assuming you need to send credit card details
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
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingComponent />;
    }

    if (checkoutSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 dark:bg-gray-900">
                <div className="bg-gray-800 dark:bg-gray-800 p-8 rounded-2xl shadow-lg dark:shadow-[0_0_20px_5px_rgba(0,0,0,0.5)]">
                    <h1 className="text-3xl font-sans font-extrabold text-gray-100 mb-4">
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
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 dark:bg-gray-900 p-6 lg:p-8 gap-x-8">
            {/* Left Column - Address Selection */}
            <section className="w-full lg:w-2/3 bg-transparent p-4 rounded-2xl shadow-none overflow-y-auto max-h-screen">
                <h2 className="text-2xl font-sans font-bold text-gray-200 mb-4">
                    Select Shipping Address
                </h2>
                {errorMessage && (
                    <div className="mb-4 text-red-500 font-semibold">
                        {errorMessage}
                    </div>
                )}
                {addresses.length === 0 ? (
                    <p className="text-gray-300">No addresses found. Please add one.</p>
                ) : (
                    <div className="space-y-4">
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className={`p-4 rounded-2xl border ${
                                    selectedAddressId === address.id
                                        ? 'border-gray-500 bg-gray-700'
                                        : 'border-gray-600 bg-gray-800'
                                } cursor-pointer transition-transform duration-300 hover:scale-105 hover:bg-gray-700`}
                                onClick={() => handleAddressSelect(address.id)}
                            >
                                <p className="text-lg font-sans font-semibold text-gray-100">
                                    {address.street}, {address.city}, {address.state}, {address.country}, {address.zipCode}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
                {/* Add new address button could be added here */}
            </section>

            {/* Right Column - Credit Card Validation */}
            <aside className="w-full lg:w-1/3 bg-gray-800 dark:bg-gray-800 p-6 rounded-2xl shadow-md dark:shadow-[0_0_20px_5px_rgba(0,0,0,0.5)]">
                <h2 className="text-2xl font-sans font-bold text-gray-200 mb-4">
                    Payment Method
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-300 font-semibold mb-2">
                            Card Holder Name
                        </label>
                        <input
                            type="text"
                            name="cardHolderName"
                            value={creditCardDetails.cardHolderName}
                            onChange={handleInputChange}
                            className={`w-full p-2 rounded-2xl border ${
                                validationErrors.cardHolderName ? 'border-red-500' : 'border-gray-600'
                            } bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500`}
                        />
                        {validationErrors.cardHolderName && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.cardHolderName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-300 font-semibold mb-2">
                            Card Number
                        </label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={creditCardDetails.cardNumber}
                            onChange={handleInputChange}
                            className={`w-full p-2 rounded-2xl border ${
                                validationErrors.cardNumber ? 'border-red-500' : 'border-gray-600'
                            } bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500`}
                            placeholder="1234567812345678"
                        />
                        {validationErrors.cardNumber && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.cardNumber}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-300 font-semibold mb-2">
                                Expiry Date (MM/YY)
                            </label>
                            <input
                                type="text"
                                name="expiryDate"
                                value={creditCardDetails.expiryDate}
                                onChange={handleInputChange}
                                className={`w-full p-2 rounded-2xl border ${
                                    validationErrors.expiryDate ? 'border-red-500' : 'border-gray-600'
                                } bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500`}
                                placeholder="MM/YY"
                            />
                            {validationErrors.expiryDate && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.expiryDate}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-300 font-semibold mb-2">
                                CVV
                            </label>
                            <input
                                type="password"
                                name="cvv"
                                value={creditCardDetails.cvv}
                                onChange={handleInputChange}
                                className={`w-full p-2 rounded-2xl border ${
                                    validationErrors.cvv ? 'border-red-500' : 'border-gray-600'
                                } bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500`}
                                placeholder="123"
                            />
                            {validationErrors.cvv && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.cvv}</p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-2xl transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Place Order
                    </button>
                </div>
            </aside>

            {/* Error message in floating right-bottom corner */}
            <div
                className={`fixed bottom-20 right-4 w-64 bg-red-500/60 text-gray-800 dark:text-white rounded-md shadow-lg p-4 transition-transform duration-500 transform ${
                    errorMessage ? 'translate-x-0' : 'translate-x-[150%]'
                }`}
            >
                <p className="text-sm">{errorMessage}</p>
            </div>
        </div>
    );
};

export default CheckoutComponent;