import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios/axiosInstance';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaVenusMars,
  FaEdit,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const iconMap = {
  bio: <FaUser className="inline mr-2 text-gray-600" />,
  email: <FaEnvelope className="inline mr-2 text-gray-600" />,
  phone: <FaPhone className="inline mr-2 text-gray-600" />,
  gender: <FaVenusMars className="inline mr-2 text-gray-600" />,
};

const AboutPage = ({ user }) => {
  const initialUserData = {
    bio: '',
    email: '',
    phone: '',
    gender: '',
  };

  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAbout = async () => {
      try {
        const res = await axios.get('/v1/users/about', {
          withCredentials: true,
        });

        const data = res.data;

        // Format date
        if (data.dateOfBirth) {
          data.dateOfBirth = new Date(data.dateOfBirth).toISOString().split('T')[0];
        }

        setUserData(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAbout();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (userData.bio.length > 500) return "Bio can't be longer than 500 characters.";
    if (userData.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userData.email))
      return 'Please enter a valid email address.';
    if (userData.phone && userData.phone.length > 15)
      return 'Phone number is too long.';
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSaving(true);
    try {
      const trimmedData = {};
      Object.entries(userData).forEach(([key, value]) => {
        trimmedData[key] = typeof value === 'string' ? value.trim() : value;
      });

      const res = await axios.put('/v1/users/about', trimmedData, {
        withCredentials: true,
      });

      setUserData(res.data);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(`Error saving data: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl">
      <div className="flex justify-between items-center mb-6 px-4 py-3 rounded-t-md bg-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          About
        </h2>

        {isEditing ? (
          <div className="space-x-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-7 py-1 rounded text-white ${
                saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={saving}
              className="bg-gray-300 text-gray-700 px-7 py-1 hover:bg-gray-400 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-white border border-gray-300 text-gray-800 px-7 py-1 shadow hover:bg-gray-50 rounded flex items-center gap-2"
          >
            <FaEdit />
            Edit
          </button>
        )}
      </div>

      <div className="px-6 pb-6 space-y-4">
        {Object.entries(userData).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between border-gray-200 pb-2"
          >
            <label
              htmlFor={key}
              className="capitalize font-semibold text-gray-700 flex items-center"
              style={{ minWidth: '180px' }}
            >
              {iconMap[key]}
              {key.replace(/([A-Z])/g, ' $1')}:
            </label>

            {isEditing ? (
              key === 'gender' ? (
                <select
                  id="gender"
                  name="gender"
                  value={userData.gender || ''}
                  onChange={handleChange}
                  className="flex-grow border border-gray-300 rounded px-3 py-1 text-gray-800"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Not Specified">Not Specified</option>
                </select>
              ) : (
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={value || ''}
                  onChange={handleChange}
                  className="flex-grow border border-gray-300 rounded px-3 py-1 text-gray-800"
                  placeholder={`Enter your ${key}`}
                />
              )
            ) : (
              <p className="text-gray-800 flex-grow text-right">
                {user?.profile?.[key] || value || <span className="text-gray-400">N/A</span>}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
