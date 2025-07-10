import React, { createContext, useContext, useState } from 'react';

// Create a Context for the image
const ImageContext = createContext();

// ImageProvider to wrap around components that need access to image state
export const ImageProvider = ({ children }) => {
  const [image, setImage] = useState(null);

  return (
    <ImageContext.Provider value={{ image, setImage }}>
      {children}
    </ImageContext.Provider>
  );
};

// Custom hook to access image context
export const useImage = () => {
  return useContext(ImageContext);
};
