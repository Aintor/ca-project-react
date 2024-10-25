"use client"

import React, {useEffect, useState} from 'react';
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
    const [loginParams, setLoginParams] = useState(null);  // Tracks login params for RequestManager
    const { login, isAuthenticated } = useAuth();

    useEffect(() => {
        if (message) {
            login();
            if (redirect) {
                router.push(redirect);
            } else {
                router.push('/');
            }
        }
    }, [message, redirect]);

    // Handler for form submission
    const handleLoginSubmit = (email, password) => {
        setError(null);  // Clear any existing errors
        setMessage(null);  // Clear previous success message
        setLoginParams({ email, password });  // Set login params to trigger RequestManager
    };

    // If authenticated, redirect to account page
    if (isAuthenticated) {
        router.push('/account');
    }

    // Manage the content to be displayed based on loading, error, and message state
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

    return (
        <div>
            <Navbar />
            <div style={{ marginTop: '4rem' }}>
                {content}

                {/* Conditionally render the RequestManager only when loginParams is set */}
                {loginParams && (
                    <RequestManager
                        endpoint={`/api/login?email=${loginParams.email}&password=${loginParams.password}`}
                        method="POST"
                        onSuccess={(result) => {
                            setMessage(result.message);  // Handle success message
                            setLoginParams(null);  // Clear params to unload RequestManager
                        }}
                        onError={(errorMessage) => {
                            setError(errorMessage);  // Handle error message
                            setLoginParams(null);  // Clear params to unload RequestManager
                        }}
                        onLoading={(isLoading) => {
                            setLoading(isLoading);  // Handle loading state
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default App;