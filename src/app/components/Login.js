import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const validateEmail = (value) => {
    // A simple regular expression for email validation
    return value.includes('@');
};

const Login = ({ onSubmit }) => {
    const [email, setEmail] = useState('');  // Email input state
    const [password, setPassword] = useState('');  // Password input state
    const [showPassword, setShowPassword] = useState(false);  // Toggles password visibility
    const [emailError, setEmailError] = useState(false);  // Tracks if email is valid or not
    const [emailTouched, setEmailTouched] = useState(false);  // Tracks if email input has been focused
    const router = useRouter();

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate email format before submitting
        if (!validateEmail(email)) {
            console.log("Invalid email");
            setEmailError(true);  // If email is invalid, set error and stop submission
            return;
        }

        // If email is valid, call the onSubmit callback passed by the parent component
        if (onSubmit) {
            onSubmit(email, password);
        }
    };

    // Handle email field losing focus
    const handleEmailBlur = () => {
        setEmailTouched(true);  // Mark that the email field has been touched

        // If email is invalid after user finishes editing, set error
        if (!validateEmail(email)) {
            setEmailError(true);
        }
    };

    // Handle email field gaining focus (clear error and warning)
    const handleEmailFocus = () => {
        setEmailError(false);  // Clear any error when the user focuses on the email input
    };

    // Handle email input changes without showing error during input
    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);

        // During input, we do not show the error, only validate silently
        if (emailError) {
            setEmailError(false);  // Clear any displayed error while user is typing
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);  // Toggle between 'text' and 'password' type input
    };

    return (
        <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
                {/* Logo and Welcome Text */}
                <div className="flex flex-col items-center mb-6">
                    <svg
                        aria-label="Vercel logomark"
                        height="22"
                        role="img"
                        viewBox="0 0 74 64"
                        className="h-12 w-12 mb-4 transform transition-transform duration-300"
                        style={{ width: 'auto', overflow: 'visible' }}
                    >
                        <path
                            d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z"
                            fill="currentColor"
                        ></path>
                    </svg>
                    <p className="text-2xl font-bold dark:text-gray-200">Welcome Back</p>
                </div>

                {/* Login Form */}
                <form id="login-form" className="space-y-6" onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold dark:text-gray-300"
                        >
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            placeholder="you@email.com"
                            className={`w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border ${
                                emailError ? 'border-red-500' : 'dark:border-gray-600'
                            } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400`}
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={handleEmailBlur}
                            onFocus={handleEmailFocus}
                            autoComplete="email"
                        />
                        {/* Email error placeholder */}
                        <p
                            className={`text-sm text-red-500 h-2 ${
                                emailTouched && emailError ? 'visible' : 'invisible'
                            }`}
                        >
                            Please enter a valid email.
                        </p>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold dark:text-gray-300"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300 transform transition-transform duration-200 hover:scale-110"
                                onClick={togglePasswordVisibility}
                            >
                                {/* Show or hide password icon */}
                                {showPassword ? (
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M12 4.5C7.30558 4.5 3.41662 7.275 1.5 12C3.41662 16.725 7.30558 19.5 12 19.5C16.6944 19.5 20.5834 16.725 22.5 12C20.5834 7.275 16.6944 4.5 12 4.5ZM12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5C14.4853 7.5 16.5 9.51472 16.5 12C16.5 14.4853 14.4853 16.5 12 16.5Z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M12 4.5C7.30558 4.5 3.41662 7.275 1.5 12C3.41662 16.725 7.30558 19.5 12 19.5C16.6944 19.5 20.5834 16.725 22.5 12C20.5834 7.275 16.6944 4.5 12 4.5ZM12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5C14.4853 7.5 16.5 9.51472 16.5 12C16.5 14.4853 14.4853 16.5 12 16.5ZM4.3448 2.34485L2.93059 3.75906L20.2409 21.0694L21.6551 19.6552L4.3448 2.34485Z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <br/>
                    <br/>
                    {/* Sign In Button */}
                    <div className="space-y-4">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-gray-900 text-white dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg font-medium transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Sign In
                        </button>
                        {/* Create Account Section */}
                        <div className="flex justify-center text-sm dark:text-gray-300">
                            <p>Don&#39;t have an account?</p>
                            <button
                                type="button"
                                className="ml-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                onClick={() => router.push('/register')}
                            >
                                Create account
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;