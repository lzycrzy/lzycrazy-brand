// import React, { useState } from 'react';
// import { 
//   Home, User, Settings, Mail, Phone, Calendar, Camera, 
//   Heart, Star, Search, ShoppingCart, Bell, Lock, 
//   Globe, Wifi, Battery, Volume2, Bluetooth, Download,
//   Plus, Edit, Trash2, ChevronDown, ChevronUp
// } from 'lucide-react';

// const AddCategory = () => {
//   const [categories, setCategories] = useState([]);
//   const [categoryData, setCategoryData] = useState({
//     icon: null,
//     name: '',
//     subcategories: []
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false);
//   const [openSubDropdowns, setOpenSubDropdowns] = useState({});

//   const iconsList = [
//     { name: 'Home', component: Home },
//     { name: 'User', component: User },
//     { name: 'Settings', component: Settings },
//     { name: 'Mail', component: Mail },
//     { name: 'Phone', component: Phone },
//     { name: 'Calendar', component: Calendar },
//     { name: 'Camera', component: Camera },
//     { name: 'Heart', component: Heart },
//     { name: 'Star', component: Star },
//     { name: 'Search', component: Search },
//     { name: 'ShoppingCart', component: ShoppingCart },
//     { name: 'Bell', component: Bell },
//     { name: 'Lock', component: Lock },
//     { name: 'Globe', component: Globe },
//     { name: 'Wifi', component: Wifi },
//     { name: 'Battery', component: Battery },
//     { name: 'Volume2', component: Volume2 },
//     { name: 'Bluetooth', component: Bluetooth },
//     { name: 'Download', component: Download },
//     { name: 'Plus', component: Plus }
//   ];

//   const handleIconSelect = (icon, type = 'category', subIndex = null) => {
//     if (type === 'category') {
//       setCategoryData(prev => ({ ...prev, icon }));
//       setIsMainDropdownOpen(false);
//     } else {
//       setCategoryData(prev => ({
//         ...prev,
//         subcategories: prev.subcategories.map((sub, index) =>
//           index === subIndex ? { ...sub, icon } : sub
//         )
//       }));
//       setOpenSubDropdowns(prev => ({ ...prev, [subIndex]: false }));
//     }
//   };

//   const handleNameChange = (value, type = 'category', subIndex = null) => {
//     if (type === 'category') {
//       setCategoryData(prev => ({ ...prev, name: value }));
//     } else {
//       setCategoryData(prev => ({
//         ...prev,
//         subcategories: prev.subcategories.map((sub, index) =>
//           index === subIndex ? { ...sub, name: value } : sub
//         )
//       }));
//     }
//   };

//   const addSubcategory = () => {
//     setCategoryData(prev => ({
//       ...prev,
//       subcategories: [...prev.subcategories, { icon: null, name: '' }]
//     }));
//   };

//   const removeSubcategory = (index) => {
//     setCategoryData(prev => ({
//       ...prev,
//       subcategories: prev.subcategories.filter((_, i) => i !== index)
//     }));
//   };

//   const toggleSubDropdown = (index) => {
//     setOpenSubDropdowns(prev => ({
//       ...prev,
//       [index]: !prev[index]
//     }));
//   };

//   const handleAdd = () => {
//     if (categoryData.icon && categoryData.name) {
//       // Filter out empty subcategories
//       const validSubcategories = categoryData.subcategories.filter(sub => sub.icon && sub.name);
      
//       const newCategory = {
//         id: Date.now(),
//         icon: categoryData.icon,
//         name: categoryData.name,
//         subcategories: validSubcategories
//       };
      
//       if (editingId) {
//         setCategories(prev => prev.map(cat => 
//           cat.id === editingId ? { ...newCategory, id: editingId } : cat
//         ));
//         setEditingId(null);
//         console.log('Category Updated:', newCategory);
//       } else {
//         setCategories(prev => [...prev, newCategory]);
//         console.log('Category Added:', newCategory);
//       }
      
//       console.log('All Categories:', editingId ? 
//         categories.map(cat => cat.id === editingId ? { ...newCategory, id: editingId } : cat) :
//         [...categories, newCategory]
//       );
      
