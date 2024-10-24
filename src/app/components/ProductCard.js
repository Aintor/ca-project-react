{/*
Author: Wang Jiaxuan
*/}
// Using Lazy Loading to Reduce Server Load
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LoadingComponent from './LoadingComponent';
import SquareImageDisplay from "@/app/components/SquareImageDisplay";

const ProductCard = ({ image, feature, name, price, id, originPrice }) => {
    const router = useRouter();
    const [isImageVisible, setIsImageVisible] = useState(false); // Detects if card is in the viewport
    const [isImageLoaded, setIsImageLoaded] = useState(false);   // Tracks if image has loaded
    const cardRef = useRef(null);

    // Use IntersectionObserver to detect when the card enters the viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsImageVisible(true);  // Trigger image loading
                        observer.disconnect();    // Stop observing once it's visible
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
        setIsImageLoaded(true);  // Once image is loaded, hide loading spinner
    };

    const handleClick = () => {
        router.push(`/product?id=${id}`);
    };

    return (
        <div
            ref={cardRef}
            onClick={handleClick}
            className="relative w-full max-w-xs mx-auto rounded-2xl overflow-hidden shadow-lg dark:shadow-[0_0_20px_5px_rgba(0,0,0,0.5)] cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-2xl dark:hover:shadow-[0_0_30px_10px_rgba(0,0,0,0.7)]"
        >
            {/* Image loading placeholder */}
            <div className="relative p-4">
                {!isImageVisible && (
                    // Before the card is in viewport, reserve space
                    <div className="h-64"></div>
                )}

                {isImageVisible && !isImageLoaded && (
                    // Show loading component immediately when the card becomes visible
                    <div className="h-64 flex items-center justify-center">
                        <LoadingComponent />
                    </div>
                )}

                {isImageVisible && isImageLoaded && (
                    // Show overlay and square component after image has loaded
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

                {/* Preload the image */}
                {isImageVisible && (
                    <img
                        src={image}
                        alt={name}
                        style={{ display: 'none' }} // Hidden image to trigger load
                        onLoad={handleImageLoad}
                    />
                )}
            </div>

            {/* Display product information immediately */}
            <div className="relative p-4 bg-white dark:bg-gray-800 rounded-b-2xl">
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-gray-200">{name}</h3>

                <div className="mt-2">
                    <b className="text-lg font-semibold text-gray-900 dark:text-gray-200">${price}</b>
                    {feature === "Promo" && (
                        <s className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            ${originPrice}
                        </s>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;