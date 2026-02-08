import React, { useState, useEffect } from 'react';
import { useAppAuth } from '@/context/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { User } from '@/types';

const ProfilePage: React.FC = () => {
  const { state, updateUserProfile, logout } = useAppAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (state.user) {
      setFormData({
        firstName: state.user.firstName || '',
        lastName: state.user.lastName || '',
        email: state.user.email,
      });
    }
  }, [state.user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      setMessage('Profile updated successfully!');
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      setMessage('');
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!state.user) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout title="Profile" description="Manage your profile settings">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

        {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Button type="submit" variant="primary">Update Profile</Button>
        </form>

        <div className="mt-8">
          <Button onClick={handleLogout} variant="secondary">Logout</Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;