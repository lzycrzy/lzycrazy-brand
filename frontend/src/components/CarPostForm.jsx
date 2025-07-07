import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

const CarPostForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('Cars');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 8);
    const previews = files.map(file => URL.createObjectURL(file));
    setImages(previews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...formData, category: selectedCategory, subCategory: selectedSubCategory });
    onClose();
  };

  const subCategories = ['Hatchback', 'Sedan', 'SUV', 'Coupe', 'Convertible'];

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0  bg-opacity-40 backdrop-blur-sm" aria-hidden="true" />

      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-6xl overflow-y-auto max-h-[90vh]">
        <Dialog.Title className="text-2xl font-semibold mb-4">Post a Car Listing</Dialog.Title>

        {/* Category Tabs */}
        <div className="mb-4">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded border ${selectedCategory === 'Cars' ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}
              onClick={() => setSelectedCategory('Cars')}
            >
              Cars
            </button>
          </div>
        </div>

        {/* Subcategory Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {subCategories.map((sub) => (
              <button
                key={sub}
                className={`px-3 py-1 rounded border ${selectedSubCategory === sub ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setSelectedSubCategory(sub)}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1 */}
            <div className="space-y-4">
              <input name="brand" placeholder="Brand" className="w-full p-2 border rounded" onChange={handleChange} />
              <input name="year" placeholder="Year" className="w-full p-2 border rounded" onChange={handleChange} />
              <input name="kmDriven" placeholder="KM Driven" className="w-full p-2 border rounded" onChange={handleChange} />
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <input name="title" placeholder="Ad Title" className="w-full p-2 border rounded" onChange={handleChange} />
              <textarea name="description" placeholder="Description" className="w-full p-2 border rounded" onChange={handleChange} />
              <input name="price" placeholder="Price" className="w-full p-2 border rounded" onChange={handleChange} />
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              <label className="block">Upload Photos (max 8)</label>
              <input type="file" multiple className="w-full" onChange={handleImageChange} />
              <div className="grid grid-cols-4 gap-2 mt-2">
                {images.map((src, index) => (
                  <div key={index} className="w-full aspect-square bg-gray-100 overflow-hidden rounded">
                    <img src={src} alt={`car-${index}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>

              <label className="block mt-4">Fuel Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['CNG & Hybrids', 'Diesel', 'Electric', 'LPG', 'Petrol'].map((fuel) => (
                  <label key={fuel} className="flex items-center">
                    <input type="checkbox" name="fuel" value={fuel} className="mr-2" />
                    {fuel}
                  </label>
                ))}
              </div>

              <label className="block mt-4">No. of Owners</label>
              <div className="grid grid-cols-2 gap-2">
                {['1st', '2nd', '3rd', '4+'].map((owner) => (
                  <label key={owner} className="flex items-center">
                    <input type="checkbox" name="owners" value={owner} className="mr-2" />
                    {owner}
                  </label>
                ))}
              </div>

              <label className="block mt-4">Transmission</label>
              <div className="grid grid-cols-2 gap-2">
                {['Automatic', 'Manual'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input type="checkbox" name="transmission" value={type} className="mr-2" />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Confirm Location & Submit */}
          <div className="mt-6">
            <input
              name="location"
              placeholder="Confirm your location"
              className="w-full p-2 border rounded mb-4"
              onChange={handleChange}
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Post Now
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default CarPostForm;
