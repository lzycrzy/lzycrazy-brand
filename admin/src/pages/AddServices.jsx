import React, { useState } from 'react';
import { 
  Home, User, Settings, Mail, Phone, Calendar, Camera, 
  Heart, Star, Search, ShoppingCart, Bell, Lock, 
  Globe, Wifi, Battery, Volume2, Bluetooth, Download,
  Upload, Edit, Delete, Save, Copy, Share, Info,
  Check, X, Plus, Minus, ChevronDown, ChevronUp
} from 'lucide-react';

const AddServices = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    selectedIcon: null
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  const iconsList = [
    { name: 'Home', component: Home },
    { name: 'User', component: User },
    { name: 'Settings', component: Settings },
    { name: 'Mail', component: Mail },
    { name: 'Phone', component: Phone },
    { name: 'Calendar', component: Calendar },
    { name: 'Camera', component: Camera },
    { name: 'Heart', component: Heart },
    { name: 'Star', component: Star },
    { name: 'Search', component: Search },
    { name: 'ShoppingCart', component: ShoppingCart },
    { name: 'Bell', component: Bell },
    { name: 'Lock', component: Lock },
    { name: 'Globe', component: Globe },
    { name: 'Wifi', component: Wifi },
    { name: 'Battery', component: Battery },
    { name: 'Volume2', component: Volume2 },
    { name: 'Bluetooth', component: Bluetooth },
    { name: 'Download', component: Download },
    { name: 'Upload', component: Upload },
    { name: 'Edit', component: Edit },
    { name: 'Delete', component: Delete },
    { name: 'Save', component: Save },
    { name: 'Copy', component: Copy },
    { name: 'Share', component: Share },
    { name: 'Info', component: Info },
    { name: 'Check', component: Check },
    { name: 'X', component: X },
    { name: 'Plus', component: Plus },
    { name: 'Minus', component: Minus }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIconSelect = (icon) => {
    setFormData(prev => ({
      ...prev,
      selectedIcon: icon
    }));
    setIsDropdownOpen(false);
  };

  const handleAdd = () => {
    if (formData.title && formData.description && formData.selectedIcon) {
      const newService = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        icon: formData.selectedIcon
      };
      
      setServices(prev => [...prev, newService]);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        selectedIcon: null
      });
    } else {
      alert('Please fill in all fields and select an icon.');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service.id);
    setFormData({
      title: service.title,
      description: service.description,
      selectedIcon: service.icon
    });
  };

  const handleUpdate = () => {
    if (formData.title && formData.description && formData.selectedIcon) {
      setServices(prev => prev.map(service => 
        service.id === editingService 
          ? {
              ...service,
              title: formData.title,
              description: formData.description,
              icon: formData.selectedIcon
            }
          : service
      ));
      
      // Reset form and editing state
      setFormData({
        title: '',
        description: '',
        selectedIcon: null
      });
      setEditingService(null);
    } else {
      alert('Please fill in all fields and select an icon.');
    }
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      selectedIcon: null
    });
  };

  const handleDeleteClick = (serviceId) => {
    setShowDeleteModal(serviceId);
  };

  const confirmDelete = () => {
    setServices(prev => prev.filter(service => service.id !== showDeleteModal));
    setShowDeleteModal(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(null);
  };

  const IconComponent = formData.selectedIcon?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Service Manager
          </h1>
          <p className="text-gray-600 text-lg">Create, read, update, and delete your services with ease</p>
        </div>

        {/* Add/Edit Service Form */}
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
              {/* Title Input */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Title</label>
                <input
                  type="text"
                  placeholder="Enter service title..."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 group-hover:border-gray-300"
                />
              </div>
              
              {/* Description Input */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Describe your service..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 group-hover:border-gray-300 resize-none"
                />
              </div>
              
              {/* Icons Dropdown */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Choose Icon</label>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200 text-left flex items-center justify-between group-hover:border-gray-300"
                >
                  <div className="flex items-center gap-3">
                    {formData.selectedIcon ? (
                      <>
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                          <IconComponent size={20} className="text-white" />
                        </div>
                        <span className="text-gray-800 font-medium">{formData.selectedIcon.name}</span>
                      </>
                    ) : (
                      <span className="text-gray-400">Select an icon...</span>
                    )}
                  </div>
                  <div className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} className="text-gray-400" />
                  </div>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl z-[100] max-h-80 overflow-hidden">
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Icon</h3>
                      <div className="grid grid-cols-6 gap-2 max-h-60 overflow-y-auto">
                        {iconsList.map((icon) => {
                          const IconComp = icon.component;
                          return (
                            <button
                              key={icon.name}
                              onClick={() => handleIconSelect(icon)}
                              className="p-3 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 rounded-lg flex flex-col items-center gap-1 transition-all duration-200 border-2 border-transparent hover:border-white"
                              title={icon.name}
                            >
                              <IconComp size={20} className="text-gray-600 hover:text-white transition-colors duration-200" />
                              <span className="text-xs text-gray-500 hover:text-white/90 font-medium transition-colors duration-200">{icon.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              {editingService ? (
                <>
                  <button
                    onClick={handleUpdate}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                  >
                    <Save size={20} />
                    Update
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAdd}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Service
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Services List */}
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
          
          {services.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Services Yet</h3>
              <p className="text-gray-400">Add your first service to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {services.map((service, index) => {
                const ServiceIcon = service.icon.component;
                return (
                  <div
                    key={service.id}
                    className={`px-8 py-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group ${
                      editingService === service.id ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-400' : ''
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                          <ServiceIcon size={24} className="text-white" />
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
                            className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            title="Edit Service"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(service.id)}
                            className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            title="Delete Service"
                          >
                            <Delete size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200]">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Delete size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Service</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this service? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={cancelDelete}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-semibold"
                  >
                    Delete
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