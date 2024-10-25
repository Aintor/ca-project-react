"use client"
{/*
Author: Wang Jiaxuan
*/}
import React from 'react';
import Navbar from "@/app/components/Navbar";
import Register from "@/app/components/Register";

const App = () => {
    return (
        <div>
            <Navbar/>
            <div style={{marginTop: '4rem'}}>
                <Register/>
            </div>
        </div>
    )
}
export default App;