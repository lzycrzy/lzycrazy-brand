// HiringApplicationsTable.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import instance from '../../utils/axios';

const HiringApplicationsTable = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  });

  // Filter states
  const [filters, setFilters] = useState({
    country: '',
    state: '',
    city: '',
    jobCategory: '',
    experienceLevel: '',
    status: '',
  });

  // Modal states for video viewing
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Expanded row for mobile view
  const [expandedRow, setExpandedRow] = useState(null);

  // Fetch applications data
  const fetchApplications = async (page = 1, currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = {
        page,
        limit: pagination.limit,
        ...Object.fromEntries(
          Object.entries(currentFilters).filter(
            ([_, value]) => value.trim() !== '',
          ),
        ),
      };

      const response = await instance.get('/hiring', { params });

      if (response.data.success) {
        console.log(response.data.data)
        setApplications(response.data.data);
        setPagination(response.data.pagination);
      } else {
        throw new Error(
          response.data.message || 'Failed to fetch applications',
        );
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch applications';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };
  const extractYouTubeID = (url) => {
    const regExp = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&#]+)/;
    const match = url?.match(regExp);
    return match && match[1] ? match[1] : '';
  };

  // Initial data fetch
  useEffect(() => {
    fetchApplications();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    // Reset to page 1 when filtering
    fetchApplications(1, newFilters);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchApplications(newPage);
    }
  };

  // Clear filters
  const clearFilters = () => {
    const emptyFilters = {
      country: '',
      state: '',
      city: '',
      jobCategory: '',
      experienceLevel: '',
      status: '',
    };
    setFilters(emptyFilters);
    fetchApplications(1, emptyFilters);
  };

  // Open video modal
  const openVideoModal = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setShowVideoModal(true);
  };

  // Close video modal
  const closeVideoModal = () => {
    setSelectedVideo(null);
    setShowVideoModal(false);
  };

  // Refresh data
  const refreshData = () => {
    fetchApplications(pagination.currentPage);
  };

  // Toggle expanded row for mobile
  const toggleExpandedRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  // Truncate text
  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  // Utility to generate thumbnail from Cloudinary video URL
  const getCloudinaryThumbnail = (videoUrl) => {
    if (!videoUrl) return '';
    return videoUrl
      .replace('/upload/', '/upload/so_1/')
      .replace(/\.\w+$/, '.jpg');
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
     
    });
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
      shortlisted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[status] || statusColors.pending}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                Hiring Applications
              </h1>
              <p className="text-sm text-gray-600">
                Total: {pagination.totalCount} applications
              </p>
            </div>
            <button
              onClick={refreshData}
              className="mt-4 flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:mt-0"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Filters</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <input
              type="text"
              name="country"
              value={filters.country}
              onChange={handleFilterChange}
              placeholder="Country"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              placeholder="State"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="City"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              name="jobCategory"
              value={filters.jobCategory}
              onChange={handleFilterChange}
              placeholder="Job Category"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <select
              name="experienceLevel"
              value={filters.experienceLevel}
              onChange={handleFilterChange}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">All Experience Levels</option>
              <option value="Fresher">Fresher</option>
              <option value="Junior">Junior</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior">Senior</option>
              <option value="Expert">Expert</option>
            </select>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button
            onClick={clearFilters}
            className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Clear All Filters
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center">
              <svg
                className="mr-2 h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium text-red-700">Error: {error}</span>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && applications.length === 0 && (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <svg
              className="mx-auto mb-4 h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No applications found
            </h3>
            <p className="text-gray-600">
              No hiring applications match your current filters.
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && applications.length > 0 && (
          <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
            {/* Desktop Table View */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Video
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Name
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Education
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Job Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Introduction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {applications.map((app, index) => {
                    const thumbnail = `https://img.youtube.com/vi/${app.videoUrl?.split('v=')[1] || ''}/0.jpg`;
                    return (
                      <tr key={app._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            onClick={() => openVideoModal(app.videoUrl)}
                            className="group relative cursor-pointer"
                          >
                            <img
                              src={getCloudinaryThumbnail(app.videoUrl)}
                              alt="Video thumbnail"
                              className="h-16 w-24 rounded border object-cover shadow"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                              <svg
                                className="h-6 w-6 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                          {app.name}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                          <div>
                            <div className="font-medium">
                              {app.city}, {app.state}
                            </div>
                            <div className="text-gray-500">{app.country}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                          {app.education}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                          {app.experienceLevel}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                          {app.jobCategory}
                        </td>
                        <td className="max-w-xs px-6 py-4 text-sm text-gray-900">
                          <div title={app.introduction}>
                            {truncateText(app.introduction, 80)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                          {formatDate(app.submittedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden">
              {applications.map((app, index) => {
                const thumbnail = `https://img.youtube.com/vi/${app.videoUrl?.split('v=')[1] || ''}/0.jpg`;
                return (
                  <div
                    key={app._id}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <div
                      className="cursor-pointer p-4 hover:bg-gray-50"
                      onClick={() => toggleExpandedRow(index)}
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {app.city}, {app.state}
                          </h3>
                          <p className="text-sm text-gray-600">{app.country}</p>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                          {app.experienceLevel} • {app.jobCategory}
                        </span>
                        <svg
                          className={`h-5 w-5 transition-transform ${expandedRow === index ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>

                    {expandedRow === index && (
                      <div className="border-t border-gray-200 bg-gray-50 px-4 pb-4">
                        <div className="mt-3 space-y-3">
                          <div>
                            <label className="mb-1 block text-xs font-medium tracking-wider text-gray-500 uppercase">
                              Application ID
                            </label>
                            <p className="font-mono text-xs text-gray-700">
                              {app._id}
                            </p>
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium tracking-wider text-gray-500 uppercase">
                              Education
                            </label>
                            <p className="text-sm text-gray-900">
                              {app.education}
                            </p>
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium tracking-wider text-gray-500 uppercase">
                              Introduction
                            </label>
                            <p className="text-sm text-gray-900">
                              {app.introduction}
                            </p>
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium tracking-wider text-gray-500 uppercase">
                              Video
                            </label>
                            <img
                              src={thumbnail}
                              alt="Video thumbnail"
                              className="w-full rounded"
                            />
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <button
                              onClick={() => openVideoModal(app.videoUrl)}
                              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            >
                              ▶ Watch Video
                            </button>
                            <span className="text-xs text-gray-500">
                              {formatDate(app.submittedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && applications.length > 0 && (
          <div className="mt-6 flex items-center justify-between rounded-lg border-t border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
                  pagination.hasPrevPage
                    ? 'bg-white text-gray-700 hover:bg-gray-50'
                    : 'cursor-not-allowed bg-gray-100 text-gray-400'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
                  pagination.hasNextPage
                    ? 'bg-white text-gray-700 hover:bg-gray-50'
                    : 'cursor-not-allowed bg-gray-100 text-gray-400'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(pagination.currentPage - 1) * pagination.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(
                      pagination.currentPage * pagination.limit,
                      pagination.totalCount,
                    )}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.totalCount}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className={`relative inline-flex items-center rounded-l-md border border-gray-300 px-2 py-2 text-sm font-medium ${
                      pagination.hasPrevPage
                        ? 'bg-white text-gray-500 hover:bg-gray-50'
                        : 'cursor-not-allowed bg-gray-100 text-gray-300'
                    }`}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Page numbers */}
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (
                        pagination.currentPage >=
                        pagination.totalPages - 2
                      ) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                            pageNum === pagination.currentPage
                              ? 'z-10 border-blue-500 bg-blue-50 text-blue-600'
                              : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    },
                  )}

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`relative inline-flex items-center rounded-r-md border border-gray-300 px-2 py-2 text-sm font-medium ${
                      pagination.hasNextPage
                        ? 'bg-white text-gray-500 hover:bg-gray-50'
                        : 'cursor-not-allowed bg-gray-100 text-gray-300'
                    }`}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-70"
    onClick={closeVideoModal} // Close when clicking outside modal
  >
    <div
      className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl p-6"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Introduction Video</h3>
        <button
          onClick={closeVideoModal}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Video Player */}
      <video
        src={selectedVideo}
        controls
        autoPlay
        className="w-full rounded-md max-h-[400px]"
      >
        Your browser does not support the video tag.
      </video>

      {/* Close Button at Bottom (optional) */}
      <div className="mt-4 text-right">
        <button
          onClick={closeVideoModal}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default HiringApplicationsTable;
