"use client";
{/*
Author: Wang Jiaxuan
Note: For this component, I refer to the one on Apple's App Store.
      You can see the prototype at: https://apps.apple.com/us/app/gmail-email-by-google/id422689480
*/}
import React from 'react';

// Star rating component
const StarRating = ({ rating, size = 'small' }) => {
    const stars = [];

    // Adjust Tailwind classes based on size
    const sizeClasses = size === 'large' ? 'h-5 w-5' : 'h-4 w-4'; // Slightly increase star size

    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span
                key={i}
                className={`inline-block ${sizeClasses} mr-1 ${
                    i <= rating ? 'text-orange-500' : 'text-gray-300'
                }`}
            >
                ★
            </span>
        );
    }

    return <div className="flex items-center mb-2">{stars}</div>;
};

// Comment component
const Comment = ({ userName, rating, date, comment }) => {
    console.log(date);
    return (
        <li className="clearfix bg-gray-100 dark:bg-gray-800 backdrop-filter backdrop-blur-lg p-5 rounded-lg shadow-lg mb-6">
            {/* Star rating displayed at the top */}
            <StarRating rating={rating} />

            {/* Username and date on the same line, consistent font */}
            <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
                <div className="font-medium text-base text-gray-900 dark:text-white">
                    {userName}
                </div>
                <span className="mx-1 text-gray-500"> </span>
                <div className="font-medium text-base text-gray-500 dark:text-gray-400">
                    {date}
                </div>
            </div>

            {/* Comment content */}
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {comment}
            </div>
        </li>
    );
};

export default Comment;