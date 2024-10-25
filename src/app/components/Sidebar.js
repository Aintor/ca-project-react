import React from 'react';
import { FaUser, FaAddressBook, FaLock, FaHistory, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ activeTab, setActiveTab, handleLogout }) => {
    const tabs = [
        { name: 'AccountDetails', icon: <FaUser />, label: 'Account Details' },
        { name: 'AddressManagement', icon: <FaAddressBook />, label: 'Address Management' },
        { name: 'PasswordChange', icon: <FaLock />, label: 'Change Password' },
        { name: 'OrderHistory', icon: <FaHistory />, label: 'Order History' },
    ];

    return (
        <aside className="w-full h-full bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-3xl shadow-lg p-6 dark:bg-gray-800 dark:bg-opacity-50 flex flex-col space-y-4">
            <nav className="flex flex-col space-y-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        className={`flex items-center space-x-2 p-3 rounded-md ${activeTab === tab.name ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'} transition-colors duration-200`}
                        onClick={() => setActiveTab(tab.name)}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
                <button
                    className="flex items-center space-x-2 p-3 rounded-md text-red-600 dark:text-red-400 hover:bg-red-100/50 dark:hover:bg-red-700/50 transition-colors duration-200"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </nav>
        </aside>
    );
};

export default Sidebar;