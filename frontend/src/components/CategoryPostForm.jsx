import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

const CategoryPostForm = ({
  isOpen,
  onClose,
  categoryOptions = ['Cars'],
  subCategoryOptions = [],
  inputFields = [],
  checkboxGroups = [],
  onSubmit,
}) => {
  const [formData, setFormData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [images, setImages] = useState(Array(8).fill(null));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => {
        const currentValues = prev[name] || [];
        return {
          ...prev,
          [name]: checked
            ? [...currentValues, value]
            : currentValues.filter((v) => v !== value),
        };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSingleImageChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      category: selectedCategory,
      subCategory: selectedSubCategory,
      images: images.filter(Boolean),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 py-5 z-100 flex items-center justify-center">
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm transition-opacity" aria-hidden="true" />

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-auto z-50 overflow-y-auto max-h-[90vh] p-6">
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Category Tabs */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Select Category</h2>
            <div className="flex flex-wrap gap-3">
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`px-4 py-2 rounded-full border text-sm font-medium ${
                    selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory Tabs */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Select Subcategory</h2>
            <div className="flex flex-wrap gap-3">
              {subCategoryOptions.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  className={`px-3 py-1.5 rounded-full border text-sm font-medium ${
                    selectedSubCategory === sub ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setSelectedSubCategory(sub)}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inputFields.map(({ name, type = 'text', placeholder }) => (
              <input
                key={name}
                name={name}
                placeholder={placeholder || name}
                type={type}
                className="w-full p-3 border rounded text-sm"
                onChange={handleChange}
              />
            ))}
          </div>

          {/* Checkbox Groups */}
          <div className="space-y-6">
            {checkboxGroups.map(({ label, name, options }) => (
              <div key={name}>
                <label className="block font-semibold mb-2 text-sm">{label}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {options.map((option) => (
                    <label key={option} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        name={name}
                        value={option}
                        className="mr-2"
                        onChange={handleChange}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Image Upload Squares */}
          <div>
            <label className="block font-semibold mb-2 text-sm">Upload Photos (up to 8)</label>
            <div className="grid grid-cols-4 gap-2 max-w-sm">
              {images.map((file, idx) => (
                <label
                  key={idx}
                  className="aspect-square w-20 bg-gray-100 border rounded cursor-pointer overflow-hidden flex items-center justify-center relative"
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleSingleImageChange(idx, e.target.files[0])}
                  />
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">+</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Location & Submit */}
          <div>
            <input
              name="location"
              placeholder="Confirm your location"
              className="w-full p-3 border rounded text-sm mb-4"
              onChange={handleChange}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Post Now
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default CategoryPostForm;