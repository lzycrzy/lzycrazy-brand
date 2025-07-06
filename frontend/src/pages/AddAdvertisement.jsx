import React, { useState, useEffect } from 'react';
import { FaCamera } from 'react-icons/fa';
import Header from '../components/static/Header1';
import Footer from '../components/static/Footer1';

const AddAdvertisement = () => {
  const [ads, setAds] = useState([]);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [image]);

  const handleAdd = () => {
    if (!title || !link || !image) {
      alert('Please fill all fields');
      return;
    }

    const newAd = {
      id: Date.now(),
      title,
      link,
      image: preview,
    };

    setAds([newAd, ...ads]);
    setTitle('');
    setLink('');
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 mt-20 p-6 max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-center">Add Advertisement</h2>

        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <input
            type="text"
            placeholder="Advertisement Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Target Link (e.g., https://example.com)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <FaCamera />
            <span className="text-sm text-blue-600">Upload Banner Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
          </label>

          {preview && (
            <img
              src={preview}
              alt="Ad Preview"
              className="w-full h-40 object-cover rounded border"
            />
          )}

          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Advertisement
          </button>
        </div>

        {/* Advertisement List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Advertisements</h3>
          {ads.length === 0 && <p className="text-gray-500">No ads added yet.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-white p-4 shadow rounded">
                <img src={ad.image} alt={ad.title} className="w-full h-32 object-cover rounded mb-2" loading="lazy" />
                <h4 className="font-semibold text-lg">{ad.title}</h4>
                <a href={ad.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm">
                  {ad.link}
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddAdvertisement;
