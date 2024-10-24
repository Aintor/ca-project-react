import React, { useState } from 'react';
import RequestManager from '@/app/components/RequestManager';
import Login from '@/app/components/Login';
import LoadingComponent from '@/app/components/LoadingComponent';
import ErrorComponent from '@/app/components/ErrorComponent';

const LoginContainer = () => {
    const [loading, setLoading] = useState(false);  // Tracks the loading state
    const [error, setError] = useState(null);       // Tracks any error that occurs
    const [message, setMessage] = useState(null);   // Tracks success message

    // Handler for form submission
    const handleLoginSubmit = (email, password) => {
        setError(null);  // Clear any existing errors
        setMessage(null);  // Clear previous success message

        // Simulate form submission with RequestManager
        return (
            <RequestManager
                endpoint="/api/login"
                method="POST"
                options={{
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // Set the correct Content-Type
                    data: new URLSearchParams({ username: email, password: password }) // Encode form data
                }}
                onSuccess={(result) => {
                    setMessage(result.message);  // Handle success message
                }}
                onError={(errorMessage) => {
                    setError(errorMessage);  // Handle error message
                }}
                onLoading={(isLoading) => {
                    setLoading(isLoading);  // Handle loading state
                }}
            />
        );
    };

    return (
        <div className="login-container">
            {/* Display loading state */}
            {loading && <LoadingComponent />}

            {/* Display error if any */}
            {error && <ErrorComponent message={error} />}

            {/* Display success message if login is successful */}
            {message && <div className="success-message">{message}</div>}

            {/* Login Form */}
            <Login
                onSubmit={handleLoginSubmit}  // Inject submit handler
            />
        </div>
    );
};

export default LoginContainer;