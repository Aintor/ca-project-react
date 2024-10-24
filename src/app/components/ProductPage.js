import React, { useState, useEffect, useCallback } from 'react';
import ImageCarousel from "@/app/components/ImageCarousel";
import QuantitySelector from "@/app/components/QuantitySelector";
import CollapsiblePanel from "@/app/components/CollapsiblePanel";
import Comment from "@/app/components/Comment";
import RequestManager from './RequestManager'; // Import RequestManager component

const ProductPage = ({ productData, apiBaseUrl }) => {
    const [quantity, setQuantity] = useState(1);
    const [isWishlistActive, setIsWishlistActive] = useState(false);
    const [isDescriptionOpen, setDescriptionOpen] = useState(false);
    const [isReviewsOpen, setReviewsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [errorAnimateIn, setErrorAnimateIn] = useState(false);
    const [sendRequest, setSendRequest] = useState(false); // New state to control sending the request

    const { name, price, description, images, feature, reviews } = productData;

    const toggleDescriptionBar = useCallback(() => {
        setDescriptionOpen(prevState => !prevState);
    }, []);

    const toggleReviewsBar = useCallback(() => {
        setReviewsOpen(prevState => !prevState);
    }, []);

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setQuantity(value === '' ? '' : Math.max(1, parseInt(value, 10)));
        }
    };

    const handleBlur = () => {
        if (quantity === '' || parseInt(quantity) === 0) {
            setQuantity(1);
        }
    };

    const toggleWishlist = () => {
        setIsWishlistActive(prevState => !prevState);
    };

    useEffect(() => {
        if (showError) {
            setErrorAnimateIn(false);
            setTimeout(() => {
                setErrorAnimateIn(true);
            }, 10);
        }
    }, [showError]);

    // Callback to handle success from RequestManager
    const handleSuccess = () => {
        setAdded(true);
        setSendRequest(false); // Stop rendering RequestManager after the request is complete
    };

    // Callback to handle error from RequestManager
    const handleError = (errorMessage) => {
        setError(errorMessage);
        setShowError(true);
        setErrorAnimateIn(true);

        setTimeout(() => {
            setErrorAnimateIn(false);
        }, 3000);

        setTimeout(() => {
            setShowError(false);
        }, 4000);

        setSendRequest(false); // Stop rendering RequestManager after an error
    };

    // Callback to handle loading state from RequestManager
    const handleLoading = (isLoading) => {
        setLoading(isLoading);
    };

    // This function sets sendRequest to true, triggering the request
    const handleSendInfo = () => {
        setSendRequest(true); // Set state to true, triggering RequestManager rendering
    };

    return (
        <main className="flex min-h-full p-8 gap-x-8 bg-gray-100 dark:bg-gray-900">
            <section className="w-full lg:w-3/5 flex flex-col overflow-auto">
                <div className="mb-8 mt-4">
                    <ImageCarousel images={images} />
                </div>
                <div className="mb-8 mt-4 flex-grow">
                    <CollapsiblePanel title="Description" isOpen={isDescriptionOpen} toggle={toggleDescriptionBar}>
                        <p className="text-gray-600 dark:text-gray-300">{description}</p>
                    </CollapsiblePanel>
                    <CollapsiblePanel title="Customer Reviews" isOpen={isReviewsOpen} toggle={toggleReviewsBar}>
                        <ul>
                            {reviews.length === 0 ? (
                                <li className="text-gray-500">No comments available.</li>
                            ) : (
                                reviews.map((review, index) => (
                                    <Comment
                                        key={index}
                                        userName={review.userName}
                                        rating={review.rating}
                                        date={review.date}
                                        comment={review.comment}
                                    />
                                ))
                            )}
                        </ul>
                    </CollapsiblePanel>
                </div>
            </section>

            <aside
                className="w-full lg:w-2/5 h-full p-10 bg-gray-100 dark:bg-gray-800 rounded-3xl box-border shadow-lg dark:shadow-[0_0_20px_5px_rgba(0,0,0,0.5)] sticky top-20">
                <div className="mb-8 flex justify-between items-center relative">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">{name}</h1>
                    <div className="relative">
                        <button
                            className="flex items-center justify-center w-12 h-12 rounded-md text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-transform transform hover:scale-105"
                            aria-label="Like"
                            onClick={toggleWishlist}
                        >
                            <svg
                                width="24"
                                height="24"
                                fill={isWishlistActive ? 'rgb(239 68 68)' : 'currentColor'}
                                aria-hidden="true"
                            >
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 4 0 115.656 5.656L12 19.657l-8.828-8.829a4 4 0 010-5.656z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    {feature.name !== "None" && (
                        <div
                            className="inline-block px-4 py-1 bg-blue-900 text-white font-medium rounded-xl text-sm shadow-lg border-2 border-white">
                            {feature.name}
                        </div>
                    )}
                </div>

                <div className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-8">
                    <b className="text-gray-900 dark:text-gray-200">From ${price}</b>
                    {feature.name === "Promo" && (
                        <s className="text-gray-500 dark:text-gray-400 ml-2">${feature.details.originalPrice}</s>
                    )}
                </div>

                <QuantitySelector
                    quantity={quantity}
                    handleIncrement={handleIncrement}
                    handleDecrement={handleDecrement}
                    handleQuantityChange={handleQuantityChange}
                    handleBlur={handleBlur}
                    disabled={added}
                />

                {showError && (
                    <div
                        className={`absolute -bottom-20 right-4 w-64 bg-red-500/80 text-white rounded-md shadow-lg p-4 transition-transform duration-1000 transform ${
                            errorAnimateIn ? 'translate-x-0' : 'translate-x-[150%]'
                        }`}
                    >
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <div className="flex space-x-8 mt-10 text-sm font-medium relative">
                    <button
                        className={`h-14 w-1/2 font-semibold rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-300 flex items-center justify-center transition-transform transform hover:scale-105 ${added ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        onClick={handleSendInfo} // Trigger the request on button click
                        disabled={added || loading}
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-4 border-t-blue-500 dark:border-t-blue-300 border-gray-300 dark:border-gray-700 rounded-full animate-spin"></div>
                        ) : added ? 'Added' : 'Add to Cart'}
                    </button>
                </div>
            </aside>

            {/* Render RequestManager component only when sendRequest is true */}
            {sendRequest && (
                <RequestManager
                    endpoint={`/cart`}
                    method="POST"
                    options={{
                        params: {
                            amount: quantity,
                            productId: productData.id,
                        }
                    }}
                    onSuccess={handleSuccess}
                    onError={handleError}
                    onLoading={handleLoading}
                />
            )}
        </main>
    );
};

export default ProductPage;