"use client";
import React, {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Navbar from "@/app/components/Navbar";
import CheckoutPage from "@/app/components/CheckoutPage";
import { useAuth } from '../layout';

function App() {
    const {isAuthenticated} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            const timer = setTimeout(() => {
                router.push('/login?redirect=/checkout');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, router]);
    return (
        <div>
            <Navbar/>
            <div style={{marginTop: '4rem'}}>
                <CheckoutPage/>
            </div>
        </div>
    );
}

export default App;