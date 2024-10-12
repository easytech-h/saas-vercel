import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { useSales } from '../context/SalesContext';
import { Lock, RefreshCw, AlertTriangle, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, changePassword } = useAuth();
  const { deleteAllProducts, products } = useInventory();
  const { clearSales, sales } = useSales();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (changePassword(currentPassword, newPassword)) {
      setMessage('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError('Failed to change password. Please check your current password.');
    }
  };

  const handleResetSystem = () => {
    if (window.confirm('Are you sure you want to reset the entire system? This action cannot be undone.')) {
      deleteAllProducts();
      clearSales();
      setMessage('System has been reset to factory defaults');
    }
  };

  const handleCreateRestorePoint = () => {
    const restorePoint = {
      date: new Date().toISOString(),
      products: products,
      sales: sales,
    };
    localStorage.setItem('systemRestorePoint', JSON.stringify(restorePoint));
    setMessage('System restore point created successfully');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block mb-2">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block mb-2">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Lock className="inline-block mr-2" size={18} />
            Change Password
          </button>
        </form>
      </div>

      {user?.isSuperAdmin && (
        <>
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Reset System</h2>
            <p className="mb-4 text-red-600">
              <AlertTriangle className="inline-block mr-2" size={18} />
              Warning: This action will reset the entire system to factory defaults, deleting all products, sales data, and settings. This action cannot be undone.
            </p>
            <button
              onClick={handleResetSystem}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              <RefreshCw className="inline-block mr-2" size={18} />
              Reset System to Factory Defaults
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create System Restore Point</h2>
            <p className="mb-4">
              This action will create a restore point of the current system state, including all products and sales data.
            </p>
            <button
              onClick={handleCreateRestorePoint}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              <Save className="inline-block mr-2" size={18} />
              Create Restore Point
            </button>
          </div>
        </>
      )}
      
      {(message || error) && (
        <div className={`mt-4 p-4 ${message ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded`}>
          {message || error}
        </div>
      )}
    </div>
  );
};

export default Settings;