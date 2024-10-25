"use client";
{/*
Author: Wang Jiaxuan
*/}
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductGrid from '@/app/components/ProductGrid';
import Navbar from "@/app/components/Navbar";
import ErrorComponent from "@/app/components/ErrorComponent";
import LoadingComponent from "@/app/components/LoadingComponent";
import RequestManager from "@/app/components/RequestManager";

const App = () => {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('categoryId');
    const keyword = searchParams.get('search');
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [products, setProducts] = useState([]);

    // Handle redirection error for invalid combination of categoryId and keyword
    if (categoryId && keyword) {
        setTimeout(() => {
            router.push('/')
        }, 5000);
        return (
            <div>
                {/* Display Navbar */}
                <Navbar />

                {/* Error message and redirection notification */}
                <div style={{ marginTop: '4rem' }}>
                    <ErrorComponent message="Function not implemented. Redirecting to homepage in 5 seconds..." straight={true} />
                </div>
            </div>
        );
    }

    // Determine the correct API endpoint based on categoryId and keyword
    let endpoint = '';
    let method = 'GET'; // Default method is GET

    if (keyword) {
        endpoint = '/products/name/' + keyword;
    } else {
        if (categoryId === null) {
            method = 'POST';
            endpoint = '/products';
        } else if (1 <= categoryId && categoryId <= 5) {
            endpoint = `/products/${categoryId}`; // Fetch products by category
        } else {
            router.push('/not-found');
        }
    }

    // Function to return category title based on categoryId
    const getTitle = () => {
        if (!keyword) {
            switch (categoryId) {
                case '1':
                    return "Food & Beverages";
                case '2':
                    return "Electronics Collection";
                case '3':
                    return "Home & Living Collection";
                case '4':
                    return "Clothing & Accessories Collection";
                case '5':
                    return "Beauty & Health Collection";
                default:
                    return "All Products"; // Default title if no categoryId is provided
            }
        } else {
            return `Search Results for "${keyword}"`;
        }
    };

    // Function to return a tagline based on categoryId
    const getTagline = () => {
        switch (categoryId) {
            case '1':
                return "Savor the finest flavors and elevate your dining experience.";
            case '2':
                return "Discover cutting-edge technology to enhance your lifestyle.";
            case '3':
                return "Create a cozy, stylish, and functional living space.";
            case '4':
                return "Stay fashionable with the latest trends and timeless pieces.";
            case '5':
                return "Nurture your mind, body, and soul with our wellness picks.";
            default:
                return "Find everything you need, all in one place."; // Default tagline
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ marginTop: '4rem' }}>

                {/* Conditionally render the RequestManager to handle API requests */}
                <RequestManager
                    endpoint={endpoint}
                    method={method}
                    onSuccess={(result) => {
                        setProducts(result);
                    }}
                    onError={(errorMessage) => {
                        setError(errorMessage);  // Handle error message
                    }}
                    onLoading={(isLoading) => {
                        setLoading(isLoading);  // Handle loading state
                    }}
                />

                {/* Product Grid */}
                {!loading && !error && products.length > 0 && (
                    <div>
                        <br/>
                        {/* Category Title */}
                        <h1 className="text-3xl font-bold my-4 ml-6 text-left">{getTitle()}</h1>
                        {/* Tagline for the category */}
                        <h2 className="text-lg font-medium text-gray-600 ml-6 text-left mb-8">{getTagline()}</h2>
                        <ProductGrid products={products} />
                    </div>
                )}

                {/* Error handling */}
                {error && (
                    <ErrorComponent message={error} />
                )}

                {/* Loading state */}
                {loading && (
                    <LoadingComponent />
                )}
            </div>
        </div>
    );
};

export default App;