"use client";
{/*
Author: Wang Jiaxuan
*/
}
import React from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/app/components/ProductGrid';
import Navbar from "@/app/components/Navbar";

const App = () => {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('categoryId');
    // const products =

    // Function to return category title based on categoryId
    const getTitle = () => {
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
            <div style={{marginTop: '4rem'}}>
                <br/>
                {/* Category Title */}
                <h1 className="text-3xl font-bold my-4 ml-6 text-left">{getTitle()}</h1>

                {/* Tagline for the category */}
                <h2 className="text-lg font-medium text-gray-600 ml-6 text-left mb-8">{getTagline()}</h2>

                {/* Product Grid */}
                <ProductGrid products={products} />
            </div>
        </div>
    );
};

export default App;