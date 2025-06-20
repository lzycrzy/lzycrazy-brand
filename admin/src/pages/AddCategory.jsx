import React, { useState } from 'react';
import { 
  Settings, Search, Plus, Edit, Trash2, Upload, X
} from 'lucide-react';

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState({
    icon: null,
    name: '',
    subcategories: []
  });
  const [editingId, setEditingId] = useState(null);

  const handleImageUpload = (file, type = 'category', subIndex = null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          url: e.target.result,
          name: file.name
        };
        
        if (type === 'category') {
          setCategoryData(prev => ({ ...prev, icon: imageData }));
        } else {
          setCategoryData(prev => ({
            ...prev,
            subcategories: prev.subcategories.map((sub, index) =>
              index === subIndex ? { ...sub, icon: imageData } : sub
            )
          }));
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file (JPG, PNG, GIF, etc.)');
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
      subcategories: [...prev.subcategories, { icon: null, name: '' }]
    }));
  };

  const removeSubcategory = (index) => {
    setCategoryData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index)
    }));
  };

  const removeImage = (type = 'category', subIndex = null) => {
    if (type === 'category') {
      setCategoryData(prev => ({ ...prev, icon: null }));
    } else {
      setCategoryData(prev => ({
        ...prev,
        subcategories: prev.subcategories.map((sub, index) =>
          index === subIndex ? { ...sub, icon: null } : sub
        )
      }));
    }
  };

  const handleAdd = () => {
    if (categoryData.icon && categoryData.name) {
      // Filter out empty subcategories
      const validSubcategories = categoryData.subcategories.filter(sub => sub.icon && sub.name);
      
      const newCategory = {
        id: Date.now(),
        icon: categoryData.icon,
        name: categoryData.name,
        subcategories: validSubcategories
      };
      
      if (editingId) {
        setCategories(prev => prev.map(cat => 
          cat.id === editingId ? { ...newCategory, id: editingId } : cat
        ));
        setEditingId(null);
        console.log('Category Updated:', newCategory);
      } else {
        setCategories(prev => [...prev, newCategory]);
        console.log('Category Added:', newCategory);
      }
      
      console.log('All Categories:', editingId ? 
        categories.map(cat => cat.id === editingId ? { ...newCategory, id: editingId } : cat) :
        [...categories, newCategory]
      );
      
      // Reset form
      setCategoryData({
        icon: null,
        name: '',
        subcategories: []
      });
    } else {
      alert('Please upload an image and enter a category name!');
    }
  };

  const handleEdit = (category) => {
    setCategoryData({
      icon: category.icon,
      name: category.name,
      subcategories: category.subcategories
    });
    setEditingId(category.id);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
      console.log('Category Deleted, Remaining:', categories.filter(cat => cat.id !== id));
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCategoryData({
      icon: null,
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
          <p className="text-gray-600 text-lg">Create categories with custom images</p>
        </div>

        {/* Add Category Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 mb-8">
          {/* Category Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Category</h3>
            <div className="flex items-center gap-4">
              {/* Category Image Upload */}
              <div className="flex-shrink-0">
                {categoryData.icon ? (
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                      <img 
                        src={categoryData.icon.url} 
                        alt={categoryData.icon.name}
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
                    <span className="text-xs text-gray-500">Upload</span>
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
                placeholder="Category Name"
                value={categoryData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none transition-all duration-200"
              />
              
              {/* Add Button */}
              <button
                onClick={handleAdd}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              
              {/* Plus Button for Subcategory */}
              <button
                onClick={addSubcategory}
                className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                title="Add Subcategory"
              >
                <Plus size={20} />
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

          {/* Subcategories Section (Optional) */}
          {categoryData.subcategories.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Subcategories (Optional)</h3>
              <div className="space-y-4">
                {categoryData.subcategories.map((subcategory, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl">
                    {/* Subcategory Image Upload */}
                    <div className="flex-shrink-0">
                      {subcategory.icon ? (
                        <div className="relative group">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 shadow-md">
                            <img 
                              src={subcategory.icon.url} 
                              alt={subcategory.icon.name}
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
                          <span className="text-xs text-gray-500">Upload</span>
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
                      placeholder="Subcategory Name"
                      value={subcategory.name}
                      onChange={(e) => handleNameChange(e.target.value, 'subcategory', index)}
                      className="flex-1 px-4 py-2 bg-white/70 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-200"
                    />
                    
                    {/* Remove Subcategory */}
                    <button
                      onClick={() => removeSubcategory(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Remove Subcategory"
                    >
                      <Trash2 size={16} />
                    </button>
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
              <p className="text-gray-400">Add your first category to get started</p>
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
                          src={category.icon.url} 
                          alt={category.icon.name}
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
                              src={subcategory.icon.url} 
                              alt={subcategory.icon.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-gray-700 font-medium">{subcategory.name}</span>
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