//       // Reset form
//       setCategoryData({
//         icon: null,
//         name: '',
//         subcategories: []
//       });
//       setOpenSubDropdowns({});
//     } else {
//       alert('Please select an icon and enter a category name!');
//     }
//   };

//   const handleEdit = (category) => {
//     setCategoryData({
//       icon: category.icon,
//       name: category.name,
//       subcategories: category.subcategories
//     });
//     setEditingId(category.id);
//   };

//   const handleDelete = (id) => {
//     if (confirm('Are you sure you want to delete this category?')) {
//       setCategories(prev => prev.filter(cat => cat.id !== id));
//       console.log('Category Deleted, Remaining:', categories.filter(cat => cat.id !== id));
//     }
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setCategoryData({
//       icon: null,
//       name: '',
//       subcategories: []
//     });
//     setOpenSubDropdowns({});
//   };

//   const CategoryIconComponent = categoryData.icon?.component;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
//             Category Manager
//           </h1>
//           <p className="text-gray-600 text-lg">Create categories with optional subcategories</p>
//         </div>

//         {/* Add Category Form */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 mb-8 relative z-50">
//           {/* Category Section */}
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4">Category</h3>
//             <div className="flex items-center gap-4">
//               {/* Category Icon Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={() => setIsMainDropdownOpen(!isMainDropdownOpen)}
//                   className="px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none transition-all duration-200 text-left flex items-center justify-between min-w-[200px]"
//                 >
//                   <div className="flex items-center gap-3">
//                     {categoryData.icon ? (
//                       <>
//                         <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
//                           <CategoryIconComponent size={20} className="text-white" />
//                         </div>
//                         <span className="text-gray-800 font-medium">{categoryData.icon.name}</span>
//                       </>
//                     ) : (
//                       <span className="text-gray-400">Select Icon...</span>
//                     )}
//                   </div>
//                   <div className={`transition-transform duration-200 ${isMainDropdownOpen ? 'rotate-180' : ''}`}>
//                     <ChevronDown size={20} className="text-gray-400" />
//                   </div>
//                 </button>
                
//                 {isMainDropdownOpen && (
//                   <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl z-[100] max-h-80 overflow-hidden">
//                     <div className="p-4">
//                       <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Icon</h3>
//                       <div className="grid grid-cols-6 gap-2 max-h-60 overflow-y-auto">
//                         {iconsList.map((icon) => {
//                           const IconComp = icon.component;
//                           return (
//                             <button
//                               key={icon.name}
//                               onClick={() => handleIconSelect(icon)}
//                               className="p-3 hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-500 rounded-lg flex flex-col items-center gap-1 transition-all duration-200 border-2 border-transparent hover:border-white"
//                               title={icon.name}
//                             >
//                               <IconComp size={20} className="text-gray-600 hover:text-white transition-colors duration-200" />
//                               <span className="text-xs text-gray-500 hover:text-white/90 font-medium transition-colors duration-200">{icon.name}</span>
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
              
//               {/* Category Name */}
//               <input
//                 type="text"
//                 placeholder="Category Name"
//                 value={categoryData.name}
//                 onChange={(e) => handleNameChange(e.target.value)}
//                 className="flex-1 px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none transition-all duration-200"
//               />
              
//               {/* Add Button */}
//               <button
//                 onClick={handleAdd}
//                 className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
//               >
//                 {editingId ? 'Update' : 'Add'}
//               </button>
              
//               {/* Plus Button for Subcategory */}
//               <button
//                 onClick={addSubcategory}
//                 className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//                 title="Add Subcategory"
//               >
//                 <Plus size={20} />
//               </button>

//               {editingId && (
//                 <button
//                   onClick={cancelEdit}
//                   className="px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200"
//                 >
//                   Cancel
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Subcategories Section (Optional) */}
//           {categoryData.subcategories.length > 0 && (
//             <div>
//               <h3 className="text-lg font-semibold text-gray-700 mb-4">Subcategories (Optional)</h3>
//               <div className="space-y-4">
//                 {categoryData.subcategories.map((subcategory, index) => {
//                   const SubIconComponent = subcategory.icon?.component;
//                   return (
//                     <div key={index} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl">
//                       {/* Subcategory Icon Dropdown */}
//                       <div className="relative">
//                         <button
//                           onClick={() => toggleSubDropdown(index)}
//                           className="px-4 py-2 bg-white/70 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-200 text-left flex items-center justify-between min-w-[180px]"
//                         >
//                           <div className="flex items-center gap-2">
//                             {subcategory.icon ? (
//                               <>
//                                 <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
//                                   <SubIconComponent size={16} className="text-white" />
//                                 </div>
//                                 <span className="text-gray-800 font-medium text-sm">{subcategory.icon.name}</span>
//                               </>
//                             ) : (
//                               <span className="text-gray-400 text-sm">Select Icon...</span>
//                             )}
//                           </div>
//                           <div className={`transition-transform duration-200 ${openSubDropdowns[index] ? 'rotate-180' : ''}`}>
//                             <ChevronDown size={16} className="text-gray-400" />
//                           </div>
//                         </button>
                        
//                         {openSubDropdowns[index] && (
//                           <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl z-[100] max-h-60 overflow-hidden">
//                             <div className="p-3">
//                               <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
//                                 {iconsList.map((icon) => {
//                                   const IconComp = icon.component;
//                                   return (
//                                     <button
//                                       key={icon.name}
//                                       onClick={() => handleIconSelect(icon, 'subcategory', index)}
//                                       className="p-2 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 rounded-lg flex flex-col items-center gap-1 transition-all duration-200 border-2 border-transparent hover:border-white"
//                                       title={icon.name}
//                                     >
//                                       <IconComp size={16} className="text-gray-600 hover:text-white transition-colors duration-200" />
//                                       <span className="text-xs text-gray-500 hover:text-white/90 font-medium transition-colors duration-200">{icon.name}</span>
//                                     </button>
//                                   );
//                                 })}
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
                      
//                       {/* Subcategory Name */}
//                       <input
//                         type="text"
//                         placeholder="Subcategory Name"
//                         value={subcategory.name}
//                         onChange={(e) => handleNameChange(e.target.value, 'subcategory', index)}
//                         className="flex-1 px-4 py-2 bg-white/70 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-200"
//                       />
                      
//                       {/* Remove Subcategory */}
//                       <button
//                         onClick={() => removeSubcategory(index)}
//                         className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
//                         title="Remove Subcategory"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Categories List */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden relative z-10">
//           <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-6">
//             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
//               <div className="p-2 bg-white/20 rounded-lg">
//                 <Settings size={24} className="text-white" />
//               </div>
//               Categories Dashboard
//             </h2>
//             <p className="text-green-100 mt-1">Manage all your categories and subcategories</p>
//           </div>
          
//           {categories.length === 0 ? (
//             <div className="p-12 text-center">
//               <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Search size={32} className="text-gray-400" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-600 mb-2">No Categories Yet</h3>
//               <p className="text-gray-400">Add your first category to get started</p>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {categories.map((category, index) => {
//                 const CategoryIcon = category.icon.component;
//                 return (
//                   <div
//                     key={category.id}
//                     className="px-8 py-6 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-200"
//                   >
//                     {/* Main Category */}
//                     <div className="flex items-center gap-6 mb-4">
//                       <div className="flex-shrink-0">
//                         <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
//                           <CategoryIcon size={24} className="text-white" />
//                         </div>
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h3 className="text-xl font-bold text-gray-800 mb-1">
//                           {category.name}
//                         </h3>
//                         <p className="text-gray-600">
//                           {category.subcategories.length} subcategories
//                         </p>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => handleEdit(category)}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
//                           title="Edit Category"
//                         >
//                           <Edit size={16} />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(category.id)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
//                           title="Delete Category"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                         <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full">
//                           <span className="text-sm font-semibold text-gray-700">
//                             #{index + 1}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Subcategories */}
//                     {category.subcategories.length > 0 && (
//                       <div className="ml-20 space-y-2">
//                         {category.subcategories.map((subcategory, subIndex) => {
//                           const SubIcon = subcategory.icon.component;
//                           return (
//                             <div
//                               key={subIndex}
//                               className="flex items-center gap-4 p-3 bg-gray-50/50 rounded-lg"
//                             >
//                               <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//                                 <SubIcon size={16} className="text-white" />
//                               </div>
//                               <span className="text-gray-700 font-medium">{subcategory.name}</span>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
        
//       </div>
//     </div>
//   );
// };

// export default AddCategory;
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
