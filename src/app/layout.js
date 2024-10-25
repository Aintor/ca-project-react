"use client";
import localFont from "next/font/local";
import "./globals.css";
import React, { createContext, useState, useContext, useEffect } from "react";
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
    const sessionTimeout = 7 * 24 * 60 * 60 * 1000;

    useEffect(() => {
        const storedAuthStatus = localStorage.getItem("isAuthenticated");
        const loginTimestamp = localStorage.getItem("loginTimestamp");

        if (storedAuthStatus === "true" && loginTimestamp) {
            const currentTime = new Date().getTime();
            const elapsedTime = currentTime - parseInt(loginTimestamp, 10);

            if (elapsedTime < sessionTimeout) {
                setIsAuthenticated(true);
            } else {
                logout();
            }
        }
    }, []);

    const login = () => {
        const loginTimestamp = new Date().getTime();
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("loginTimestamp", loginTimestamp.toString());
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("loginTimestamp");
    };

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