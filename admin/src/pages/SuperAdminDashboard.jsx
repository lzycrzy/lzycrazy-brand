import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartColumnIncreasing,
  Megaphone,
  User,
  User2,
  User2Icon,
  UserPlus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios'; // tu already import kar raha hai

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [dateRange, setDateRange] = useState('Monthly');
const [usersData, setUsersData] = useState([]);
const [totalUsers, setTotalUsers] = useState(0);
const [filteredUsers, setFilteredUsers] = useState([]);
useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/admin/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // overview ke data ko set karo
      const overview = res.data?.data?.overview;
      setTotalUsers(overview?.totalUsers || 0);

      // agar future me recentUsers ka use karna ho to:
      // const recentUsers = res.data?.data?.userStats?.recentUsers || [];

    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
  };

  fetchDashboardData();
}, []);

useEffect(() => {
  let filtered = usersData;

  if (country) filtered = filtered.filter((u) => u.country === country);
  if (state) filtered = filtered.filter((u) => u.state === state);
  if (city) filtered = filtered.filter((u) => u.city === city);

  setFilteredUsers(filtered);
}, [country, state, city, usersData]);


  // Monthly group logic
 const chartData = Array.from({ length: 12 }, (_, i) => ({
  name: new Date(0, i).toLocaleString('default', { month: 'short' }),
  users: filteredUsers.filter(
    (user) => new Date(user.createdAt).getMonth() === i
  ).length,
}));


 const uniqueCountries = [...new Set(usersData.map((u) => u.country))];
const uniqueStates = [
  ...new Set(usersData.filter((u) => u.country === country).map((u) => u.state)),
];
const uniqueCities = [
  ...new Set(usersData.filter((u) => u.state === state).map((u) => u.city)),
];


  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <h2 className="mb-5 text-xl font-bold">Dashboard</h2>

      {/* Top Section */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
      className="flex cursor-pointer items-center gap-2 rounded-md bg-blue-50 p-4 hover:bg-blue-100 transition"
      onClick={() => navigate('/dashboard/users')}
    >
      <User2 className="text-blue-600" />
      <div>
        <p className="text-sm">User</p>
        <p className="text-lg font-bold">{totalUsers}</p>
      </div>
    </div>
        <div className="flex items-center gap-2 rounded-md bg-gray-200 p-4">
          <div className="rounded-full bg-orange-100 p-3">
            <Megaphone className="text-orange-300" />
          </div>
          <div>
            <p className="text-sm">Ads</p>
            <p className="text-lg font-bold">0</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-orange-100 p-4">
          <div className="rounded-full bg-green-100 p-3">
            <UserPlus className="text-green-500" />
          </div>
          <div>
            <p className="text-sm">Business Profile</p>
            <p className="text-lg font-bold">0</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-blue-100 p-4">
          <div className="rounded-full bg-green-100 p-3">
            <img
              src="./Banner-Logo.png"
              className="h-5 w-5"
              alt="Banner Logo"
            />
          </div>
          <div>
            <p className="text-sm">Banners</p>
            <p className="text-lg font-bold">0</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Country */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="country">Select Country</label>
            <span>{uniqueCountries.length}</span>
          </div>
          <select
            onChange={(e) => setCountry(e.target.value)}
            value={country}
            className="w-full rounded border p-2"
          >
            <option value="">Select Country</option>
            {uniqueCountries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* State */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="state">Select State</label>
            <span>{uniqueStates.length}</span>
          </div>
          <select
            onChange={(e) => setState(e.target.value)}
            value={state}
            className="w-full rounded border p-2"
          >
            <option value="">Select State</option>
            {uniqueStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="city">Select City</label>
            <span>{uniqueCities.length}</span>
          </div>
          <select
            onChange={(e) => setCity(e.target.value)}
            value={city}
            className="w-full rounded border p-2"
          >
            <option value="">Select City</option>
            {uniqueCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="dateRange">Select Date Range</label>
          </div>
          <select
            onChange={(e) => setDateRange(e.target.value)}
            value={dateRange}
            className="w-full rounded border p-2"
          >
            <option value="Monthly">Monthly</option>
            <option value="Weekly">Weekly</option>
            <option value="Daily">Daily</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded bg-white p-4 shadow">
        <h3 className="mb-4 text-lg font-semibold">
          <span className="flex items-center gap-2">
            <ChartColumnIncreasing className="h-10 w-10 rounded-full border-4 border-blue-600 p-1 text-blue-600" />
            User This Year: {filteredUsers.length}
          </span>
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="users" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
