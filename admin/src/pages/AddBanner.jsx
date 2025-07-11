import React, { useState } from 'react';
import { Upload, Play } from 'lucide-react';
import { toast } from 'react-toastify';
import instance from '../utils/axios';

export default function AddBanner() {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    date: new Date().toISOString().split('T')[0],
    bannerFeature: '',
  });

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded) {
      setFile(uploaded);
      setFilePreview({
        url: URL.createObjectURL(uploaded),
        type: uploaded.type.split('/')[0],
      });
    }
  };

  const isValidUrl = (url) => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,})' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$',
      'i'
    );
    return pattern.test(url);
  };

  const handleSubmit = async () => {
    const { name, url, date, bannerFeature } = formData;
    if (!name.trim()) return toast.error('Name is required.');
    if (!url.trim()) return toast.error('URL is required.');
    if (!isValidUrl(url)) return toast.error('Invalid URL.');
    if (!date) return toast.error('Date is required.');
    if (!bannerFeature) return toast.error('Please select a file type.');
    if (!file) return toast.error('Please upload a file.');

    const [mimeType, position] = bannerFeature.split(' ');

    const payload = new FormData();
    payload.append('name', name);
    payload.append('url', url);
    payload.append('date', date);
    payload.append('type', mimeType.includes('video') ? 'video' : 'image');
    payload.append('position', position);
    payload.append('file', file);

    try {
      const toastId = toast.loading('Creating post...');
      await instance.post('/admin/market-post/create', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Post created successfully');
      toast.dismiss(toastId);

      // Reset
      setFormData({
        name: '',
        url: '',
        date: new Date().toISOString().split('T')[0],
        bannerFeature: '',
      });
      setFile(null);
      setFilePreview(null);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong.');
    }
  };

  return (
    <div className="mb-8 mx-auto w-[60vw] rounded-lg bg-white p-6 shadow-xl">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-800">Video/Image</h3>
          <div className="relative">
            {filePreview?.url ? (
              <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100">
                {filePreview.type === 'video' ? (
                  <video src={filePreview.url} className="h-full w-full object-cover" controls />
                ) : (
                  <img src={filePreview.url} className="h-full w-full object-cover" alt="preview" />
                )}
                <div className="absolute top-2 left-2 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
                  BREAKING NEWS
                </div>
              </div>
            ) : (
              <div className="relative flex h-48 w-full items-center justify-center rounded-lg bg-blue-900">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-900 opacity-20" />
                <div className="absolute top-4 left-4 rounded bg-red-600 px-3 py-1 text-sm font-bold text-white">
                  BREAKING NEWS
                </div>
                <div className="absolute right-4 bottom-4 text-xs text-white opacity-75">gettyimages</div>
                <Play className="h-12 w-12 text-white opacity-75" />
              </div>
            )}

            <input
              type="file"
              accept={formData.bannerFeature.split(' ')[0] || 'image/*'}
              name="file"
              onChange={handleFileUpload}
              className="hidden"
              id="upload-input"
            />
            <label
              htmlFor="upload-input"
              className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
            >
              <Upload className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-700">Upload</span>
            </label>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded-lg border px-4 py-2 focus:ring-blue-500"
              placeholder="Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className="w-full rounded-lg border px-4 py-2 focus:ring-blue-500"
              placeholder="Paste URL..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full rounded-lg border px-4 py-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">File Type</label>
            <select
              name="bannerFeature"
              value={formData.bannerFeature}
              onChange={(e) => {
                setFile(null);
                setFilePreview(null);
                handleInputChange(e);
              }}
              className="w-full rounded-lg border px-4 py-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                -- Choose file type --
              </option>
              <option value="image/* 1">Image - Position 1</option>
              <option value="image/* 2">Image - Position 2</option>
              <option value="video/* 3">Video - Position 1</option>
              <option value="video/* 4">Video - Position 2</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
