{/*
Author: Wang Jiaxuan
Note: For this component, I refer to the one on apple.com.
      You can see the prototype at: https://www.apple.com/shop/buy-iphone/iphone-16-pro
*/}
import React, { useState } from 'react';

const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? prevIndex : prevIndex + 1));
    };

    return (
        <div className="relative w-full max-w-xl mx-auto overflow-hidden rounded-3xl bg-black">
            {/* Image container with square aspect ratio and outer round corners */}
            <div className="relative w-full overflow-hidden rounded-3xl">
                {/* Image sliding area without round corners */}
                <div
                    className="flex transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {images.map((image, index) => (
                        <div key={index} className="flex-shrink-0 w-full h-full aspect-square">
                            <img
                                src={image}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Left arrow button (hidden on first image) */}
            {currentIndex > 0 && (
                <button
                    onClick={handlePrevClick}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-600 p-4 rounded-full shadow-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                        <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            )}

            {/* Right arrow button (hidden on last image) */}
            {currentIndex < images.length - 1 && (
                <button
                    onClick={handleNextClick}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-600 p-4 rounded-full shadow-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                        <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            )}

            {/* Progress indicators with semi-transparent elliptical background */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-200 bg-opacity-50 dark:bg-gray-700 dark:bg-opacity-50 px-4 py-2 rounded-full">
                <div className="flex justify-center space-x-2">
                    {images.map((_, index) => (
                        <span
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 transform ${
                                index === currentIndex
                                    ? 'bg-black scale-125 dark:bg-white'
                                    : 'bg-gray-400 scale-100 dark:bg-gray-600'
                            }`}
                        ></span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageCarousel;