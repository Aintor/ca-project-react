"use client";
import React, {useEffect} from 'react';
import Navbar from "@/app/components/Navbar";
import CartPage from "@/app/components/CartPage";
import { useAuth } from '../layout';
import { useRouter } from "next/navigation";
import ErrorComponent from "@/app/components/ErrorComponent";

function App() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            const timer = setTimeout(() => {
                router.push('/login?redirect=/cart', { forceOptimisticNavigation: true });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
        <div>
            <Navbar/>
            <div style={{marginTop: '4rem'}}>
                <ErrorComponent message={"You have not login. Redirecting to login page in 5 seconds..."}
                                straight={true}/>
            </div>
        </div>
        );
    }

    return (
        <div>
            <Navbar/>
            <div style={{marginTop: '4rem'}}>
                <CartPage/>
            </div>
        </div>
    );
}

export default App;