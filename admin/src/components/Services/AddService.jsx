import React, { useState, useEffect } from 'react';
import { FaPlusCircle, FaCameraRetro } from 'react-icons/fa';
import instance from '../../lib/axios/axiosInstance'; 
import { useParams } from 'react-router-dom';

function AddServiceCard() {
  const [previewSrc, setPreviewSrc] = useState('https://img.icons8.com/ios/50/image--v1.png');
  const [toastVisible, setToastVisible] = useState(false);
  const [formData, setFormData] = useState({
    heading: '',
    description: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id: editId } = useParams();

  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewSrc(reader.result);
        setFormData({ ...formData, image: file });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (editId) {
      const loadService = async () => {
        try {
          const res = await instance.get(`/services/${editId}`);
          const s = res.data;
          setEditingService(s._id);
          setFormData({
            heading: s.title,
            description: s.description,
            image: s.icon,
          });
          setPreviewSrc(s.icon?.component || previewSrc);
        } catch (err) {
          console.error('Failed to load service:', err);
          alert('Error loading service to edit.');
        }
      };
      loadService();
    }
  }, [editId]);

  const validate = () => {
    const newErrors = {};
    if (!formData.heading.trim()) newErrors.heading = 'Heading is required';
    else if (formData.heading.trim().split(' ').length > 20)
      newErrors.heading = 'Heading should not exceed 20 words';

    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.trim().split(' ').length > 1000)
      newErrors.description = 'Description should not exceed 1000 words';

    if (!formData.image) newErrors.image = 'Image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      let imagePayload = formData.image;

      // Upload if image is a new File
      if (formData.image instanceof File) {
        const imageForm = new FormData();
        imageForm.append('file', formData.image);

        const uploadRes = await instance.post('/image/upload', imageForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const imageUrl = uploadRes?.data?.url;
        if (!imageUrl) throw new Error('Image upload failed');

        imagePayload = {
          name: formData.image.name,
          component: imageUrl,
        };
      }

      const payload = {
        title: formData.heading,
        description: formData.description,
        icon: imagePayload,
      };

      if (editingService) {
        await instance.put(`/services/${editingService}`, payload);
        alert('Service updated successfully!');
      } else {
        await instance.post('/services', payload);
        alert('Service added successfully!');
      }

      setFormData({ heading: '', description: '', image: null });
      setPreviewSrc('https://img.icons8.com/ios/50/image--v1.png');
      setErrors({});
      setToastVisible(true);
      setEditingService(null);
      setTimeout(() => setToastVisible(false), 3000);
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to submit service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="bg-white rounded-xl shadow-xl p-6 sm:p-10 border-l-4 border-teal-500 w-full max-w-4xl mx-auto">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 uppercase flex items-center gap-2">
        <FaPlusCircle className="text-teal-600" />
        {editingService ? 'Edit Service' : 'Create New Service'}
      </h2>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-5 rounded shadow disabled:opacity-50 w-full sm:w-auto"
      >
        {loading ? 'Saving...' : editingService ? 'Update' : 'Add'}
      </button>
    </div>

    <div className="flex flex-col md:flex-row md:gap-6 gap-4">
      {/* Image Upload */}
      <div className="flex flex-col items-center justify-center w-32 h-32 rounded-lg bg-gray-100 border relative overflow-hidden shadow-md mx-auto md:mx-0">
        <label htmlFor="cameraInput" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
          {previewSrc ? (
            <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <FaCameraRetro />
          )}
        </label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          id="cameraInput"
          className="hidden"
          onChange={handlePreview}
        />
        {errors.image && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.image}</p>}
      </div>

      {/* Input Fields */}
      <div className="flex-1 min-w-[250px] space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Heading</label>
          <input
            type="text"
            value={formData.heading}
            onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
            className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Enter service heading (max 20 words)"
          />
          {errors.heading && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.heading}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Description</label>
          <textarea
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-50 text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Enter service description (max 1000 words)"
          ></textarea>
          {errors.description && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.description}</p>}
        </div>
      </div>
    </div>

    {toastVisible && (
      <div className="mt-6 bg-green-600 text-white px-4 py-2 rounded shadow-md flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>Service {editingService ? 'updated' : 'added'} successfully!</span>
      </div>
    )}
  </div>
);

}

export default AddServiceCard;
