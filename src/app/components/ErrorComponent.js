{/*
Author: Wang Jiaxuan
*/}
import React from 'react';

const ErrorComponent = ({ message, straight=true }) => {
    return (
        <div
            className="flex flex-col justify-center items-center h-screen bg-white dark:bg-black text-black dark:text-white">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mb-4 text-red-500 dark:text-red-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                shapeRendering="geometricPrecision"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    d="M2.20164 18.4695L10.1643 4.00506C10.9021 2.66498 13.0979 2.66498 13.8357 4.00506L21.7984 18.4695C22.4443 19.6428 21.4598 21 19.9627 21H4.0373C2.54022 21 1.55571 19.6428 2.20164 18.4695Z"
                />
                <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 17.0195V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-lg font-semibold">{message || 'An error occurred'}</p>
            {!straight && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Please try again later.
                </p>
            )}
        </div>
    );
};

export default ErrorComponent;