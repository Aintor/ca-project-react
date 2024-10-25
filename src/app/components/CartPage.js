import React, { useState, useEffect, useCallback } from 'react';
import CartCard from './CartCard';
import { useRouter } from 'next/navigation';
import RequestManager from './RequestManager';
import ErrorComponent from './ErrorComponent';
import debounce from 'lodash/debounce';

const CartPage = () => {
    const [items, setItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [initialLoading, setInitialLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [initialError, setInitialError] = useState(null);
    const [updateError, setUpdateError] = useState(null);
    const [errorAnimateIn, setErrorAnimateIn] = useState(false);
    const [requestConfig, setRequestConfig] = useState(null);
    const router = useRouter();

    const fetchCart = useCallback(() => {
        setRequestConfig({
            endpoint: '/cart',
            method: 'GET',
            onSuccess: (data) => {
                if (data.success) {
                    setItems(data.items);
                    setInitialLoading(false);
                } else {
                    setInitialError('Failed to load cart items.');
                    setInitialLoading(false);
                }
                setRequestConfig(null); // Clear RequestManager configuration after success
            },
            onError: () => {
                setInitialError('Failed to load cart items.');
                setInitialLoading(false);
                setRequestConfig(null); // Clear RequestManager configuration after error
            },
            onLoading: (isLoading) => setInitialLoading(isLoading),
        });
    }, []);

    const debouncedFetchCart = useCallback(debounce(fetchCart, 500), [fetchCart]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    useEffect(() => {
        const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        setTotalPrice(total);
    }, [items]);

    const handleQuantityChange = (id, newQuantity) => {
        setUpdateLoading(true);
        setRequestConfig({
            endpoint: `/cart/${id}`,
            method: 'PUT',
            options: {
                params: { amount: newQuantity },
            },
            onSuccess: () => {
                debouncedFetchCart();
                setUpdateLoading(false);
                setRequestConfig(null); // Clear RequestManager configuration after success
            },
            onError: (errorMessage) => {
                setUpdateLoading(false);
                setUpdateError(errorMessage || 'Failed to update cart item.');
                setErrorAnimateIn(true);
                setTimeout(() => setErrorAnimateIn(false), 4000);
                setRequestConfig(null); // Clear RequestManager configuration after error
            },
            onLoading: (isLoading) => setUpdateLoading(isLoading),
        });
    };

    const handleDelete = (id) => {
        setUpdateLoading(true);
        setRequestConfig({
            endpoint: `/cart/${id}`,
            method: 'DELETE',
            onSuccess: () => {
                debouncedFetchCart();
                setUpdateLoading(false);
                setRequestConfig(null); // Clear RequestManager configuration after success
            },
            onError: (errorMessage) => {
                setUpdateLoading(false);
                setUpdateError(errorMessage || 'Failed to remove cart item.');
                setErrorAnimateIn(true);
                setTimeout(() => setErrorAnimateIn(false), 4000);
                setRequestConfig(null); // Clear RequestManager configuration after error
            },
            onLoading: (isLoading) => setUpdateLoading(isLoading),
        });
    };

    const handleCheckout = () => {
        // Checkout logic without login status check
        router.push('/checkout');
    };

    if (initialError) {
        return <ErrorComponent message={initialError} />;
    }

    return (
        <main className="flex min-h-screen p-8 gap-x-8 bg-gray-100 dark:bg-gray-900">
            <section className="w-full lg:w-3/5 flex flex-col gap-y-4 overflow-auto relative min-h-screen overflow-visible">
                {initialLoading ? (
                    <p>Loading cart items...</p>
                ) : items.length > 0 ? (
                    items.map((item) => (
                        <CartCard
                            key={item.id}
                            image={item.product.image[0]}
                            feature={item.product.feature}
                            name={item.product.name}
                            price={item.product.price}
                            quantity={item.quantity}
                            onQuantityChange={handleQuantityChange}
                            onDelete={handleDelete}
                            id={item.product.id}
                            disabled={updateLoading} // Disable actions during update
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-600 dark:text-gray-300">Your cart is empty.</p>
                )}
                {updateLoading && <p>Updating cart...</p>}
            </section>

            <aside className="w-full lg:w-2/5 h-full p-10 bg-gray-100 dark:bg-gray-800 rounded-3xl box-border shadow-lg dark:shadow-[0_0_20px_5px_rgba(0,0,0,0.5)] sticky top-20">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-8">Order Summary</h2>

                <div className="flex justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">Total Price:</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-200">${totalPrice.toFixed(2)}</span>
                </div>

                <button
                    className={`h-14 w-1/2 font-semibold rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-300 flex items-center justify-center transition-transform transform hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700`}
                    onClick={handleCheckout}
                >
                    Proceed to Checkout
                </button>
            </aside>

            {/* Error message in floating right-bottom corner */}
            <div
                className={`fixed bottom-20 right-4 w-64 bg-red-500/60 text-gray-800 dark:text-white rounded-md shadow-lg p-4 transition-transform duration-500 transform ${
                    errorAnimateIn ? 'translate-x-0' : 'translate-x-[150%]'
                }`}
            >
                <p className="text-sm">{updateError}</p>
            </div>

            {requestConfig && (
                <RequestManager
                    endpoint={requestConfig.endpoint}
                    method={requestConfig.method}
                    options={requestConfig.options}
                    onSuccess={requestConfig.onSuccess}
                    onError={requestConfig.onError}
                    onLoading={requestConfig.onLoading}
                />
            )}
        </main>
    );
};

export default CartPage;