import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingComponent from './LoadingComponent';

const AccountDetails = () => {
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Fetch user details on mount
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/account/detail`, {
                    withCredentials: true,
                });
                if (response.data) {
                    console.log(response.data);
                    setUserDetails({
                        name: response.data.name ? response.data.name : '',
                        email: response.data.email ? response.data.email : '',
                        phone: response.data.phone ? response.data.phone : '',
                    });
                } else {
                    setError(response.data.message || 'Failed to fetch user details.');
                }
            } catch (err) {
                console.error('Error fetching user details:', err);
                setError('An error occurred while fetching user details.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [apiBaseUrl]);

    const handleChange = (e) => {
        setUserDetails({
            ...userDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        // Construct query string from userDetails object
        const queryString = qs.stringify(userDetails);

        try {
            const response = await axios.patch(`${apiBaseUrl}/account/details?${queryString}`, null, {
                withCredentials: true,
            });
            if (response.data.success) {
                setMessage('Account details updated successfully.');
            } else {
                setError(response.data.message || 'Failed to update account details.');
            }
        } catch (err) {
            console.error('Error updating account details:', err);
            setError('An error occurred while updating account details.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <LoadingComponent />;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Account Details</h2>
            {message && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">{message}</div>}
            {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 dark:text-gray-300">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={userDetails.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={userDetails.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={userDetails.phone}
                        onChange={handleChange}
                        required
                        className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                </div>
                <button
                    type="submit"
                    disabled={saving}
                    className="
                        w-full
                        bg-blue-600 hover:bg-blue-500
                        text-white font-semibold py-2 px-4 rounded-md
                        transition-colors duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                    "
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default AccountDetails;