import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaThList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
;
import instance from '../../utils/axios';

const ServiceList = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleEdit = (id) => {
    // Navigate to add/edit page with ID (you should use this param in your AddServices component)
    navigate(`/edit-service/${id}`);
  };

  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      setLoading(true);

      if (imageUrl?.includes('cloudinary')) {
        await instance.delete('/image/delete', {
          data: { imageUrl }
        });
      }

      await instance.delete(`/services/${id}`);
      setServices(prev => prev.filter(service => service._id !== id));
      alert('Service deleted');
    } catch (err) {
      console.error('Error deleting service:', err);
      alert('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen  ">
     

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden p-6 border-l-4 w-full">
          

          {loading ? (
            <p className="text-gray-600">Loading services...</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Icon</th>
                    <th className="px-4 py-2 text-left">Heading</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service._id} className="border-b border-gray-200 hover:bg-gray-50">
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
                          onClick={() => handleEdit(service._id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(service._id, service.icon?.component)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {services.length === 0 && (
                <p className="text-center text-gray-600 py-6">No services found.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ServiceList;
