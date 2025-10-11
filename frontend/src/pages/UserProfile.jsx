import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);

  const [profile, setProfile] = useState({
    fullName: { firstName: 'om prakash', lastName: 'nayak' },
    phoneNumber: '+91 9348698533',
    email: '',
    gender: 'Male',
    dateOfBirth: '',
    memberSince: 'June 2025',
    emergencyContact: { name: '', phoneNumber: '', relationship: '' }
  });

  const handleChange = e => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [sec, field] = name.split('.');
      setProfile(p => ({
        ...p,
        [sec]: { ...p[sec], [field]: value }
      }));
    } else {
      setProfile(p => ({ ...p, [name]: value }));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Header */}
      <header className="bg-white shadow flex items-center p-3">
        <button onClick={() => navigate(-1)} className="text-gray-600 p-2">
          ←
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold">Profile</h1>
        <button onClick={() => navigate('/help')} className="text-gray-600 p-2">
          ?
        </button>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-md mx-auto w-full">
        {/* Name */}
        <div className="bg-white p-3 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            {edit ? (
              <div className="flex space-x-2 mt-1">
                <input
                  name="fullName.firstName"
                  value={profile.fullName.firstName}
                  onChange={handleChange}
                  className="border p-1 rounded flex-1"
                  placeholder="First"
                />
                <input
                  name="fullName.lastName"
                  value={profile.fullName.lastName}
                  onChange={handleChange}
                  className="border p-1 rounded flex-1"
                  placeholder="Last"
                />
              </div>
            ) : (
              <p className="mt-1 text-gray-900">
                {profile.fullName.firstName} {profile.fullName.lastName}
              </p>
            )}
          </div>
          {!edit && (
            <button onClick={() => setEdit(true)} className="text-blue-600 p-2">
              Edit
            </button>
          )}
        </div>

        {/* Phone */}
        <div className="bg-white p-3 rounded-lg shadow">
          <p className="text-sm text-gray-500">Phone Number</p>
          {edit ? (
            <input
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleChange}
              className="border p-1 rounded w-full mt-1"
            />
          ) : (
            <p className="mt-1 text-gray-900">{profile.phoneNumber}</p>
          )}
        </div>

        {/* Email */}
        <div className="bg-white p-3 rounded-lg shadow">
          <p className="text-sm text-gray-500">Email</p>
          {edit ? (
            <input
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              className="border p-1 rounded w-full mt-1"
              placeholder="Required"
            />
          ) : (
            <p className={`mt-1 ${profile.email ? 'text-gray-900' : 'text-orange-500'}`}>
              {profile.email || 'Required'}
            </p>
          )}
        </div>

        {/* Gender */}
        <div className="bg-white p-3 rounded-lg shadow">
          <p className="text-sm text-gray-500">Gender</p>
          {edit ? (
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="border p-1 rounded w-full mt-1"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          ) : (
            <p className="mt-1 text-gray-900">{profile.gender}</p>
          )}
        </div>

        {/* DOB */}
        <div className="bg-white p-3 rounded-lg shadow">
          <p className="text-sm text-gray-500">Date of Birth</p>
          {edit ? (
            <input
              name="dateOfBirth"
              type="date"
              value={profile.dateOfBirth}
              onChange={handleChange}
              className="border p-1 rounded w-full mt-1"
            />
          ) : (
            <p className={`mt-1 ${profile.dateOfBirth ? 'text-gray-900' : 'text-orange-500'}`}>
              {profile.dateOfBirth
                ? new Date(profile.dateOfBirth).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'Required'}
            </p>
          )}
        </div>

        {/* Member Since */}
        <div className="bg-white p-3 rounded-lg shadow">
          <p className="text-sm text-gray-500">Member Since</p>
          <p className="mt-1 text-gray-900">{profile.memberSince}</p>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white p-3 rounded-lg shadow">
          <p className="text-sm text-gray-500">Emergency Contact</p>
          {edit ? (
            <div className="mt-1 space-y-1">
              <input
                name="emergencyContact.name"
                value={profile.emergencyContact.name}
                onChange={handleChange}
                className="border p-1 rounded w-full"
                placeholder="Name"
              />
              <input
                name="emergencyContact.phoneNumber"
                value={profile.emergencyContact.phoneNumber}
                onChange={handleChange}
                className="border p-1 rounded w-full"
                placeholder="Phone"
              />
              <input
                name="emergencyContact.relationship"
                value={profile.emergencyContact.relationship}
                onChange={handleChange}
                className="border p-1 rounded w-full"
                placeholder="Relationship"
              />
            </div>
          ) : profile.emergencyContact.name ? (
            <p className="mt-1 text-gray-900">
              {profile.emergencyContact.name} – {profile.emergencyContact.phoneNumber} (
              {profile.emergencyContact.relationship})
            </p>
          ) : (
            <p className="mt-1 text-orange-500">Required</p>
          )}
        </div>

        {/* Buttons (non-floating) */}
        <div className="flex flex-col space-y-2 pt-4">
          {edit ? (
            <button
              onClick={() => setEdit(false)}
              className="w-full bg-gray-300 text-gray-800 py-2 rounded"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => setEdit(true)}
              className="w-full bg-black text-white py-2 rounded"
            >
              Edit
            </button>
          )}
          <button
            onClick={logout}
            className="w-full bg-red-600 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
