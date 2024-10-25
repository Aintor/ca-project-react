{/*
Author: Wang Jiaxuan
*/}
import React from 'react';

const QuantitySelector = ({ quantity, handleIncrement, handleDecrement, handleQuantityChange, handleBlur, disabled, input_allowed= true }) => {
    return (
        <div className="mt-6 mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity
            </label>
            <div className="flex items-center space-x-4">
                <button
                    type="button"
                    className={`h-10 w-10 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition ${quantity === 1 || disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleDecrement}
                    disabled={quantity === 1 || disabled}
                >
                    -
                </button>
                <input
                    id="quantity"
                    type="text"
                    value={quantity}
                    onChange={handleQuantityChange}
                    onBlur={handleBlur}
                    aria-label="Quantity"
                    className="w-16 text-center border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-10"
                    disabled={disabled && input_allowed}
                />
                <button
                    type="button"
                    className={`h-10 w-10 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleIncrement}
                    disabled={disabled}
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default QuantitySelector;