import React, { useState, useEffect } from 'react';
import axios from '../lib/axios/axiosInstance';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaVenusMars,
  FaGlobe,
  FaHeart,
  FaLink,
  FaTint,
  FaMusic,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaBriefcase,
  FaEdit,
} from 'react-icons/fa';

const initialUserData = {
  bio: '',
  email: '',
  phone: '',
  gender: '',
  country: '',
  relationshipStatus: '',
  website: '',
  bloodGroup: '',
  hobbies: '',
  location: '',
  dateOfBirth: '',
  profession: '',
};

const iconMap = {
  bio: <FaUser className="inline mr-2 text-gray-600" />,
  email: <FaEnvelope className="inline mr-2 text-gray-600" />,
  phone: <FaPhone className="inline mr-2 text-gray-600" />,
  gender: <FaVenusMars className="inline mr-2 text-gray-600" />,
  country: <FaGlobe className="inline mr-2 text-gray-600" />,
  relationshipStatus: <FaHeart className="inline mr-2 text-gray-600" />,
  website: <FaLink className="inline mr-2 text-gray-600" />,
  bloodGroup: <FaTint className="inline mr-2 text-gray-600" />,
  hobbies: <FaMusic className="inline mr-2 text-gray-600" />,
  location: <FaMapMarkerAlt className="inline mr-2 text-gray-600" />,
  dateOfBirth: <FaBirthdayCake className="inline mr-2 text-gray-600" />,
  profession: <FaBriefcase className="inline mr-2 text-gray-600" />,
};

const AboutPage = () => {
  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user about data on mount
  useEffect(() => {
    const fetchUserAbout = async () => {
      try {
        const res = await axios.get('/v1/users/about',
            {withCredentials: true,}
        );
        // Format dateOfBirth to yyyy-MM-dd for input[type=date]
        if (res.data.dateOfBirth) {
          res.data.dateOfBirth = new Date(res.data.dateOfBirth)
            .toISOString()
            .split('T')[0];
        }
        setUserData(res.data);
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
      return "Please enter a valid email address.";
    if (userData.phone && userData.phone.length > 15)
      return "Phone number is too long.";
    // Add more validation as needed
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      alert(validationError);
      return;
    }

    setSaving(true);
    try {
      // Trim all string fields before sending
      const trimmedData = {};
      Object.entries(userData).forEach(([key, value]) => {
        trimmedData[key] = typeof value === 'string' ? value.trim() : value;
      });

      const res = await axios.put(
        '/v1/users/about',
        trimmedData,
        {withCredentials: true,},
        
      );

      const savedData = res.data;

      // Format dateOfBirth for comparison
      const normalizeDate = (d) =>
        d ? new Date(d).toISOString().split('T')[0] : '';

      const isDataMatching = Object.keys(trimmedData).every((key) => {
        if (key === 'dateOfBirth') {
          return normalizeDate(trimmedData[key]) === normalizeDate(savedData[key]);
        }
        return trimmedData[key] === (savedData[key] ?? '');
      });

      if (isDataMatching) {
        console.log('Save verified: User About data saved successfully.');
        setUserData(res.data);
        setIsEditing(false);
      } else {
        console.warn('Warning: Saved data does not match current data.');
      }
    } catch (err) {
      alert(`Error saving data: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-6">Loading user info...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl">
      {/* Header */}
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

      {/* Data fields */}
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
              key === 'dateOfBirth' ? (
                <input
                  type="date"
                  id={key}
                  name={key}
                  value={value || ''}
                  onChange={handleChange}
                  className="flex-grow border border-gray-300 rounded px-3 py-1 text-gray-800"
                />
              ) : (
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={value || ''}
                  onChange={handleChange}
                  placeholder={`Enter your ${key.replace(/([A-Z])/g, ' $1')}`}
                  className="flex-grow border border-gray-300 rounded px-3 py-1 text-gray-800"
                />
              )
            ) : (
              <p className="text-gray-800 flex-grow text-right">
                {value || <span className="text-gray-400">N/A</span>}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
