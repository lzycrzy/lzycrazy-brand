import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Upload, UserPlus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const UserTable = () => {
  // Sample user data
  const [users] = useState([
    {
      id: 1,
      name: "John Smith",
      idNumber: "Ic04250006",
      mobile: "7457024843",
      email: "john.smith@gmail.com",
      address: "Moradabad Uttar Pradesh",
      status: "Active",
      lastActive: "1 minute ago",
      role: "Admin",
      joinDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      idNumber: "Ic04250007",
      mobile: "7457024841",
      email: "sarah.johnson@gmail.com",
      address: "Delhi NCR",
      status: "Active",
      lastActive: "10 minutes ago",
      role: "User",
      joinDate: "2024-02-10"
    },
    {
      id: 3,
      name: "Mike Wilson",
      idNumber: "Ic04250008",
      mobile: "7457024842",
      email: "mike.wilson@gmail.com",
      address: "Mumbai Maharashtra",
      status: "Banned",
      lastActive: "4 days ago",
      role: "Moderator",
      joinDate: "2023-12-05"
    },
    {
      id: 4,
      name: "Emily Davis",
      idNumber: "Ic04250009",
      mobile: "7457024844",
      email: "emily.davis@gmail.com",
      address: "Bangalore Karnataka",
      status: "Pending",
      lastActive: "1 minute ago",
      role: "User",
      joinDate: "2024-03-20"
    },
    {
      id: 5,
      name: "Alex Brown",
      idNumber: "Ic04250010",
      mobile: "7457024845",
      email: "alex.brown@gmail.com",
      address: "Chennai Tamil Nadu",
      status: "Suspended",
      lastActive: "3 months ago",
      role: "User",
      joinDate: "2023-10-12"
    },
    {
      id: 6,
      name: "Lisa Anderson",
      idNumber: "Ic04250011",
      mobile: "7457024846",
      email: "lisa.anderson@gmail.com",
      address: "Pune Maharashtra",
      status: "Active",
      lastActive: "5 minutes ago",
      role: "Admin",
      joinDate: "2024-01-30"
    },
    {
      id: 7,
      name: "David Miller",
      idNumber: "Ic04250012",
      mobile: "7457024847",
      email: "david.miller@gmail.com",
      address: "Hyderabad Telangana",
      status: "Active",
      lastActive: "7 minutes ago",
      role: "Moderator",
      joinDate: "2024-02-28"
    },
    {
      id: 8,
      name: "Jessica Garcia",
      idNumber: "Ic04250013",
      mobile: "7457024848",
      email: "jessica.garcia@gmail.com",
      address: "Kolkata West Bengal",
      status: "Banned",
      lastActive: "1 hour ago",
      role: "User",
      joinDate: "2023-11-18"
    },
    {
      id: 9,
      name: "Robert Taylor",
      idNumber: "Ic04250014",
      mobile: "7457024849",
      email: "robert.taylor@gmail.com",
      address: "Ahmedabad Gujarat",
      status: "Active",
      lastActive: "2 minutes ago",
      role: "User",
      joinDate: "2024-03-05"
    },
    {
      id: 10,
      name: "Amanda White",
      idNumber: "Ic04250015",
      mobile: "7457024850",
      email: "amanda.white@gmail.com",
      address: "Jaipur Rajasthan",
      status: "Pending",
      lastActive: "52 minutes ago",
      role: "User",
      joinDate: "2024-03-25"
    },
    {
      id: 10,
      name: "Amanda White",
      idNumber: "Ic04250015",
      mobile: "7457024850",
      email: "amanda.white@gmail.com",
      address: "Jaipur Rajasthan",
      status: "Pending",
      lastActive: "52 minutes ago",
      role: "User",
      joinDate: "2024-03-25"
    }
  ]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dropdown states
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  // Get unique values for filters
  const roles = [...new Set(users.map(user => user.role))];
  const statuses = [...new Set(users.map(user => user.status))];
  const dateOptions = ["Last 7 days", "Last 30 days", "Last 90 days", "This year"];

  // Filter and search logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchTerm === "" || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile.includes(searchTerm) ||
        user.idNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === "" || user.role === roleFilter;
      const matchesStatus = statusFilter === "" || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage);

  // Status badge styles
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

  // Generate avatar placeholder
  const getAvatarUrl = (name) => {
    const initials = name.split(' ').map(n => n[0]).join('');
    return `https://ui-avatars.com/api/?name=${initials}&background=344054&color=fff&size=32`;
  };

  const handleEdit = (userId) => {
    console.log('Edit user:', userId);
  };

  const handleDelete = (userId) => {
    console.log('Delete user:', userId);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("");
    setStatusFilter("");
    setDateFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="bg-slate-50 text-slate-700 min-h-screen p-4 sm:p-6 md:p-10">
      <div className="max-w-full overflow-x-auto">
        {/* Header with filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0 mb-6">
          {/* Search Input */}
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

          {/* Role Filter */}
          <div className="relative">
            <button
              className="flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 focus:outline-none"
              type="button"
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            >
              {roleFilter || "Role"}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showRoleDropdown && (
              <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-slate-300 rounded-lg shadow-lg z-10">
                <button
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100"
                  onClick={() => {
                    setRoleFilter("");
                    setShowRoleDropdown(false);
                  }}
                >
                  All Roles
                </button>
                {roles.map(role => (
                  <button
                    key={role}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100"
                    onClick={() => {
                      setRoleFilter(role);
                      setShowRoleDropdown(false);
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              className="flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 focus:outline-none"
              type="button"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              {statusFilter || "Status"}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-slate-300 rounded-lg shadow-lg z-10">
                <button
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100"
                  onClick={() => {
                    setStatusFilter("");
                    setShowStatusDropdown(false);
                  }}
                >
                  All Status
                </button>
                {statuses.map(status => (
                  <button
                    key={status}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100"
                    onClick={() => {
                      setStatusFilter(status);
                      setShowStatusDropdown(false);
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Filter */}
          <div className="relative">
            <button
              className="flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 focus:outline-none"
              type="button"
              onClick={() => setShowDateDropdown(!showDateDropdown)}
            >
              {dateFilter || "Date"}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showDateDropdown && (
              <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-slate-300 rounded-lg shadow-lg z-10">
                <button
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100"
                  onClick={() => {
                    setDateFilter("");
                    setShowDateDropdown(false);
                  }}
                >
                  All Dates
                </button>
                {dateOptions.map(option => (
                  <button
                    key={option}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100"
                    onClick={() => {
                      setDateFilter(option);
                      setShowDateDropdown(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {(searchTerm || roleFilter || statusFilter || dateFilter) && (
            <button
              className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 ml-auto sm:ml-0">
            <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 focus:outline-none">
              <Upload className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-800 focus:outline-none">
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-slate-600">
          Showing {paginatedUsers.length} of {filteredUsers.length} users
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold">Sl No</th>
                <th className="px-3 py-3 text-left text-xs font-semibold">Profile</th>
                <th className="px-3 py-3 text-left text-xs font-semibold">Name</th>
                <th className="px-3 py-3 text-left text-xs font-semibold">ID Number</th>
                <th className="px-3 py-3 text-left text-xs font-semibold">Mobile No.</th>
                <th className="px-3 py-3 text-left text-xs font-semibold">Email</th>
                <th className="px-3 py-3 text-left text-xs font-semibold">Address</th>
                <th className="px-3 py-3 text-left text-xs font-semibold">Status</th>
                <th className="px-3 py-3 text-left text-xs font-semibold">Last Active</th>
                <th className="px-3 py-3 text-left text-xs font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-3 py-3 text-slate-500 font-medium">
                    {String(startIndex + index + 1).padStart(2, '0')}
                  </td>
                  <td className="px-3 py-3">
                    <img
                      alt={`Profile picture of ${user.name}`}
                      className="rounded-full"
                      height="32"
                      src={getAvatarUrl(user.name)}
                      width="32"
                    />
                  </td>
                  <td className="px-3 py-3 font-semibold text-slate-800">
                    {user.name}
                  </td>
                  <td className="px-3 py-3 text-slate-500">
                    {user.idNumber}
                  </td>
                  <td className="px-3 py-3 text-slate-500">
                    {user.mobile}
                  </td>
                  <td className="px-3 py-3 text-slate-500">
                    {user.email}
                  </td>
                  <td className="px-3 py-3 text-slate-500">
                    {user.address}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-500">
                    {user.lastActive}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center space-x-3 text-slate-500">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="hover:text-slate-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 text-xs text-slate-500">
          <div className="mb-2 sm:mb-0">
            Rows per page: {rowsPerPage}
          </div>
          <div>
            {startIndex + 1}-{Math.min(startIndex + rowsPerPage, filteredUsers.length)} of {filteredUsers.length} rows
          </div>
          <nav className="inline-flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 rounded-full border border-slate-300 text-slate-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs ${
                    currentPage === pageNum
                      ? 'border-slate-700 bg-slate-700 text-white'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 rounded-full border border-slate-300 text-slate-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default UserTable;