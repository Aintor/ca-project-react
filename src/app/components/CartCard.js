import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LoadingComponent from './LoadingComponent';
import SquareImageDisplay from "@/app/components/SquareImageDisplay";
import QuantitySelector from './QuantitySelector'; // Assume you have created the QuantitySelector component

const CartCard = ({
                      image = 'img/test1.jpg',
                      feature = 'None',
                      name = 'Product',
                      price = '299.99',
                      id = 12345,
                      quantity = 1,
                      onCartChange // Function passed from parent component to handle cart changes
                  }) => {
    const router = useRouter();
    const [isImageVisible, setIsImageVisible] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const cardRef = useRef(null);

    // Use IntersectionObserver to detect when the card enters the viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsImageVisible(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: "300px",
                threshold: 0
            }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, []);

    // Handle image load event
    const handleImageLoad = () => {
        setIsImageLoaded(true);
    };

    // Handle quantity increment
    const handleQuantityIncrement = () => {
        onCartChange(id, quantity + 1);
    };

    // Handle quantity decrement
    const handleQuantityDecrement = () => {
        if (quantity > 1) {
            onCartChange(id, quantity - 1);
        }
    };

    // Handle direct quantity change
    const handleQuantityChange = (newQuantity) => {
        if (newQuantity > 0) {
            onCartChange(id, newQuantity);
        }
    };

    // Handle input blur event
    const handleBlur = () => {
        onCartChange(id, quantity);
    };

    // Handle product deletion
    const handleDelete = () => {
        onCartChange(id, 0); // Setting quantity to 0 indicates removal of the product
    };

    return (
        <div
            ref={cardRef}
            className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg dark:shadow-[0_0_20px_5px_rgba(0,0,0,0.5)] transition-transform duration-300 flex"
        >
            {/* Left Side: Image */}
            <div className="relative w-1/4 p-4">
                {!isImageVisible && <div className="h-64"></div>}
                {isImageVisible && !isImageLoaded && (
                    <div className="h-64 flex items-center justify-center">
                        <LoadingComponent />
                    </div>
                )}

                {isImageVisible && isImageLoaded && (
                    <>
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${image})` }}
                        >
                            <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-lg"></div>
                        </div>
                        <SquareImageDisplay image={image} feature={feature} />
                    </>
                )}

                {isImageVisible && (
                    <img
                        src={image}
                        alt={name}
                        style={{ display: 'none' }}
                        onLoad={handleImageLoad}
                    />
                )}
            </div>

            {/* Right Side: Product Information */}
            <div className="relative w-3/4 p-4 bg-white dark:bg-gray-800 rounded-r-2xl flex flex-col justify-between">
                <div>
                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-gray-200">
                        {name}
                    </h3>
                    <div className="mt-2">
                        <b className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                            ${price}
                        </b>
                    </div>
                </div>

                {/* Quantity Selector and Delete Button */}
                <div className="mt-4 flex items-center justify-between">
                    <QuantitySelector
                        quantity={quantity}
                        handleIncrement={handleQuantityIncrement}
                        handleDecrement={handleQuantityDecrement}
                        handleQuantityChange={handleQuantityChange}
                        handleBlur={handleBlur}
                    />
                </div>

                {/* Delete button as text at the bottom right */}
                <button
                    onClick={handleDelete}
                    className="absolute bottom-4 right-4 text-sm text-red-500 hover:underline"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default CartCard;