
import React, { useState } from "react";

const LocationModal = ({ isOpen, onClose, onSelect }) => {
  const [search, setSearch] = useState("");
  const [locations] = useState([
    "New Delhi, India",
    "Mumbai, India",
    "Bangalore, India",
    "Noida, India",
    "Kolkata, India",
    "Hyderabad, India",
    "Chennai, India",
  ]);

  const filtered = locations.filter((loc) =>
    loc.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-transparent backdrop-blur-sm bg-black/30 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-md p-5 rounded shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 text-xl hover:text-black"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">📍 Add Location</h2>
        <input
          type="text"
          placeholder="Search location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <ul className="max-h-48 overflow-y-auto divide-y">
          {filtered.map((loc, index) => (
            <li
              key={index}
              onClick={() => {
                onSelect(loc);
                onClose();
              }}
              className="cursor-pointer py-2 px-3 hover:bg-gray-100"
            >
              📍 {loc}
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="py-2 px-3 text-gray-500 text-sm">No location found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default LocationModal;
