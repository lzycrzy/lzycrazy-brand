import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import instance from '../../utils/axios';
import ConfirmationModal from '../common/ConfirmationModal';

const ServiceList = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await instance.get('/services');
      setServices(response.data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      alert('Error fetching services');
    } finally {
      setLoading(false);
    }
  };

  const confirmEdit = (id) => {
    setModal({
      open: true,
      title: 'Edit Service',
      message: 'Do you want to edit this service?',
      onConfirm: () => navigate(`/edit-service/${id}`),
    });
  };

  const confirmDelete = (id) => {
    setModal({
      open: true,
      title: 'Delete Service',
      message: 'Are you sure you want to delete this service?',
      onConfirm: () => handleDelete(id),
    });
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Unauthorized: No token found. Please login again.');
        return;
      }

      await instance.delete(`/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setServices((prev) => prev.filter((service) => service._id !== id));
    } catch (err) {
      console.error('Error deleting service:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto bg-gray-100 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Services</h2>

      <div className="bg-white shadow rounded overflow-hidden">
        {loading ? (
          <p className="p-4 text-gray-600">Loading services...</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="min-w-full text-sm table-fixed">
                <thead className="bg-gray-700 text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 w-28 text-left">Icon</th>
                    <th className="px-4 py-3 w-64 text-left">Heading</th>
                    <th className="px-4 py-3 w-96 text-left">Description</th>
                    <th className="px-4 py-3 w-32 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {services.length > 0 ? (
                    services.map((service, i) => (
                      <tr key={service._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3">
                          <img
                            src={service.icon?.component}
                            alt="icon"
                            className="w-10 h-10 rounded object-cover border"
                          />
                        </td>
                        <td className="px-4 py-3 text-gray-800 font-semibold">{service.title}</td>
                        <td className="px-4 py-3 text-gray-600">{service.description}</td>
                        <td className="px-4 py-3 space-x-2">
                          <button
                            onClick={() => confirmEdit(service._id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => confirmDelete(service._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-gray-500 py-6">
                        No services found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

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

export default ServiceList;

