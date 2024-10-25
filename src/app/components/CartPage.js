import React, { useState, useEffect, useCallback } from 'react';
import CartCard from './CartCard'; // Assume CartCard is already implemented
import { useAuth } from '@/app/layout';

const CartPage = ({ cartItems }) => {
    const [items, setItems] = useState(cartItems); // Initialize with cart items
    const [totalPrice, setTotalPrice] = useState(0);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        // Calculate total price whenever the cart items change
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(total);
    }, [items]);

    const handleQuantityChange = (id, newQuantity) => {
        // Update item quantity
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleDelete = (id) => {
        // Remove the item from the cart
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const handleCheckout = () => {
        if (isAuthenticated) {
            // Perform checkout logic
            console.log('Proceeding to checkout...');
        } else {
            alert('Please log in to proceed with checkout.');
        }
    };

    return (
        <main className="flex min-h-full p-8 gap-x-8 bg-gray-100 dark:bg-gray-900">
            {/* Left Side: Cart Cards */}
            <section className="w-full lg:w-3/5 flex flex-col gap-y-4 overflow-auto">
                {items.length > 0 ? (
                    items.map((item) => (
                        <CartCard
                            key={item.id}
                            image={item.image}
                            name={item.name}
                            price={item.price}
                            quantity={item.quantity}
                            onQuantityChange={handleQuantityChange}
                            onDelete={handleDelete}
                            id={item.id}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-600 dark:text-gray-300">Your cart is empty.</p>
                )}
            </section>

            {/* Right Side: Summary & Checkout */}
            <aside className="w-full lg:w-2/5 h-full p-10 bg-gray-100 dark:bg-gray-800 rounded-3xl box-border shadow-lg dark:shadow-[0_0_20px_5px_rgba(0,0,0,0.5)] sticky top-20">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-8">Order Summary</h2>

                <div className="flex justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">Total Price:</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-200">${totalPrice.toFixed(2)}</span>
                </div>

                <button
                    className="mt-8 w-full h-14 font-semibold rounded-md bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-transform transform hover:scale-105"
                    onClick={handleCheckout}
                >
                    Proceed to Checkout
                </button>
            </aside>
        </main>
    );
};

export default CartPage;