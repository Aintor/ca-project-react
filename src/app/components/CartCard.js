import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LoadingComponent from './LoadingComponent';
import SquareImageDisplay from "@/app/components/SquareImageDisplay";
import QuantitySelector from "@/app/components/QuantitySelector";

const CartCard = ({ image = 'img/test1.jpg', feature = 'None', name = 'Product', price = '299.99', id = 12345, quantity = 1, onQuantityChange, onDelete }) => {
    const router = useRouter();
    const [isImageVisible, setIsImageVisible] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const cardRef = useRef(null);

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

    const handleImageLoad = () => {
        setIsImageLoaded(true);
    };

    const handleClick = () => {
        router.push(`/product?id=${id}`);
    };

    const handleQuantityChange = (newQuantity) => {
        onQuantityChange(id, newQuantity); // Trigger parent update
    };

    const handleDelete = (e) => {
        e.stopPropagation(); // Prevent card click
        onDelete(id); // Trigger delete action in parent
    };

    return (
        <div
            ref={cardRef}
            onClick={handleClick}
            className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg dark:shadow-[0_0_20px_5px_rgba(0,0,0,0.5)] cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-2xl dark:hover:shadow-[0_0_30px_10px_rgba(0,0,0,0.7)] flex"
        >
            {/* Left Side: Image */}
            <div className="relative w-1/4 p-4">
                {!isImageVisible && (
                    <div className="h-64"></div>
                )}

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

                        <SquareImageDisplay image={image} feature={feature}/>
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
                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-gray-200">{name}</h3>
                    <div className="mt-2">
                        <b className="text-lg font-semibold text-gray-900 dark:text-gray-200">${price}</b>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    {/* Quantity Selector */}
                    <div onClick={(e) => e.stopPropagation()}>
                        <QuantitySelector
                            quantity={quantity}
                            handleIncrement={() => handleQuantityChange(quantity + 1)}
                            handleDecrement={() => handleQuantityChange(quantity - 1)}
                            handleQuantityChange={(newQuantity) => handleQuantityChange(newQuantity)}
                            handleBlur={() => {}}
                            disabled={false}
                        />
                    </div>
                </div>

                {/* Delete Text Button in Bottom Right */}
                <button
                    onClick={handleDelete}
                    className="absolute bottom-4 right-4 text-red-200 hover:text-red-600 transition"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default CartCard;