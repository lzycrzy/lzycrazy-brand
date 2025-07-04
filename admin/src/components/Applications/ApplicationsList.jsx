// import React, { useEffect, useState } from "react";
// import { FaPlay, FaTrash } from "react-icons/fa";
// import ApplicationModal from "./ApplicationModal";
// import instance from "../../utils/axios";
// import { toast } from "react-toastify";

// const ApplicationsList = () => {
//   const [applications, setApplications] = useState([]);
//   const [filteredApps, setFilteredApps] = useState([]);
//   const [selectedApp, setSelectedApp] = useState(null);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [dateFilter, setDateFilter] = useState("");

//   const fetchApplications = async () => {
//     try {
//       const res = await instance.get("/admin/applications");
//       setApplications(res.data);
//       setFilteredApps(res.data);
//     } catch (err) {
//       console.error("Error fetching applications", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await instance.delete(`/admin/applications/${id}`);
//       const updated = applications.filter((a) => a._id !== id);
//       setApplications(updated);
//       applyFilters(updated, search, statusFilter, dateFilter);
//       toast.success("Application deleted");
//     } catch (err) {
//       console.error("Delete failed", err);
//       toast.error("Failed to delete application");
//     }
//   };

//   const handleStatusChange = async (id, newStatus) => {
//     try {
//       await instance.put(`/hiring/${id}/status`, { status: newStatus });
//       toast.success("Status updated");
//       fetchApplications();
//     } catch (err) {
//       console.error("Status update failed", err.response?.data || err.message);
//       toast.error("Failed to update status");
//     }
//   };

//   const applyFilters = (apps, keyword, status, date) => {
//     const filtered = apps.filter((app) => {
//       const matchesKeyword =
//         app.name?.toLowerCase().includes(keyword) ||
//         app.email?.toLowerCase().includes(keyword) ||
//         app.companyId?.toLowerCase().includes(keyword);

//       const matchesStatus = status ? app.status === status : true;

//       const matchesDate = date
//         ? new Date(app.submittedAt).toISOString().split("T")[0] === date
//         : true;

//       return matchesKeyword && matchesStatus && matchesDate;
//     });

//     setFilteredApps(filtered);
//   };

//   const handleSearchChange = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearch(value);
//     applyFilters(applications, value, statusFilter, dateFilter);
//   };

//   const handleStatusFilterChange = (e) => {
//     const value = e.target.value;
//     setStatusFilter(value);
//     applyFilters(applications, search, value, dateFilter);
//   };

//   const handleDateChange = (e) => {
//     const value = e.target.value;
//     setDateFilter(value);
//     applyFilters(applications, search, statusFilter, value);
//   };

//   useEffect(() => {
//     fetchApplications();
//   }, []);

//   return (
//     <div className="p-4 max-w-7xl mx-auto bg-gray-100 rounded shadow">
//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 my-4">
//         <input
//           type="text"
//           value={search}
//           onChange={handleSearchChange}
//           placeholder="Search name, email, ID"
//           className="px-3 py-2 border border-gray-300 rounded w-64"
//         />
//         <select
//           value={statusFilter}
//           onChange={handleStatusFilterChange}
//           className="px-3 py-2 border border-gray-300 rounded w-48"
//         >
//           <option value="">Filter by Status</option>
//           <option value="Pending">Pending</option>
//           <option value="Reviewed">Reviewed</option>
//           <option value="Shortlisted">Shortlisted</option>
//           <option value="Rejected">Rejected</option>
//         </select>
//         <input
//           type="date"
//           value={dateFilter}
//           onChange={handleDateChange}
//           className="px-3 py-2 border border-gray-300 rounded w-44"
//         />
//       </div>

