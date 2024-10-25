"use client";
import React, {useEffect} from 'react';
import Navbar from "@/app/components/Navbar";
import CartPage from "@/app/components/CartPage";
import { useAuth } from '../layout';
import { useRouter } from "next/navigation";
import {setTimeout} from "next/dist/compiled/@edge-runtime/primitives";
import ErrorComponent from "@/app/components/ErrorComponent";

function App() {
    const {isAuthenticated} = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!isAuthenticated) {
            const timer = setTimeout(() => {
                router.push('/login');
            }, 5000);
            return (
                <div>
                    <ErrorComponent message={"You have not login. Redirecting to login page in 5 seconds..."} straight={true} />
                </div>
            )
        }
    }, [isAuthenticated, router]); // 依赖 isAuthenticated 和 router

    if (!isAuthenticated) {
        return null; // 返回 null 以避免组件渲染
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