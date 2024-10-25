"use client";
{/*
Author: Wang Jiaxuan
*/}
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import ProductPage from '../components/ProductPage';
import ErrorComponent from '../components/ErrorComponent';
import LoadingComponent from '../components/LoadingComponent';
import RequestManager from '../components/RequestManager';

function App() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Callback function to handle successful data retrieval
    const handleSuccess = (data) => {
        setProductData(data);  // Store the retrieved product data
        setError(null);        // Clear any previous errors
    };

    // Callback function to handle errors
    const handleError = (errorMessage) => {
        setError(errorMessage); // Update the error state with the message
        setProductData(null);   // Clear the product data
    };

    // Callback function to update the loading state
    const handleLoading = (isLoading) => {
        setLoading(isLoading); // Update the loading state
    };

    // If there is no valid id, directly display an error
    if (!id) {
        return (
            <div>
                <Navbar/>
                <div style={{ marginTop: '4rem' }}>
                    <ErrorComponent message="Invalid Product ID" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div style={{ marginTop: '4rem' }}>
                {/* Use the RequestManager to initiate the request */}
                <RequestManager
                    endpoint={`/products/${id}`}
                    method="GET"
                    onSuccess={handleSuccess}
                    onError={handleError}
                    onLoading={handleLoading}
                />

                {/* Conditionally render based on the loading, error, and data state */}
                {loading && <LoadingComponent />}
                {error && <ErrorComponent message={error} />}
                {productData && <ProductPage productData={productData} />}
            </div>
        </div>
    );
}

export default App;