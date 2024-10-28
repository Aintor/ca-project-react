"use client";
import React, {useEffect} from 'react';
import {useAuth} from "@/app/layout";
import {useRouter} from "next/navigation";
import Navbar from "@/app/components/Navbar";
import UserCenterPage from "@/app/components/UserCenterPage";
function App() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, []);
    return (
        <div>
            <Navbar/>
            <div style={{marginTop: '4rem'}}>
                <UserCenterPage/>
            </div>
        </div>
    );
}

export default App;