import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setHiringInProgress } from '../lib/redux/authSlice';
import LoginModal from './Hiring/LoginModal';
import HiringDetailsModal from './Hiring/HiringDetailsModal';

// Main component that orchestrates the two modals
const HiringFormModal = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1); // 1 for login, 2 for details
  const [userData, setUserData] = useState({
    email: '',
    userId: '',
    token: '',
    fullName: '',
    tempUserData: null // Store full user data temporarily
  });
  const dispatch = useDispatch();

  // Handle page refresh during hiring process
  useEffect(() => {
    const hiringInProgress = localStorage.getItem('hiringInProgress') === 'true';
    if (hiringInProgress && !isOpen) {
      // If hiring was in progress but modal is closed, clear the flag
      console.log('Clearing interrupted hiring process');
      dispatch(setHiringInProgress(false));
    }
  }, [isOpen, dispatch]);

  const handleLoginSuccess = (userData) => {
    console.log('Login successful, user data:', userData); // Debug log
    setUserData(userData);
    setCurrentStep(2);
    console.log('Switching to step 2'); // Debug log
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
    setUserData({ email: '', userId: '', token: '', fullName: '', tempUserData: null });
    // Clear hiring in progress flag when going back
    dispatch(setHiringInProgress(false));
  };

  const handleCloseModal = () => {
    setCurrentStep(1);
    setUserData({ email: '', userId: '', token: '', fullName: '', tempUserData: null });
    // Clear hiring in progress flag when closing
    dispatch(setHiringInProgress(false));
    onClose();
  };

  const handleFinalSubmitSuccess = (success) => {
    if (success) {
      // Reset state after successful submission
      setCurrentStep(1);
      setUserData({ email: '', userId: '', token: '', fullName: '', tempUserData: null });
      if (onSubmitSuccess) onSubmitSuccess(success);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {currentStep === 1 && (
        <LoginModal 
          isOpen={true}
          onClose={handleCloseModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {currentStep === 2 && (
        <HiringDetailsModal 
          isOpen={true}
          onClose={handleCloseModal}
          onBack={handleBackToStep1}
          userData={userData}
          onSubmitSuccess={handleFinalSubmitSuccess}
        />
      )}
    </>
  );
};

export default HiringFormModal;