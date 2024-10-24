{/*
Author: Wang Jiaxuan
*/}
import React from 'react';

const SquareImageDisplay = ({ image, feature }) => {
    return (
        <div className="w-full max-w-xs mx-auto relative">
            {feature.name !== "None" && (
                <div className="absolute top-2 left-2 inline-block px-4 py-1 bg-blue-900 text-white font-medium rounded-xl text-sm shadow-lg border-2 border-white">
                    {feature.name}
                </div>
            )}
            <div className="w-full aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                <img
                    src={image}
                    alt="Displayed"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default SquareImageDisplay;