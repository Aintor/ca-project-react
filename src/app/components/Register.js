{/*
Author: Wang Jiaxuan
*/}
import React, { useState, useEffect } from 'react';
import RequestManager from './RequestManager';
import { useAuth } from '../layout';
import { useSearchParams, useRouter } from 'next/navigation';
import ErrorComponent from "@/app/components/ErrorComponent";

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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [triggerRequest, setTriggerRequest] = useState(false);
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailRegex = /\S+@\S+\.\S+/;
    // Form validation state
    const [isFormValid, setIsFormValid] = useState(false);

    // Password conditions state
    const [passwordValidations, setPasswordValidations] = useState({
        minLength: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/account');
        }
    }, [isAuthenticated]);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Function to validate password
    const validatePassword = (value) => {
        setPassword(value);
        const validations = {
            minLength: value.length >= 8,
            uppercase: /[A-Z]/.test(value),
            lowercase: /[a-z]/.test(value),
            number: /\d/.test(value),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        };
        setPasswordValidations(validations);
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

    // Validate the entire form whenever any input changes
    useEffect(() => {
        const isEmailValid = emailRegex.test(email);
        const isPasswordValid =
            passwordValidations.minLength &&
            passwordValidations.uppercase &&
            passwordValidations.lowercase &&
            passwordValidations.number &&
            passwordValidations.specialChar;

        const isUsernameValid = username.trim().length > 0;

        // Set form valid state if all conditions are satisfied
        setIsFormValid(isEmailValid && isPasswordValid && isUsernameValid);
    }, [email, username, passwordValidations]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setTriggerRequest(true);
        setLoading(true);
    };

    const handleSuccess = () => {
        if (redirect) {
            router.push(redirect, { forceOptimisticNavigation: true });
        } else {
            router.push('/login' + redirect ? '?redirect='+redirect : '');
        }
    };

    const handleError = (errorMessage) => {
        setTriggerRequest(false);
        setError(errorMessage);
        setUsername('');
        setPassword('');
        setEmail('');
        setPasswordValidations({
            minLength: false,
            uppercase: false,
            lowercase: false,
            number: false,
            specialChar: false,
        });
        setTimeout(() => setError(null), 5000);
    };

    return (error ? <ErrorComponent message={error + " Redirecting to register page in 5 seconds..."} straight={true} /> :
        (<div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
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
                        <p className="text-2xl font-bold dark:text-gray-200">Let&#39;s get started!</p>
                        <p className="text-gray-600 dark:text-gray-300">
                            Create an account and get first access to the very best products, inspiration and community.
                        </p>
                    </div>
                </div>

                {/* Registration Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold dark:text-gray-300">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            autoComplete="given-name"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
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
                                        <path
                                            d="M12 4.5C7.30558 4.5 3.41662 7.275 1.5 12C3.41662 16.725 7.30558 19.5 12 19.5C16.6944 19.5 20.5834 16.725 22.5 12C20.5834 7.275 16.6944 4.5 12 4.5ZM12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5C14.4853 7.5 16.5 9.51472 16.5 12C16.5 14.4853 14.4853 16.5 12 16.5Z"/>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M12 4.5C7.30558 4.5 3.41662 7.275 1.5 12C3.41662 16.725 7.30558 19.5 12 19.5C16.6944 19.5 20.5834 16.725 22.5 12C20.5834 7.275 16.6944 4.5 12 4.5ZM12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5C14.4853 7.5 16.5 9.51472 16.5 12C16.5 14.4853 14.4853 16.5 12 16.5ZM4.3448 2.34485L2.93059 3.75906L20.2409 21.0694L21.6551 19.6552L4.3448 2.34485Z"/>
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Password Strength Hints */}
                        <div className="mt-2 space-y-1">
                            <div className="flex items-center">
                                <CheckmarkIcon isActive={passwordValidations.minLength}/>
                                <p className="ml-2 text-sm">8 characters minimum</p>
                            </div>
                            <div className="flex items-center">
                                <CheckmarkIcon isActive={passwordValidations.uppercase}/>
                                <p className="ml-2 text-sm">1 uppercase letter</p>
                            </div>
                            <div className="flex items-center">
                                <CheckmarkIcon isActive={passwordValidations.lowercase}/>
                                <p className="ml-2 text-sm">1 lowercase letter</p>
                            </div>
                            <div className="flex items-center">
                                <CheckmarkIcon isActive={passwordValidations.number}/>
                                <p className="ml-2 text-sm">1 number</p>
                            </div>
                            <div className="flex items-center">
                                <CheckmarkIcon isActive={passwordValidations.specialChar}/>
                                <p className="ml-2 text-sm">1 special character (e.g. !@#$%)</p>
                            </div>
                        </div>
                    </div>

                    {/* Create Account Button */}
                    <div>
                        <button
                            type="submit"
                            className={`flex justify-center items-center w-full px-4 py-2 rounded-lg font-medium transform transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                                isFormValid && !loading
                                    ? 'bg-gray-900 text-white dark:bg-gray-700 dark:hover:bg-gray-600 hover:scale-105'
                                    : 'bg-gray-400 text-gray-300 cursor-not-allowed'
                            }`}
                            disabled={!isFormValid || loading}
                        >
                            {loading ? (
                                <div
                                    className="w-6 h-6 border-4 border-t-blue-500 dark:border-t-blue-300 border-gray-300 dark:border-gray-700 rounded-full animate-spin"></div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </div>

                    {/* Already Have Account */}
                    <div className="text-center text-sm dark:text-gray-300">
                        <p>Already have an account?</p>
                        <button
                            type="button"
                            className="mt-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            onClick={() => router.push('/login')}
                        >
                            Log in
                        </button>
                    </div>
                </form>
            </div>
            {triggerRequest && (
                <RequestManager
                    endpoint={`/api/register?username=${username}&email=${email}&password=${password}`}
                    method="POST"
                    onSuccess={handleSuccess}
                    onError={handleError}
                    onLoading={(isLoading) => {
                        setLoading(isLoading);  // Handle loading state
                    }}
                />
            )}
        </div>
        )
    );
};

export default Register;