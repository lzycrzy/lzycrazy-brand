import React, { useState } from 'react';
import { Plus, Edit, Trash2, ChevronDown } from 'lucide-react';

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState({
    image: null,
    name: '',
    subcategories: [],
    fields: []
  });
  const [editingId, setEditingId] = useState(null);

  const handleImageChange = (e, type = 'category', index = null) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (type === 'category') {
        setCategoryData(prev => ({ ...prev, image: imageUrl }));
      } else {
        setCategoryData(prev => ({
          ...prev,
          subcategories: prev.subcategories.map((sub, i) =>
            i === index ? { ...sub, image: imageUrl } : sub
          )
        }));
      }
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
      subcategories: [...prev.subcategories, { image: null, name: '' }]
    }));
  };

  const removeSubcategory = (index) => {
    setCategoryData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index)
    }));
  };

  const addField = () => {
    setCategoryData(prev => ({
      ...prev,
      fields: [...prev.fields, { label: '', type: 'text' }]
    }));
  };

  const updateField = (index, key, value) => {
    setCategoryData(prev => ({
      ...prev,
      fields: prev.fields.map((field, i) =>
        i === index ? { ...field, [key]: value } : field
      )
    }));
  };

  const removeField = (index) => {
    setCategoryData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const handleAdd = () => {
    const newCategory = {
      id: Date.now(),
      ...categoryData
    };
    if (editingId) {
      setCategories(prev => prev.map(cat => cat.id === editingId ? { ...newCategory, id: editingId } : cat));
      setEditingId(null);
    } else {
      setCategories(prev => [...prev, newCategory]);
    }
    setCategoryData({ image: null, name: '', subcategories: [], fields: [] });
  };

  const handleEdit = (category) => {
    setCategoryData(category);
    setEditingId(category.id);
  };

  const handleDelete = (id) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Add Category</h2>

      <input type="file" onChange={(e) => handleImageChange(e)} />
      {categoryData.image && <img src={categoryData.image} alt="category" className="w-20 h-20 object-cover" />}

      <input
        type="text"
        placeholder="Category Name"
        value={categoryData.name}
        onChange={(e) => handleNameChange(e.target.value)}
      />

      <button onClick={addSubcategory}>+ Add Subcategory</button>
      {categoryData.subcategories.map((sub, index) => (
        <div key={index}>
          <input
            type="file"
            onChange={(e) => handleImageChange(e, 'subcategory', index)}
          />
          {sub.image && <img src={sub.image} alt="subcategory" className="w-16 h-16 object-cover" />}

          <input
            type="text"
            placeholder="Subcategory Name"
            value={sub.name}
            onChange={(e) => handleNameChange(e.target.value, 'subcategory', index)}
          />
          <button onClick={() => removeSubcategory(index)}>Remove</button>
        </div>
      ))}

      <hr className="my-4" />

      <h3>Fields</h3>
      <button onClick={addField}>+ Add Field</button>
      {categoryData.fields.map((field, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Field Label"
            value={field.label}
            onChange={(e) => updateField(index, 'label', e.target.value)}
          />
          <select
            value={field.type}
            onChange={(e) => updateField(index, 'type', e.target.value)}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="select">Select</option>
          </select>
          <button onClick={() => removeField(index)}>Remove</button>
        </div>
      ))}

      <button onClick={handleAdd}>{editingId ? 'Update' : 'Add'} Category</button>

      <hr className="my-6" />

      <h2 className="text-xl font-bold mb-4">Categories</h2>
      {categories.map(cat => (
        <div key={cat.id} className="mb-4">
          <img src={cat.image} alt="category" className="w-16 h-16 object-cover inline-block mr-2" />
          <strong>{cat.name}</strong>
          <button onClick={() => handleEdit(cat)}>Edit</button>
          <button onClick={() => handleDelete(cat.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default AddCategory;