//       {/* Table with sticky header and vertical scroll */}
//       <div className="bg-white rounded-lg shadow-sm overflow-auto max-h-[460px] border border-gray-200">
//         <table className="min-w-full table-fixed">
//           <thead className="bg-gray-600 text-white sticky top-0 z-10">
//             <tr>
//               <th className="px-4 py-3 text-left text-sm font-semibold w-28">Video</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold w-32">Name</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold w-32">ID</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold w-40">Email</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold w-32">Job Category</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold w-40">Response</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold w-32">Submitted</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold w-20">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 bg-white">
//             {filteredApps.length > 0 ? (
//               filteredApps.map((app, index) => (
//                 <tr
//                   key={app._id}
//                   className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                   onClick={() => setSelectedApp(app)}
//                 >
//                   <td className="px-4 py-3 text-sm">
//                     <div className="w-20 h-12 bg-gray-200 rounded overflow-hidden">
//                       {app.videoUrl ? (
//                         <video
//                           src={app.videoUrl}
//                           className="w-full h-full object-cover"
//                           controls
//                         />
//                       ) : (
//                         <div className="w-full h-full bg-blue-900 flex items-center justify-center">
//                           <FaPlay className="w-4 h-4 text-white" />
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                   <td className="py-3 text-sm text-gray-900">{app.name}</td>
//                   <td className="py-3 text-sm text-gray-700">{app.companyId}</td>
//                   <td className="py-3 text-sm text-gray-700">{app.email}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">{app.jobCategory}</td>
//                   <td className="py-3 text-sm text-gray-700">
//                     <select
//                       value={app.status}
//                       onClick={(e) => e.stopPropagation()}
//                       onChange={(e) => handleStatusChange(app._id, e.target.value)}
//                       className="border rounded px-2 py-1 text-sm"
//                     >
//                       <option value="Pending">Pending</option>
//                       <option value="Reviewed">Reviewed</option>
//                       <option value="Shortlisted">Shortlisted</option>
//                       <option value="Rejected">Rejected</option>
//                     </select>
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     {new Date(app.submittedAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-4 py-3 text-sm">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleDelete(app._id);
//                       }}
//                       className="text-red-600 hover:text-red-800 flex items-center gap-1"
//                     >
//                       <FaTrash className="w-4 h-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" className="text-center py-4 text-gray-500">
//                   No applications found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal */}
//       {selectedApp && (
//         <ApplicationModal
//           application={selectedApp}
//           onClose={() => setSelectedApp(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default ApplicationsList;



import React, { useEffect, useState } from "react";
import { FaPlay, FaTrash } from "react-icons/fa";
import ApplicationModal from "./ApplicationModal";
import instance from "../../utils/axios";
import { toast } from "react-toastify";

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const fetchApplications = async () => {
    try {
      const res = await instance.get("/admin/applications");
      setApplications(res.data);
      setFilteredApps(res.data);
    } catch (err) {
      console.error("Error fetching applications", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/admin/applications/${id}`);
      const updated = applications.filter((a) => a._id !== id);
      setApplications(updated);
      applyFilters(updated, search, statusFilter, dateFilter, countryFilter, stateFilter, cityFilter);
      toast.success("Application deleted");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete application");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await instance.put(`/hiring/${id}/status`, { status: newStatus });
      toast.success("Status updated");
      fetchApplications();
    } catch (err) {
      console.error("Status update failed", err.response?.data || err.message);
      toast.error("Failed to update status");
    }
  };

  const applyFilters = (apps, keyword, status, date, country, state, city, phone) => {
    const filtered = apps.filter((app) => {
      const matchesKeyword =
        app.name?.toLowerCase().includes(keyword) ||
        app.email?.toLowerCase().includes(keyword) ||
        app.companyId?.toLowerCase().includes(keyword) ||
        app.phone?.toLowerCase().includes(keyword);

      const matchesStatus = status ? app.status === status : true;

      const matchesDate = date
        ? new Date(app.submittedAt).toISOString().split("T")[0] === date
        : true;

      const matchesCountry = country ? app.country?.toLowerCase() === country.toLowerCase() : true;
      const matchesState = state ? app.state?.toLowerCase() === state.toLowerCase() : true;
      const matchesCity = city ? app.city?.toLowerCase() === city.toLowerCase() : true;

      return matchesKeyword && matchesStatus && matchesDate && matchesCountry && matchesState && matchesCity;
    });

    setFilteredApps(filtered);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    applyFilters(applications, value, statusFilter, dateFilter, countryFilter, stateFilter, cityFilter);
  };

  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    applyFilters(applications, search, value, dateFilter, countryFilter, stateFilter, cityFilter);
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setDateFilter(value);
    applyFilters(applications, search, statusFilter, value, countryFilter, stateFilter, cityFilter);
  };

  const handleCountryChange = (e) => {
    const value = e.target.value;
    setCountryFilter(value);
    applyFilters(applications, search, statusFilter, dateFilter, value, stateFilter, cityFilter);
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    setStateFilter(value);
    applyFilters(applications, search, statusFilter, dateFilter, countryFilter, value, cityFilter);
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCityFilter(value);
    applyFilters(applications, search, statusFilter, dateFilter, countryFilter, stateFilter, value);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="p-4 max-w-7xl mx-auto bg-gray-100 rounded shadow">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 my-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="name, email, ID, phone"
          className="px-3 py-2 border border-gray-300 rounded w-55"
        />

        <input
          type="text"
          value={countryFilter}
          onChange={handleCountryChange}
          placeholder="Filter by Country"
          className="px-3 py-2 border border-gray-300 rounded w-42"
        />
        <input
          type="text"
          value={stateFilter}
          onChange={handleStateChange}
          placeholder="Filter by State"
          className="px-3 py-2 border border-gray-300 rounded w-42"
        />
        <input
          type="text"
          value={cityFilter}
          onChange={handleCityChange}
          placeholder="Filter by City"
          className="px-3 py-2 border border-gray-300 rounded w-42"
        />

        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="px-3 py-2 border border-gray-300 rounded w-40"
        >
          <option value="">Filter by Status</option>
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={handleDateChange}
          className="px-3 py-2 border border-gray-300 rounded w-40"
        />
      </div>

      {/* Table with sticky header and vertical scroll */}
      <div className="bg-white rounded-lg shadow-sm overflow-auto max-h-[460px] border border-gray-200">
        <table className="min-w-full table-fixed">
          <thead className="bg-gray-600 text-white sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold w-28">Video</th>
              <th className="px-4 py-3 text-left text-sm font-semibold w-32">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold w-32">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold w-40">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold w-32">Job Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold w-40">Response</th>
              <th className="px-4 py-3 text-left text-sm font-semibold w-32">Submitted</th>
              <th className="px-4 py-3 text-left text-sm font-semibold w-20">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredApps.length > 0 ? (
              filteredApps.map((app, index) => (
                <tr
                  key={app._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  onClick={() => setSelectedApp(app)}
                >
                  <td className="px-4 py-3 text-sm">
                    <div className="w-20 h-12 bg-gray-200 rounded overflow-hidden">
                      {app.videoUrl ? (
                        <video
                          src={app.videoUrl}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-900 flex items-center justify-center">
                          <FaPlay className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-sm text-gray-900">{app.name}</td>
                  <td className="py-3 text-sm text-gray-700">{app.companyId}</td>
                  <td className="py-3 text-sm text-gray-700">{app.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{app.jobCategory}</td>
                  <td className="py-3 text-sm text-gray-700">
                    <select
                      value={app.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(app.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(app._id);
                      }}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedApp && (
        <ApplicationModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
};

export default ApplicationsList;


