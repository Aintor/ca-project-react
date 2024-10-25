"use client";
import React from 'react';
import Navbar from "@/app/components/Navbar";
import UserCenterPage from "@/app/components/UserCenterPage";
function App() {
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