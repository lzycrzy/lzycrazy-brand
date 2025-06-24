import React, { useState, useEffect } from 'react';
import { 
  Settings, Search, Plus, Edit, Trash2, Upload, X, Save, ChevronDown, ChevronUp
} from 'lucide-react';

import instance from '../utils/axios';

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState({
    imageData: null,
    name: '',
    subcategories: []
  });
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FIELD_TYPES = [
    { value: 'text', label: 'Text Input' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'radio', label: 'Radio Button' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'file', label: 'File Upload' },
  ];

  const handleImageUpload = async (file, type = 'category', subIndex = null) => {
    if (!file || !file.type.startsWith('image/')) {
      return alert('Please select a valid image file (JPG, PNG, etc.)');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await instance.post(
        '/image/upload',
        formData,
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
        url: data.url, 
        name: file.name,
      };

      if (type === 'category') {
        setCategoryData(prev => ({ ...prev, imageData: imageData }));
      } else {
        setCategoryData(prev => ({
          ...prev,
          subcategories: prev.subcategories.map((sub, index) =>
            index === subIndex ? { ...sub, imageData: imageData } : sub
          )
        }));
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Image upload failed');
    }
  };

  const handleNameChange = (value, type = 'category', subIndex = null) => {
    if (type === 'category') {
      setCategoryData(prev => ({ ...prev, name: value }));
    } else {
      setCategoryData(prev => ({
        ...prev,
        subcategories: prev.subcategories.map((sub, index) =>
          index === subIndex ? { ...sub, name: value } : sub
        )
      }));
    }
  };

  const addSubcategory = () => {
    setCategoryData(prev => ({
      ...prev,
      subcategories: [...prev.subcategories, { 
        imageData: null, 
        name: '', 
        formStructure: [],
        showFormBuilder: false
      }]
    }));
  };

  const removeSubcategory = (index) => {
    setCategoryData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index)
    }));
  };

  const toggleFormBuilder = (subIndex) => {
    setCategoryData(prev => ({
      ...prev,
      subcategories: prev.subcategories.map((sub, index) =>
        index === subIndex ? { ...sub, showFormBuilder: !sub.showFormBuilder } : sub
      )
    }));
  };

  const addFormField = (subIndex) => {
    setCategoryData(prev => ({
      ...prev,
      subcategories: prev.subcategories.map((sub, index) =>
        index === subIndex ? {
          ...sub,
          formStructure: [
            ...sub.formStructure,
            {
              label: '',
              fieldName: '',
              type: 'text',
              options: [],
              required: false
            }
          ]
        } : sub
      )
    }));
  };

  const updateFormField = (subIndex, fieldIndex, field, value) => {
    setCategoryData(prev => ({
      ...prev,
      subcategories: prev.subcategories.map((sub, index) =>
        index === subIndex ? {
          ...sub,
          formStructure: sub.formStructure.map((formField, fIndex) =>
            fIndex === fieldIndex ? { ...formField, [field]: value } : formField
          )
        } : sub
      )
    }));
  };

  const removeFormField = (subIndex, fieldIndex) => {
    setCategoryData(prev => ({
      ...prev,
      subcategories: prev.subcategories.map((sub, index) =>
        index === subIndex ? {
          ...sub,
          formStructure: sub.formStructure.filter((_, fIndex) => fIndex !== fieldIndex)
        } : sub
      )
    }));
  };

  const addFieldOption = (subIndex, fieldIndex) => {
    setCategoryData(prev => ({
      ...prev,
      subcategories: prev.subcategories.map((sub, index) =>
        index === subIndex ? {
          ...sub,
          formStructure: sub.formStructure.map((formField, fIndex) =>
            fIndex === fieldIndex ? {
              ...formField,
              options: [...formField.options, '']
            } : formField
          )
        } : sub
      )
    }));
  };

  const updateFieldOption = (subIndex, fieldIndex, optionIndex, value) => {
    setCategoryData(prev => ({
      ...prev,
      subcategories: prev.subcategories.map((sub, index) =>
        index === subIndex ? {
          ...sub,
          formStructure: sub.formStructure.map((formField, fIndex) =>
            fIndex === fieldIndex ? {
              ...formField,
              options: formField.options.map((option, oIndex) =>
                oIndex === optionIndex ? value : option
              )
            } : formField
          )
        } : sub
      )
    }));
  };

  const removeFieldOption = (subIndex, fieldIndex, optionIndex) => {
    setCategoryData(prev => ({
      ...prev,
      subcategories: prev.subcategories.map((sub, index) =>
        index === subIndex ? {
          ...sub,
          formStructure: sub.formStructure.map((formField, fIndex) =>
            fIndex === fieldIndex ? {
              ...formField,
              options: formField.options.filter((_, oIndex) => oIndex !== optionIndex)
            } : formField
          )
        } : sub
      )
    }));
  };

  const removeImage = async (type = 'category', subIndex = null) => {
    try {
      let imageUrl = '';

      if (type === 'category') {
        imageUrl = categoryData.imageData?.url;
      } else {
        imageUrl = categoryData.subcategories[subIndex]?.imageData?.url;
      }

      if (imageUrl && imageUrl.includes('cloudinary')) {
        await instance.delete('/image/delete', {
          data: { imageUrl },
        });
      }

      if (type === 'category') {
        setCategoryData(prev => ({ ...prev, imageData: null }));
      } else {
        setCategoryData(prev => ({
          ...prev,
          subcategories: prev.subcategories.map((sub, index) =>
            index === subIndex ? { ...sub, imageData: null } : sub
          )
        }));
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Failed to delete image');
    }
  };

  const handleCreateCategory = async () => {
    if (!categoryData.imageData || !categoryData.name) {
      alert('Please upload an image and enter a category name!');
      return;
    }

    setIsSubmitting(true);
    try {
      // Filter out empty subcategories and prepare data for API
      const validSubcategories = categoryData.subcategories
        .filter(sub => sub.imageData && sub.name)
        .map(sub => ({
          name: sub.name,
          imageData: sub.imageData,
          formStructure: sub.formStructure.filter(field => 
            field.label && field.fieldName && field.type
          )
        }));

      const payload = {
        name: categoryData.name,
        imageData: categoryData.imageData,
        subcategories: validSubcategories,
        createdBy: null // Add user ID if available
      };

      const response = await instance.post('/categories', payload);

      if (response.data.success) {
        // Add to local state for display
        const newCategory = {
          id: Date.now(),
          ...payload
        };

        if (editingId) {
          setCategories(prev => prev.map(cat => 
            cat.id === editingId ? { ...newCategory, id: editingId } : cat
          ));
          setEditingId(null);
          alert('Category updated successfully!');
        } else {
          setCategories(prev => [...prev, newCategory]);
          alert('Category created successfully!');
        }

        // Reset form
        setCategoryData({
          imageData: null,
          name: '',
          subcategories: []
        });
      } else {
        throw new Error(response.data.message || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert(error.message || 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setCategoryData({
      imageData: category.imageData,
      name: category.name,
      subcategories: category.subcategories.map(sub => ({
        ...sub,
        showFormBuilder: false
      }))
    });
    setEditingId(category.id);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCategoryData({
      imageData: null,
      name: '',
      subcategories: []
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Category Manager
          </h1>
          <p className="text-gray-600 text-lg">Create categories with custom forms</p>
        </div>

        {/* Add Category Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 mb-8">
          {/* Category Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Category Details</h3>
            <div className="flex items-center gap-4">
              {/* Category Image Upload */}
              <div className="flex-shrink-0">
                {categoryData.imageData ? (
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                      <img 
                        src={categoryData.imageData.url} 
                        alt={categoryData.imageData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeImage('category')}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      title="Remove Image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-200">
                    <Upload size={20} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0], 'category')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              {/* Category Name */}
              <input
                type="text"
                placeholder="Enter category name"
                value={categoryData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none transition-all duration-200"
              />
              
              {/* Action Buttons */}
              <button
                onClick={addSubcategory}
                className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                title="Add Subcategory"
              >
                <Plus size={20} />
              </button>

              <button
                onClick={handleCreateCategory}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
              </button>

              {editingId && (
                <button
                  onClick={cancelEdit}
                  className="px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Subcategories Section */}
          {categoryData.subcategories.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Subcategories</h3>
              <div className="space-y-4">
                {categoryData.subcategories.map((subcategory, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                    {/* Subcategory Basic Info */}
                    <div className="flex items-center gap-4 mb-4">
                      {/* Subcategory Image Upload */}
                      <div className="flex-shrink-0">
                        {subcategory.imageData ? (
                          <div className="relative group">
                            <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 shadow-md">
                              <img 
                                src={subcategory.imageData.url} 
                                alt={subcategory.imageData.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              onClick={() => removeImage('subcategory', index)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                              title="Remove Image"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ) : (
                          <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-200">
                            <Upload size={16} className="text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500">Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e.target.files[0], 'subcategory', index)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                      
                      {/* Subcategory Name */}
                      <input
                        type="text"
                        placeholder="Enter subcategory name"
                        value={subcategory.name}
                        onChange={(e) => handleNameChange(e.target.value, 'subcategory', index)}
                        className="flex-1 px-4 py-2 bg-white/70 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-200"
                      />
                      
                      {/* Form Builder Toggle */}
                      <button
                        onClick={() => toggleFormBuilder(index)}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2"
                        title="Form Builder"
                      >
                        <Settings size={16} />
                        {subcategory.showFormBuilder ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      
                      {/* Remove Subcategory */}
                      <button
                        onClick={() => removeSubcategory(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Remove Subcategory"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Form Builder */}
                    {subcategory.showFormBuilder && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-700">Custom Form Fields</h4>
                          <button
                            onClick={() => addFormField(index)}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center gap-2"
                          >
                            <Plus size={16} />
                            Add Field
                          </button>
                        </div>

                        {subcategory.formStructure.map((field, fieldIndex) => (
                          <div key={fieldIndex} className="mb-4 p-3 bg-gray-50 rounded-lg border">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                              <input
                                type="text"
                                placeholder="Field Label"
                                value={field.label}
                                onChange={(e) => updateFormField(index, fieldIndex, 'label', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                              />
                              <input
                                type="text"
                                placeholder="Field Name"
                                value={field.fieldName}
                                onChange={(e) => updateFormField(index, fieldIndex, 'fieldName', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                              />
                              <select
                                value={field.type}
                                onChange={(e) => updateFormField(index, fieldIndex, 'type', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                              >
                                {FIELD_TYPES.map(type => (
                                  <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                              </select>
                              <div className="flex items-center gap-2">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={field.required}
                                    onChange={(e) => updateFormField(index, fieldIndex, 'required', e.target.checked)}
                                    className="rounded"
                                  />
                                  <span className="text-sm">Required</span>
                                </label>
                                <button
                                  onClick={() => removeFormField(index, fieldIndex)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                                  title="Remove Field"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            {/* Options for select, radio, checkbox */}
                            {['radio', 'checkbox', 'dropdown'].includes(field.type) && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between mb-2">
                                  <label className="text-sm font-medium text-gray-600">Options:</label>
                                  <button
                                    onClick={() => addFieldOption(index, fieldIndex)}
                                    className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                  >
                                    Add Option
                                  </button>
                                </div>
                                {field.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center gap-2 mb-2">
                                    <input
                                      type="text"
                                      placeholder="Option value"
                                      value={option}
                                      onChange={(e) => updateFieldOption(index, fieldIndex, optionIndex, e.target.value)}
                                      className="flex-1 px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                                    />
                                    <button
                                      onClick={() => removeFieldOption(index, fieldIndex, optionIndex)}
                                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                                      title="Remove Option"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}

                        {subcategory.formStructure.length === 0 && (
                          <p className="text-gray-500 text-center py-4">No form fields added yet</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Categories List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Settings size={24} className="text-white" />
              </div>
              Categories Dashboard
            </h2>
            <p className="text-green-100 mt-1">Manage all your categories and subcategories</p>
          </div>
          
          {categories.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Categories Yet</h3>
              <p className="text-gray-400">Create your first category to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="px-8 py-6 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-200"
                >
                  {/* Main Category */}
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
                        <img 
                          src={category.imageData.url} 
                          alt={category.imageData.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {category.name}
                      </h3>
                      <p className="text-gray-600">
                        {category.subcategories.length} subcategories
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit Category"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full">
                        <span className="text-sm font-semibold text-gray-700">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {category.subcategories.length > 0 && (
                    <div className="ml-20 space-y-2">
                      {category.subcategories.map((subcategory, subIndex) => (
                        <div
                          key={subIndex}
                          className="flex items-center gap-4 p-3 bg-gray-50/50 rounded-lg"
                        >
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200">
                            <img 
                              src={subcategory.imageData.url} 
                              alt={subcategory.imageData.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-gray-700 font-medium">{subcategory.name}</span>
                          {subcategory.formStructure && subcategory.formStructure.length > 0 && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {subcategory.formStructure.length} form fields
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCategory;