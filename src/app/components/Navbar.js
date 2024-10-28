{/*
Author: Wang Jiaxuan
Note: For this component, I refer to the one on Apple's website.
      You can see the prototype at: https://www.apple.com
*/
}
// Should use <div style={{marginTop: '4rem'}}> enclose the content to render the Navbar correctly.
import {useRouter} from "next/navigation";
import React, {useState, useEffect, useRef} from 'react';

const Navbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false); // Control the search box's open state
    const inputRef = useRef(null);
    const router = useRouter();
    const [keyword, setKeyword] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (keyword.trim()) {
                router.push(`/?search=${encodeURIComponent(keyword)}`, { forceOptimisticNavigation: true });
            }
        }
    };

    const handleQuickSearch = (searchTerm) => {
        setKeyword(searchTerm);
        router.push(`/?search=${encodeURIComponent(searchTerm)}`, { forceOptimisticNavigation: true });
    };

    const handleClick = (categoryId) => {
        const url = categoryId === 0 ? '/' : `/?categoryId=${categoryId}`;
        router.push(url);
    };

    const closeSearch = () => {
        setIsSearchOpen(false);
    };

    const toggleSearch = () => {
        setIsSearchOpen(prev => !prev);
    };

    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            inputRef.current.focus();
        }

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isSearchOpen) {
                closeSearch();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isSearchOpen]);

    return (
        <div>
            <nav
                className={`${
                    isSearchOpen ? 'bg-white dark:bg-black' : 'bg-white/30 dark:bg-black/30'
                } backdrop-blur-md text-black dark:text-white fixed top-0 left-0 right-0 z-50 transition-colors duration-300`}
                style={{height: '4rem'}} // Fixed height of 4rem
            >
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    <div className="relative flex items-center justify-between h-16">
                        <div className="absolute inset-y-0 left-0 flex items-center">
                            <a onClick={() => handleClick(0)} className="flex-shrink">
                                <svg
                                    aria-label="Vercel logomark"
                                    height="22"
                                    role="img"
                                    viewBox="0 0 74 64"
                                    className="h-8 w-8 transform transition-transform duration-300 hover:scale-110"
                                    style={{width: 'auto', overflow: 'visible'}}
                                >
                                    <path
                                        d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z"
                                        fill="currentColor"
                                    ></path>
                                </svg>
                            </a>
                        </div>

                        <div className="flex-1 flex items-center justify-center space-x-4">
                            {[
                                'Food & Beverages',
                                'Electronics',
                                'Home & Living',
                                'Clothing & Accessories',
                                'Beauty & Health',
                            ].map((item, index) => (
                                <a
                                    key={item}
                                    onClick={() => handleClick(index + 1)}
                                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200/50 hover:text-black dark:hover:bg-gray-700/50 dark:hover:text-white transition-colors duration-200"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>

                        <div className="absolute inset-y-0 right-0 flex items-center space-x-4">
                            <button
                                onClick={toggleSearch}
                                aria-label="Search"
                                className="hover:bg-gray-200/50 hover:text-black dark:hover:bg-gray-700/50 dark:hover:text-white p-2 rounded-md transition-colors duration-200 cursor-pointer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="15px"
                                    height="44px"
                                    viewBox="0 0 15 44"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M14.298,27.202l-3.87-3.87c0.701-0.929,1.122-2.081,1.122-3.332c0-3.06-2.489-5.55-5.55-5.55
                                        c-3.06,0-5.55,2.49-5.55,5.55 c0,3.061,2.49,5.55,5.55,5.55c1.251,0,2.403-0.421,3.332-1.122l3.87,3.87
                                        c0.151,0.151,0.35,0.228,0.548,0.228s0.396-0.076,0.548-0.228C14.601,27.995,14.601,27.505,14.298,27.202z
                                        M1.55,20c0-2.454,1.997-4.45,4.45-4.45 c2.454,0,4.45,1.997,4.45,4.45S8.454,24.45,6,24.45C3.546,24.45,1.55,22.454,1.55,20z"
                                    ></path>
                                </svg>
                            </button>

                            <a
                                role="button"
                                href="cart"
                                aria-label="Shopping Bag"
                                className="hover:bg-gray-200/50 hover:text-black dark:hover:bg-gray-700/50 dark:hover:text-white p-2 rounded-md transition-colors duration-200"
                            >
                                <svg
                                    height="44"
                                    viewBox="0 0 14 44"
                                    width="14"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                >
                                    <path
                                        d="m11.3535 16.0283h-1.0205a3.4229 3.4229 0 0 0 -3.333-2.9648 3.4229 3.4229 0 0 0 -3.333 2.9648h-1.02a2.1184 2.1184 0 0 0 -2.117 2.1162v7.7155a2.1186 2.1186 0 0 0 2.1162 2.1167h8.707a2.1186 2.1186 0 0 0 2.1168-2.1167v-7.7155a2.1184 2.1184 0 0 0 -2.1165-2.1162zm-4.3535-1.8652a2.3169 2.3169 0 0 1 2.2222 1.8652h-4.4444a2.3169 2.3169 0 0 1 2.2222-1.8652zm5.37 11.6969a1.0182 1.0182 0 0 1 -1.0166 1.0171h-8.7069a1.0182 1.0182 0 0 1 -1.0165-1.0171v-7.7155a1.0178 1.0178 0 0 1 1.0166-1.0166h8.707a1.0178 1.0178 0 0 1 1.0164 1.0166z"></path>
                                </svg>
                            </a>

                            <a
                                role="button"
                                href="/account"
                                aria-label="Account"
                                className="hover:bg-gray-200/50 hover:text-black dark:hover:bg-gray-700/50 dark:hover:text-white p-2 rounded-md transition-colors duration-200"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="15px"
                                    height="44px"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    preserveAspectRatio="xMidYMid meet"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M17.0044 7C17.0044 9.76142 14.7652 12 12.0029 12C9.24067 12 7.00142 9.76142 7.00142 7C7.00142 4.23858 9.24067 2 12.0029 2C14.7652 2 17.0044 4.23858 17.0044 7ZM15.0038 7C15.0038 5.34315 13.6603 4 12.0029 4C10.3456 4 9.00202 5.34315 9.00202 7C9.00202 8.65685 10.3456 10 12.0029 10C13.6603 10 15.0038 8.65685 15.0038 7ZM21.8959 20.55L20.0054 16.76C19.1574 15.0683 17.4268 14.0001 15.534 14H8.47186C6.57907 14.0001 4.84848 15.0683 4.00051 16.76L2.10994 20.55C1.95392 20.8595 1.96935 21.2277 2.15071 21.5231C2.33208 21.8185 2.65351 21.999 3.00021 22H21.0057C21.3524 21.999 21.6738 21.8185 21.8551 21.5231C22.0365 21.2277 22.0519 20.8595 21.8959 20.55ZM5.79105 17.66L4.6207 20H19.3852L18.2148 17.66C17.7075 16.6441 16.6698 16.0016 15.534 16H8.47186C7.33602 16.0016 6.29839 16.6441 5.79105 17.66Z"
                                    ></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            <div
                className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${
                    isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                } z-40`}
                onMouseEnter={closeSearch}
            ></div>

            <div
                className={`fixed left-0 right-0 bg-white dark:bg-black transition-transform duration-300 ease-in-out z-40 transform ${isSearchOpen ? 'translate-y-0' : '-translate-y-[120%]'}`}
            >
                <div className="max-w-5xl mx-auto p-4">
                    <input
                        ref={inputRef}
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)} // 实时更新 keyword 状态
                        onKeyDown={handleKeyDown}
                        placeholder="Search"
                        className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 text-black dark:text-white focus:outline-none py-2"
                    />

                    <div className="text-sm mt-4">
                        <ul>
                            {[
                                'Organic Coffee',
                                'Gluten-Free Snacks',
                                'Wireless Earbuds',
                                'Smart Light Bulbs',
                                'Healthy Meal Kits',
                            ].map((item, index) => (
                                <li key={index} className="mb-2">
                                    <button
                                        onClick={() => handleQuickSearch(item)}
                                        className="flex items-center space-x-2 py-2 px-4 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                    >
                                        <span className="text-gray-500 dark:text-gray-400">→</span>
                                        <span className="text-black dark:text-white">{item}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;