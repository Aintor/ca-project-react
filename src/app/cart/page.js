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
            setTimeout(() => {
                router.push('/login');
            }, 5000);
            return (
                <div>
                    <ErrorComponent message={"You have not login. Redirecting to login page in 5 seconds..."} straight={true} />
                </div>
            )
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null;
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