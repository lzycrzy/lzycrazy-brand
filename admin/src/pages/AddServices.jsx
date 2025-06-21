import React, { useState, useEffect } from 'react';
import { 
  Settings, Edit, Delete, Save, Plus, X, Search, Upload, Image
} from 'lucide-react';
import instance from '../utils/axios';

const AddServices = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    selectedImage: null
  });
  const [editingService, setEditingService] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await instance.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      alert('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      return alert('Please select a valid image file (JPG, PNG, etc.)');
    }

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await instance.post(
        '/image/upload',
        formDataUpload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          skipAuth: false, 
        }
      );

      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || 'Upload failed');
      }

      const imageData = {
        name: file.name,
        component: data.url, 
      };

      setFormData(prev => ({ ...prev, selectedImage: imageData }));
    } catch (err) {
      console.error('Upload error:', err);
      alert('Image upload failed');
    }
  };

  const removeImage = async () => {
    try {
      const imageUrl = formData.selectedImage?.component;

      if (imageUrl && imageUrl.includes('cloudinary')) {
        await instance.delete('/image/delete', {
          data: { imageUrl },
        });
      }

      setFormData(prev => ({ ...prev, selectedImage: null }));
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Failed to delete image');
    }
  };

  const handleAdd = async () => {
    if (formData.title && formData.description && formData.selectedImage) {
      try {
        setLoading(true);
        const serviceData = {
          title: formData.title,
          description: formData.description,
          icon: formData.selectedImage
        };
        
        const response = await instance.post('/services', serviceData);
        
        setServices(prev => [...prev, response.data]);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          selectedImage: null
        });
        
        alert('Service added successfully!');
      } catch (error) {
        console.error('Error adding service:', error);
        alert('Failed to add service. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fill in all fields and upload an image.');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service._id);
    setFormData({
      title: service.title,
      description: service.description,
      selectedImage: service.icon
    });
  };

  const handleUpdate = async () => {
    if (formData.title && formData.description && formData.selectedImage) {
      try {
        setLoading(true);
        const serviceData = {
          title: formData.title,
          description: formData.description,
          icon: formData.selectedImage
        };
        
        const response = await instance.put(`/services/${editingService}`, serviceData);
        
        setServices(prev => prev.map(service => 
          service._id === editingService ? response.data : service
        ));
        
        setFormData({
          title: '',
          description: '',
          selectedImage: null
        });
        setEditingService(null);
        
        alert('Service updated successfully!');
      } catch (error) {
        console.error('Error updating service:', error);
        alert('Failed to update service. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fill in all fields and ensure an image is selected.');
    }
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      selectedImage: null
    });
  };

  const handleDeleteClick = (serviceId) => {
    setShowDeleteModal(serviceId);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const serviceToDelete = services.find(service => service._id === showDeleteModal);
      
      if (serviceToDelete?.icon?.component && serviceToDelete.icon.component.includes('cloudinary')) {
        try {
          await instance.delete('/image/delete', {
            data: { imageUrl: serviceToDelete.icon.component },
          });
        } catch (imageError) {
          console.error('Error deleting image:', imageError);
        }
      }
      
      await instance.delete(`/services/${showDeleteModal}`);
      
      setServices(prev => prev.filter(service => service._id !== showDeleteModal));
      setShowDeleteModal(null);
      
      alert('Service deleted successfully!');
    } catch (err) {
      console.error('Error deleting service:', err);
      alert('Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Service Manager
          </h1>
          <p className="text-gray-600 text-lg">Create, read, update, and delete your services with ease</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 mb-8 relative z-50">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {editingService ? (
                <>
                  <Edit size={24} className="text-blue-600" />
                  Edit Service
                </>
              ) : (
                <>
                  <Plus size={24} className="text-green-600" />
                  Add New Service
                </>
              )}
            </h2>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 items-end">
            <div className="flex-1 space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Title</label>
                <input
                  type="text"
                  placeholder="Enter service title..."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 group-hover:border-gray-300"
                  disabled={loading}
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Describe your service..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 group-hover:border-gray-300 resize-none"
                  disabled={loading}
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Image</label>
                
                {!formData.selectedImage ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                      className="hidden"
                      id="imageUpload"
                      disabled={loading}
                    />
                    <label
                      htmlFor="imageUpload"
                      className="w-full px-4 py-8 bg-white/70 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-white focus:border-blue-500 focus:bg-white transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-3 group-hover:border-gray-400"
                    >
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <Upload size={24} className="text-white" />
                      </div>
                      <div className="text-center">
                        <p className="text-gray-700 font-medium">Click to upload an image</p>
                        <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-full p-4 bg-white/70 border-2 border-gray-200 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="relative group">
                          <img
                            src={formData.selectedImage.component}
                            alt={formData.selectedImage.name}
                            className="w-20 h-20 object-cover rounded-lg shadow-md"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium">
                            {formData.selectedImage.name}
                          </p>
                          <p className="text-gray-500 text-sm">Image uploaded successfully</p>
                        </div>
                        <div className="flex gap-2">
                          <label
                            htmlFor="imageUpload"
                            className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 cursor-pointer"
                            title="Change Image"
                          >
                            <Edit size={16} />
                          </label>
                          <button
                            onClick={removeImage}
                            className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
                            title="Remove Image"
                            disabled={loading}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                      className="hidden"
                      id="imageUpload"
                      disabled={loading}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              {editingService ? (
                <>
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={20} />
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAdd}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={20} />
                  {loading ? 'Adding...' : 'Add Service'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden relative z-10">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Settings size={24} className="text-white" />
              </div>
              Services Dashboard
            </h2>
            <p className="text-blue-100 mt-1">Manage all your services in one place</p>
          </div>
          
          {loading && services.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading Services...</h3>
              <p className="text-gray-400">Please wait while we fetch your services</p>
            </div>
          ) : services.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Services Yet</h3>
              <p className="text-gray-400">Add your first service to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {services.map((service, index) => (
                <div
                  key={service._id}
                  className={`px-8 py-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group ${
                    editingService === service._id ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-400' : ''
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-200 bg-gray-100 border-2 border-gray-200">
                        <img
                          src={service.icon.component}
                          alt={service.icon.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-4">
                      <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                        <span className="text-sm font-semibold text-gray-700">
                          Service #{index + 1}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(service)}
                          disabled={loading}
                          className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit Service"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(service._id)}
                          disabled={loading}
                          className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Service"
                        >
                          <Delete size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200]">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Delete size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Service</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this service? This action cannot be undone and will also delete the associated image.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={cancelDelete}
                    disabled={loading}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={loading}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default AddServices;