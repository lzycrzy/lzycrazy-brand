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
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("categories");
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const handleSaveChanges = () => {
    localStorage.setItem("categories", JSON.stringify(categories));
    alert("Categories saved!");
  };

  const handleEdit = (index) => {
    const newName = prompt("Edit category name:", categories[index]);
    if (newName && newName.trim()) {
      const updated = [...categories];
      updated[index] = newName.trim();
      setCategories(updated);
    }
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-lg shadow-md max-w-4xl mx-auto p-4 sm:p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Category</h2>
          <button
            onClick={handleSaveChanges}
            className="bg-blue-600 text-white px-4 py-2 text-sm sm:text-base rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>

        {/* Category List */}
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 py-3 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 transition"
            >
              <span className="text-gray-800 font-medium mb-2 sm:mb-0">{category}</span>
              <div className="flex flex-wrap gap-2 text-sm">
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
