import React, { useState } from 'react';
import Sidebar from './Sidebar';
import AccountDetails from './AccountDetails';
import AddressManagement from './AddressManagement';
import PasswordChange from './PasswordChange';
import OrderHistory from './OrderHistory';
import LoadingComponent from './LoadingComponent';
import { useAuth } from '../layout';
import axios from 'axios';

const UserCenterPage = () => {
    const [activeTab, setActiveTab] = useState('AccountDetails');
    const { isAuthenticated, logout } = useAuth();

    // Handle logout
    const handleLogout = async () => {
        try {
            const response = await axios.post('/api/logout', {}, { withCredentials: true });
            if (response.data.success) {
                // Redirect to login page or homepage after logout
                logout();
                window.location.href = '/login';
            } else {
                alert(response.data.message || 'Logout failed. Please try again.');
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('An error occurred during logout. Please try again.');
        } finally {
        }
    };

    // Determine which content component to render
    const renderContent = () => {
        switch (activeTab) {
            case 'AccountDetails':
                return <AccountDetails />;
            case 'AddressManagement':
                return <AddressManagement />;
            case 'PasswordChange':
                return <PasswordChange />;
            case 'OrderHistory':
                return <OrderHistory />;
            default:
                return <AccountDetails />;
        }
    };

    if (!isAuthenticated) {
        return <LoadingComponent />;
    }

    return (
        <main className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div className="fixed left-5 bottom-[20vh] h-[70vh] w-1/4">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />
            </div>

            {/* Content Area */}
            <section className="flex-1 p-8 ml-[28%] overflow-auto">
                {renderContent()}
            </section>
        </main>
    );
};

export default UserCenterPage;