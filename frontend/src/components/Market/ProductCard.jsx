import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ post }) => {
    if (!post) return null; // Safety check
  
    return (
      <div className="bg-white rounded shadow p-4 hover:shadow-md transition cursor-pointer">
        <img
          src={post.images[0]}
          alt={post.title}
          className="w-full h-48 object-cover rounded"
        />
        <h3 className="mt-2 text-lg font-semibold">{post.title}</h3>
        <p className="text-green-700 font-bold">{post.price}</p>
        <p className="text-gray-500 text-sm">{post.location?.area}</p>
        <p className="text-gray-600 text-sm">{post.location?.coordinates?.join(', ')}</p>
      </div>
    );
  };

export default ProductCard;
