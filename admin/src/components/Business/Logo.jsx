import React, { useState } from 'react';

const Logo=()=> {
  const [logo, setLogo] = useState(null);
  const [location, setLocation] = useState("311, Block 2, Sector 29 Noida Uttar Pradesh");

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
      console.log("Logo updated:", file.name);
    }
  };

  const handleSave = () => {
    alert("Changes saved!");
    console.log("Company Address:", location);
    console.log("Logo URL:", logo);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Logo Management</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Logo Section */}
          <div className="flex flex-col items-center">
            {logo ? (
              <img
                src={logo}
                alt="Logo"
                className="w-32 h-32 object-contain border rounded"
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center bg-gray-200 text-gray-500 border rounded">
                No Logo
              </div>
            )}
            <label className="mt-3 text-blue-600 cursor-pointer hover:underline">
              Upload Logo
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Address Input */}
          <div>
            <label className="block font-medium mb-2">Company Address</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
export default Logo;