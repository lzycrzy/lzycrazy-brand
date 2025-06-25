import React, { useState } from "react";

const initialCategories = [
  "Villa",
  "Interior Design",
  "Apartments",
  "Commercial",
  "Documentation",
  "Land & Plots",
];

const Category = () => {
  // Load categories from localStorage if available
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("categories");
    return saved ? JSON.parse(saved) : initialCategories;
  });

  // Save changes to localStorage
  const handleSaveChanges = () => {
    localStorage.setItem("categories", JSON.stringify(categories));
    alert(" Categories saved!");
  };

  // Edit a category
  const handleEdit = (index) => {
    const newName = prompt("Edit category name:", categories[index]);
    if (newName && newName.trim()) {
      const updated = [...categories];
      updated[index] = newName.trim();
      setCategories(updated);
    }
  };

  // Delete a category
  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="p-10 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Category</h2>
          <button
            onClick={handleSaveChanges}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>

        {/* Category List */}
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex justify-between items-center px-4 py-3 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 transition"
            >
              <span className="text-gray-800 font-medium">{category}</span>
              <div className="flex space-x-3 text-sm">
                <button
                  onClick={() => handleEdit(index)}
                  className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
