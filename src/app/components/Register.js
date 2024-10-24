{/*
Author: Wang Jiaxuan
*/}
import React, { useState } from 'react';

// Define the Checkmark Icon as a reusable component
const CheckmarkIcon = ({ isActive }) => (
    <svg
        className={`w-3 h-3 ${isActive ? 'text-green-500' : 'text-gray-600 dark:text-gray-400'}`}
        fill="currentColor"
        viewBox="0 0 24 24"
    >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" />
    </svg>
);

const Register = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);

    // Password conditions state
    const [passwordValidations, setPasswordValidations] = useState({
        minLength: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Function to validate password
    const validatePassword = (value) => {
        setPassword(value);

        setPasswordValidations({
            minLength: value.length >= 8,
            uppercase: /[A-Z]/.test(value),
            lowercase: /[a-z]/.test(value),
            number: /\d/.test(value),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        });
    };

    // Email validation
    const handleEmailBlur = () => {
        if (!emailTouched) setEmailTouched(true);
        if (!email.includes('@')) {
            setEmailError(true);
        }
    };

    const handleEmailFocus = () => {
        setEmailError(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
                {/* Logo and Welcome Message */}
                <div className="flex flex-col items-center mb-6">
                    <svg
                        viewBox="0 0 46 32"
                        className="h-12 w-12 mb-4 transform transition-transform duration-300 hover:scale-110"
                        role="img"
                        aria-label="brand-logo"
                    >
                        {/* SVG Path */}
                        <use xlinkHref="#brand-logo"></use>
                    </svg>
                    <div className="text-center">
                        <p className="text-2xl font-bold dark:text-gray-200">Let's get started!</p>
                        <p className="text-gray-600 dark:text-gray-300">
                            Create an account and get first access to the very best products, inspiration and community.
                        </p>
                    </div>
                </div>

                {/* Registration Form */}
                <form className="space-y-6">
                    {/* Name */}
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-semibold dark:text-gray-300">
                            Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            autoComplete="given-name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold dark:text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@email.com"
                            className={`w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border ${
                                emailError ? 'border-red-500' : 'dark:border-gray-600'
                            } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={handleEmailBlur}
                            onFocus={handleEmailFocus}
                            autoComplete="email"
                        />
                        {/* Email error placeholder */}
                        <p className={`text-sm text-red-500 h-4 ${emailTouched && emailError ? 'visible' : 'invisible'}`}>
                            Please enter a valid email.
                        </p>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold dark:text-gray-300">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => validatePassword(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300 transform transition-transform duration-200 hover:scale-110"
                                onClick={togglePasswordVisibility}
                            >
                                {passwordVisible ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 4.5C7.30558 4.5 3.41662 7.275 1.5 12C3.41662 16.725 7.30558 19.5 12 19.5C16.6944 19.5 20.5834 16.725 22.5 12C20.5834 7.275 16.6944 4.5 12 4.5ZM12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5C14.4853 7.5 16.5 9.51472 16.5 12C16.5 14.4853 14.4853 16.5 12 16.5Z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 4.5C7.30558 4.5 3.41662 7.275 1.5 12C3.41662 16.725 7.30558 19.5 12 19.5C16.6944 19.5 20.5834 16.725 22.5 12C20.5834 7.275 16.6944 4.5 12 4.5ZM12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5C14.4853 7.5 16.5 9.51472 16.5 12C16.5 14.4853 14.4853 16.5 12 16.5ZM4.3448 2.34485L2.93059 3.75906L20.2409 21.0694L21.6551 19.6552L4.3448 2.34485Z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Password Strength Hints */}
                        <div className="mt-2 space-y-1">
                            <div className="flex items-center">
                                <CheckmarkIcon isActive={passwordValidations.minLength} />
                                <p className="ml-2 text-sm">8 characters minimum</p>
                            </div>
                            <div className="flex items-center">
                                <CheckmarkIcon isActive={passwordValidations.uppercase} />
                                <p className="ml-2 text-sm">1 uppercase letter</p>
                            </div>
                            <div className="flex items-center">
                                <CheckmarkIcon isActive={passwordValidations.lowercase} />
                                <p className="ml-2 text-sm">1 lowercase letter</p>
                            </div>
                            <div className="flex items-center">
                                <CheckmarkIcon isActive={passwordValidations.number} />
                                <p className="ml-2 text-sm">1 number</p>
                            </div>
                            <div className="flex items-center">
                                <CheckmarkIcon isActive={passwordValidations.specialChar} />
                                <p className="ml-2 text-sm">1 special character (e.g. !@#$%)</p>
                            </div>
                        </div>
                    </div>

                    {/* Create Account Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-gray-900 text-white dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg font-medium transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Create Account
                        </button>
                    </div>

                    {/* Already Have Account */}
                    <div className="text-center text-sm dark:text-gray-300">
                        <p>Already have an account?</p>
                        <button
                            type="button"
                            className="mt-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;