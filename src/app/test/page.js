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

function App() {
    const error = "Timeout";
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