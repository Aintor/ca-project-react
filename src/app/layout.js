"use client";
import localFont from "next/font/local";
import "./globals.css";
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import Navbar from "@/app/components/Navbar";
import LoadingComponent from "@/app/components/LoadingComponent";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});

const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                const response = await axios.get(apiBaseUrl+"/api/account/details", {timeout: 5000});
                if (response.data) {
                    setIsAuthenticated(true);
                } else {
                    console.log("Failed to load user info (no data returned)");
                }
            } catch (error) {
                console.log("Error loading user info:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAccountDetails();
    }, []);

    if (loading) {
        return (
            <div>
                <Navbar/>
                <div style={{marginTop: '4rem'}}>
                    <LoadingComponent />
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <AuthProvider>
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}