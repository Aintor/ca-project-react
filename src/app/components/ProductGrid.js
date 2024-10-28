{/*
Author: Wang Jiaxuan
*/
}
import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
    console.log(products)
    if (products.length === 0 ) {
        return null;
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6 bg-gray-100 dark:bg-gray-900">
            {products.map((product, index) => (
                <ProductCard
                    key={index}
                    image={product.image[0]}
                    feature={product.feature}
                    name={product.name}
                    price={product.price}
                    id={product.id}
                    originPrice={product.originPrice}
                />
            ))}

            {Array.from({ length: 5 - (products.length % 5) }).map((_, index) => (
                <div key={`placeholder-${index}`} className="opacity-0"></div>
            ))}
        </div>
    );
};

export default ProductGrid;