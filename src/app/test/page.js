// src/app/test/page.js
"use client";
import React from 'react';
import Navbar from "@/app/components/Navbar";
import LoadingComponent from "@/app/components/LoadingComponent";
import ErrorComponent from "@/app/components/ErrorComponent"
import ProductCard from "@/app/components/ProductCard"
import Login from "@/app/components/Login"
import Register from "@/app/components/Register";
import CartPage from "@/app/components/CartPage";
// import CheckoutComponent from "@/app/components/CheckoutComponent";
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