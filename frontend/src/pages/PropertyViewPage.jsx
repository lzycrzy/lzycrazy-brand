import React from 'react';
import { useLocation } from 'react-router-dom';
import PropertyListing from '../components/ProductDetail/ProductListing';

const PropertyViewPage = () => {
  const { state } = useLocation();

  if (!state?.data) {
    return (
      <div className="text-center mt-10 text-xl text-red-600">
        No Property Data Provided
      </div>
    );
  }

  return <PropertyListing data={state.data} images={state.images || []} />;
};

export default PropertyViewPage;
