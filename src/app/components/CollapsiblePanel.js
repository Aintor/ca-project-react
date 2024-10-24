{/*
Author: Wang Jiaxuan
*/}
import React from "react";

const CollapsiblePanel = ({ title, isOpen, toggle, children }) => (
    <div className={`bg-slate-200 dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-2xl shadow-md mb-4 overflow-hidden`}>
        <button
            onClick={toggle}
            className="w-full flex justify-between items-center p-4 text-gray-900 dark:text-gray-200 font-bold hover:bg-slate-300 dark:hover:bg-gray-600 transition-colors duration-300 rounded-t-2xl"
        >
            <span>{title}</span>
            <svg
                className={`w-6 h-6 transform transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        </button>
        {isOpen && (
            <div className="p-6">
                {children}
            </div>
        )}
    </div>
);
export default CollapsiblePanel;