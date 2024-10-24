'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar'; // Assuming you have a Navbar component
import ErrorComponent from './components/ErrorComponent'; // Assuming you have an ErrorComponent component

export default function NotFound() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 5000);

        // Clear the timer when the component unmounts
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div>
            {/* Display Navbar */}
            <Navbar />

            {/* Error message and redirection notification */}
            <div style={{ marginTop: '4rem' }}>
                <ErrorComponent message="Invalid Page. Redirecting to homepage in 5 seconds..." straight={true} />
            </div>
        </div>
    );
}