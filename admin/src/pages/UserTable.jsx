import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import instance from '../utils/axios';

const UserTable = () => {
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No token found, please log in.');
        }
        console.log('Token:', token);
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          console.log('Decoded Token:', decoded);
        } catch (err) {
          console.error('Invalid token structure');
        }
        const response = await instance.get('/admin/userslist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
            limit: rowsPerPage,
          },
        });

        setUsers(response.data.users);
        setTotalUsers(response.data.pagination.totalUsers);
        setTotalPages(response.data.pagination.totalPages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(`Failed to fetch users: ${err?.response?.data?.message || err?.message}`);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, rowsPerPage]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return (
        searchTerm === '' ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [users, searchTerm]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500 text-white';
      case 'Banned':
        return 'bg-red-500 text-white';
      case 'Pending':
        return 'bg-yellow-500 text-white';
      case 'Suspended':
        return 'bg-orange-500 bg-opacity-50 text-orange-800';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleEdit = (userId) => {
    console.log('Edit user:', userId);
  };

  // Handle Delete user
  const handleDelete = (userId) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const token = localStorage.getItem('token');
              if (!token) {
                throw new Error('No token found, please log in.');
              }

              const response = await instance.delete(`/admin/user/delete/${userId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (response.data.success) {
                setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
               
              } else {
                console.error('Failed to delete the user.');
              }
            } catch (err) {
              console.error('Error deleting user:', err);
            }
          },
        },
        {
          label: 'No',
          onClick: () => {
            console.log('User cancellation');
          },
        },
      ],
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="bg-slate-50 text-slate-700 min-h-screen p-4 sm:p-6 md:p-10">
      <div className="max-w-full overflow-x-auto">
        {/* Header with search filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0 mb-6">
          <div className="relative flex items-center w-full max-w-xs">
            <input
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-700"
              placeholder="Search users..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 text-slate-500 w-4 h-4" />
          </div>
        </div>

        {/* Loading or Error */}
        {loading && <div className="text-center text-gray-600">Loading...</div>}
        {error && <div className="text-center text-red-600">{error}</div>}

        {/* Results count */}
        <div className="mb-4 text-sm text-slate-600">
          Showing {filteredUsers.length} of {totalUsers} users
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold">Sl No</th>
                <th className="px-3 py-3 text-left text-xs font-semibold">Profile</th>
                <th className="px-3 py-3 text-left text-xs font-semibold">Name</th>
                <th className="px-3 py-3 text-left text-xs font-semibold">lc-Id</th>
                <th className="px-3 py-3 text-left text-xs font-semibold">Email</th>
                <th className="px-3 py-3 text-left text-xs font-semibold">Status</th>
                <th className="px-3 py-3 text-left text-xs font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.map((user, index) => (
                <tr key={user._id} className="hover:bg-slate-50">
                  <td className="px-3 py-3 text-slate-500 font-medium">
                    {String((currentPage - 1) * rowsPerPage + index + 1).padStart(2, '0')}
                  </td>
                  <td className="px-3 py-3">
                    <img
                      alt={`Profile picture of ${user.fullName}`}
                      className="rounded-full"
                      height="32"
                      src={user.image || 'https://ui-avatars.com/api/?name=User'}
                      width="32"
                    />
                  </td>
                  <td className="px-3 py-3 font-semibold text-slate-800">{user.fullName}</td>
                  <td className="px-3 py-3 font-semibold text-slate-800">{user.companyId}</td>
                  <td className="px-3 py-3 text-slate-500">{user.email}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center space-x-3 text-slate-500">
                      <button
                        onClick={() => handleEdit(user._id)}
                        className="hover:text-slate-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-slate-700 bg-white border rounded-md hover:bg-slate-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm text-slate-700 bg-white border rounded-md hover:bg-slate-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={clearFilters}
            className="px-3 py-1 text-sm text-slate-700 bg-white border rounded-md hover:bg-slate-200"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
