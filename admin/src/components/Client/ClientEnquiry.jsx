import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import instance from '../../utils/axios';
import ConfirmationModal from '../common/ConfirmationModal';

const ClientEnquiry = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    status: '',
  });

  const [modal, setModal] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    filterTable();
  }, [filters, data]);

  const fetchEnquiries = async () => {
    try {
      const res = await instance.get('/admin/enquiry');
      setData(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    }
  };

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filterTable = () => {
    const { name, email, phone, date, status } = filters;
    const result = data.filter((entry) => {
      const entryDate = entry.createdAt?.slice(0, 10);
      return (
        entry.name?.toLowerCase().includes(name.toLowerCase()) &&
        entry.email?.toLowerCase().includes(email.toLowerCase()) &&
        entry.phone?.includes(phone) &&
        (date === '' || entryDate === date) &&
        (status === '' || entry.status === status)
      );
    });
    setFiltered(result);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await instance.put(`/admin/enquiry/${id}/status`, { status: newStatus });
      toast.success(`Status updated to "${newStatus}"`);
      fetchEnquiries();
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update status");
    }
  };

  
  const handleDelete = (id) => {
    setModal({
      open: true,
      title: 'Delete Enquiry',
      message: 'Are you sure you want to delete this enquiry?',
      onConfirm: async () => {
        try {
          await instance.delete(`/admin/enquiry/${id}`);
          fetchEnquiries();
          toast.success("Enquiry deleted successfully");
        } catch (err) {
          console.error("Failed to delete:", err);
        }
      },
    });
  };

  const handleDownload = (row) => {
    setModal({
      open: true,
      title: 'Download CSV',
      message: 'Do you want to download this enquiry as CSV?',
      onConfirm: () => {
        const csv = `ID,Name,Email,Phone,Message,Service ID,Service Title,Created At\n"${row._id}","${row.name}","${row.email}","${row.phone}","${row.message}","${row.service}","${row.serviceTitle}","${row.createdAt}"\n`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `enquiry_${row.name.replace(/\s+/g, '_')}_${row._id}.csv`;
        a.click();
      },
    });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto bg-gray-100 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Client Enquiry</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input type="text" name="name" value={filters.name} onChange={handleInputChange} placeholder="Name" className="border px-3 py-2 rounded text-sm w-48" />
        <input type="email" name="email" value={filters.email} onChange={handleInputChange} placeholder="Email" className="border px-3 py-2 rounded text-sm w-48" />
        <input type="text" name="phone" value={filters.phone} onChange={handleInputChange} placeholder="Phone" className="border px-3 py-2 rounded text-sm w-40" />
        <input type="date" name="date" value={filters.date} onChange={handleInputChange} className="border px-3 py-2 rounded text-sm w-40" />
        <select name="status" value={filters.status} onChange={handleInputChange} className="border px-3 py-2 rounded text-sm w-48">
          <option value="">Filter by Status</option>
          <option value="Pending">Pending</option>
          <option value="Responded">Responded</option>
          <option value="Not Interested">Not Interested</option>
          <option value="Follow Up">Follow Up</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-[60vh] overflow-y-auto">
            <table className="min-w-full text-sm table-fixed">
              <thead className="bg-gray-700 text-white sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 w-32 text-left">Name</th>
                  <th className="px-4 py-3 w-40 text-left">Email</th>
                  <th className="px-4 py-3 w-36 text-left">Phone</th>
                  <th className="px-4 py-3 w-48 text-left">Message</th>
                  <th className="px-4 py-3 w-40 text-left">Service</th>
                  <th className="px-4 py-3 w-32 text-left">Date</th>
                  <th className="px-4 py-3 w-36 text-left">Status</th>
                  <th className="px-4 py-3 w-36 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((entry, i) => (
                  <tr key={entry._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3">{entry.name}</td>
                    <td className="px-4 py-3">{entry.email}</td>
                    <td className="px-4 py-3">{entry.phone}</td>
                    <td className="px-4 py-3">{entry.message}</td>
                    <td className="px-4 py-3">{entry.serviceTitle}</td>
                    <td className="px-4 py-3">{entry.createdAt?.slice(0, 10)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={entry.status || 'Pending'}
                        onChange={(e) => handleStatusChange(entry._id, e.target.value)}
                        className="border px-2 py-1 rounded text-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Responded">Responded</option>
                        <option value="Not Interested">Not Interested</option>
                        <option value="Follow Up">Follow Up</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(entry)}
                        className=" text-white rounded hover:bg-blue-600"
                      >
                        ⬇️
                      </button>
                      |
                      <button
                        onClick={() => handleDelete(entry._id)}
                        className=" text-white rounded hover:bg-red-600"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                      No enquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ConfirmationModal
        isOpen={modal.open}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onClose={() => setModal({ ...modal, open: false })}
      />
    </div>
  );
};

export default ClientEnquiry;



