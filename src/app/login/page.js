"use client"

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import RequestManager from '@/app/components/RequestManager';
import Login from '@/app/components/Login';
import LoadingComponent from '@/app/components/LoadingComponent';
import ErrorComponent from '@/app/components/ErrorComponent';
import Navbar from "@/app/components/Navbar";
import { useAuth } from '../layout';

const App = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');
    const [loading, setLoading] = useState(false);  // Tracks the loading state
    const [error, setError] = useState(null);       // Tracks any error that occurs
    const [message, setMessage] = useState(null);   // Tracks success message
    const { login, isAuthenticated } = useAuth();

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
                    data: new URLSearchParams({ email: email, password: password }) // Encode form data
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

    if (isAuthenticated) {
        router.push('/account');
    }

    let content = (
        <Login
            onSubmit={handleLoginSubmit}  // Inject submit handler
        />
    );
    if (loading) {
        content = (<LoadingComponent />);
    }

    if (error) {
        content = (<ErrorComponent error={error} />);
    }

    if (message) {
        login();
        if (redirect) {
            router.push(redirect);
        } else {
            router.push('/');
        }
    }

    return (
        <div>
            <Navbar />
            <div style={{marginTop: '4rem'}}>
                {content}
            </div>
        </div>
    );
};

export default App;