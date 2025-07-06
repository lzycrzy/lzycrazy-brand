import React, { useState, useEffect } from 'react';
import { Upload, Play, X } from 'lucide-react';
import instance from '../utils/axios';
import { toast } from 'react-toastify';

export default function UpdateMarketPostList({ data, setIsEditing, setEditData }) {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    date: new Date().toISOString().split('T')[0],
    position: '1', // default position
  });

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  console.log(data);

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || '',
        url: data.url || '',
        date:
          data.postDate?.split('T')[0] ||
          new Date().toISOString().split('T')[0],
        position: data.position?.toString() || '1',
      });

      if (data.postUrl) {
        setFilePreview({
          url: data.postUrl,
          type: data.type,
        });
      }
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file);
      setFilePreview({
        url,
        type: file.type.split('/')[0],
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.url.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('url', formData.url);
    payload.append('date', formData.date);
    payload.append('type', filePreview?.type || 'video');
    payload.append('position', formData.position);

    if (file) {
      payload.append('file', file);
    }

    let toastId;
    try {
      toastId = toast.loading('Updating post...');
      await instance.put(`/admin/market-post/update/${data._id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Post updated successfully!');
      setEditData(null);
      setIsEditing(false);
      toast.dismiss(toastId);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while submitting.');
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="fixed top-0 right-0 flex h-[100vh] w-[100vw] items-center justify-center bg-white/70 p-6">
      <div className="relative grid w-full max-w-[50vw] grid-cols-1 gap-6 rounded-2xl bg-white p-6 shadow-2xl lg:grid-cols-3">
        {/* Video Upload Section */}
        <div className="absolute top-4 border-b-2 border-gray-200 pb-2 w-full flex justify-end pr-5">
          <X className='cursor-pointer' onClick={() => {
            setIsEditing(false);
            setEditData(null);
          }} />
        </div>
        <div className="lg:col-span-1 mt-8">
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
                  BREAKING NEWS
                </div>
                <div className="absolute right-4 bottom-4 text-xs text-white opacity-75">
                  gettyimages
                </div>
                <Play className="h-12 w-12 text-white opacity-75" />
              </div>
            )}

            <input
              type="file"
              accept="image/*,video/*"
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

        {/* Form Fields Section */}
        <div className="space-y-6 lg:col-span-2 mt-8">
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
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              >
                <option value="1">Position 1</option>
                <option value="2">Position 2</option>
                <option value="3">Position 3</option>
                <option value="4">Position 4</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
