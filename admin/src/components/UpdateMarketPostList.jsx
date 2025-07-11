import React, { useState, useEffect } from 'react';
import { Upload, Play, X } from 'lucide-react';
import instance from '../utils/axios';
import { toast } from 'react-toastify';

export default function UpdateMarketPostList({
  data,
  setIsEditing,
  setEditData,
}) {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    date: new Date().toISOString().split('T')[0],
    position: '',
  });

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Determine allowed file type from position string
  const getAcceptType = (positionValue) => {
    return positionValue?.startsWith('video') ? 'video/*' : 'image/*';
  };

  // Load initial data
  useEffect(() => {
    if (data) {
      const positionType = data.type || 'image';
      const pos = `${positionType}/* ${data.position || 1}`;

      setFormData({
        name: data.name || '',
        url: data.url || '',
        date: data.postDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        position: pos,
      });

      if (data.postUrl) {
        setFilePreview({
          url: data.postUrl,
          type: data.type,
        });
      }
    }
  }, [data]);

  // Handle text/date input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const url = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setFilePreview({
      url,
      type: selectedFile.type.split('/')[0], // image or video
    });
  };

  // Handle position select + reset preview
  const handlePositionChange = (e) => {
    handleInputChange(e);
    setFile(null);
    setFilePreview(null);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required.');
      return;
    }

    if (!formData.url.trim()) {
      toast.error('URL is required.');
      return;
    }

    if (!file && !filePreview?.url) {
      toast.error('A banner (image/video) is required.');
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('url', formData.url);
    payload.append('date', formData.date);
    payload.append('type', filePreview?.type || 'video');
    payload.append('position', formData.position.split(' ')[1]);

    if (file) {
      payload.append('file', file);
    }

    let toastId;
    setUpdating(true);
    try {
      toastId = toast.loading('Updating post...');
      await instance.put(`/admin/market-post/update/${data._id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Post updated successfully!');
      setEditData(null);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update post.');
    } finally {
      toast.dismiss(toastId);
      setUpdating(false);
    }
  };

  return (
    <div className="fixed top-0 right-0 flex h-[100vh] w-[100vw] items-center justify-center bg-white/70 p-6 z-50">
      <div className="relative grid w-full max-w-[50vw] grid-cols-1 gap-6 rounded-2xl bg-white p-6 shadow-2xl lg:grid-cols-3">
        {/* Close Button */}
        <div className="absolute top-4 flex w-full justify-end border-b-2 border-gray-200 pr-5 pb-2">
          <X
            className="cursor-pointer"
            onClick={() => {
              setIsEditing(false);
              setEditData(null);
            }}
          />
        </div>

        {/* File Preview + Upload */}
        <div className="mt-8 lg:col-span-1">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Video/Image
          </h3>
          <div className="relative">
            {filePreview?.url ? (
              <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100">
                {filePreview.type === 'video' ? (
                  <video
                    src={filePreview.url}
                    className="h-full w-full object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={filePreview.url}
                    className="h-full w-full object-cover"
                    alt="preview"
                  />
                )}
              </div>
            ) : (
              <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-blue-900">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-900 opacity-20"></div>
                <div className="absolute top-4 left-4 rounded bg-red-600 px-3 py-1 text-sm font-bold text-white">
                  Banner
                </div>
                <Play className="h-12 w-12 text-white opacity-75" />
              </div>
            )}

            <input
              type="file"
              accept={getAcceptType(formData.position)}
              onChange={handleFileUpload}
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 transition-colors hover:bg-gray-50"
            >
              <Upload className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-700">Upload</span>
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <div className="mt-8 space-y-6 lg:col-span-2">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                placeholder="Name"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                URL
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                placeholder="Paste URL..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Post Position
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handlePositionChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              >
                <option value="image/* 1">Image - Position 1</option>
                <option value="image/* 2">Image - Position 2</option>
                <option value="video/* 3">Video - Position 3</option>
                <option value="video/* 4">Video - Position 4</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={updating}
              className={`rounded-lg px-8 py-3 font-semibold text-white ${
                updating ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {updating ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
