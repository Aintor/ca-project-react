"use client";
import React, {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Navbar from "@/app/components/Navbar";
import { useAuth } from '../layout';
import CheckoutComponent from "@/app/components/CheckoutComponent";

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
                <CheckoutComponent/>
            </div>
        </div>
    );
}

export default App;