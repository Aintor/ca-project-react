// components/UserCenter/PasswordChange.jsx
import React, { useState } from 'react';
import axios from 'axios';

const PasswordChange = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('New password and confirmation do not match.');
            setSaving(false);
            return;
        }

        try {
            const response = await axios.put(`${apiBaseUrl}/account/passwords`, {
                currentPassWord: currentPassword,
                newPassWord: newPassword,
            }, {
                withCredentials: true,
            });

            if (response.data.success) {
                setMessage('Password updated successfully.');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError(response.data.message || 'Failed to update password.');
            }
        } catch (err) {
            console.error('Error updating password:', err);
            setError('An error occurred while updating the password.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Change Password</h2>
            {message && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">{message}</div>}
            {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 dark:text-gray-300">Current Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300">Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {saving ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    );
};

export default PasswordChange;