// HiringDetailsModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from '../../lib/axios/axiosInstance';
import Loader from '../common/Spinner';
import { toast } from 'react-toastify';
import RecordingModal from './RecordingModal';

const HiringDetailsModal = ({ isOpen, onClose, onBack, userData, onSubmitSuccess }) => {

  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordingMode, setRecordingMode] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [recordedVideoBlob, setRecordedVideoBlob] = useState(null);

  const [formData, setFormData] = useState({
    country: '',
    state: '',
    city: '',
    education: '',
    experienceLevel: '',
    jobCategory: '',
    introduction: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle introduction word count validation
    if (name === 'introduction') {
      const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
      if (wordCount > 50) {
        toast.error('Introduction cannot exceed 50 words');
        return;
      }
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const validateForm = () => {
    const requiredFields = {
      country: 'Country',
      state: 'State', 
      city: 'City',
      education: 'Education',
      experienceLevel: 'Experience Level',
      jobCategory: 'Job Category',
      introduction: 'Introduction',
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field].trim()) {
        toast.error(`${label} is required`);
        return false;
      }
    }

    // Validate introduction word count
    const wordCount = formData.introduction.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount > 50) {
      toast.error('Introduction must not exceed 50 words');
      return false;
    }

    if (wordCount === 0) {
      toast.error('Introduction is required');
      return false;
    }

    // Check if video is provided
    if (!videoFile && !recordedVideoBlob) {
      toast.error('Please upload a video file or record a video introduction.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    console.log(formData)
    const form = new FormData();
    
    // Add form data
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key].trim());
    });
    
    // Add video (recorded blob)
    if (recordedVideoBlob) {
      // Convert blob to file for upload
      const videoFileFromBlob = new File([recordedVideoBlob], 'intro-video.webm', {
        type: 'video/webm',
      });
      
      form.append('video', videoFileFromBlob);
    } else if (videoFile) {
      form.append('video', videoFile);
    }

    try {
      // API endpoint matching your backend route and baseURL
      const response = await axios.post('/v1/hiring', form, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
      });
     
      toast.success('Application submitted successfully!');
      if (onSubmitSuccess) onSubmitSuccess(true);
      
      // Clear form and close modal
      clearForm();
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || 
                  err?.response?.data?.errors?.[0] || 
                  'Submission failed. Please try again.';
      toast.error(msg);
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setFormData({
      country: '',
      state: '',
      city: '',
      education: '',
      experienceLevel: '',
      jobCategory: '',
      introduction: '',
    });
    setVideoFile(null);
    
    // Clear recording states
    setRecordedVideoBlob(null);
    setRecordingMode(false);
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const handleBackClick = () => {
    clearForm();
    onBack();
  };


  // Get current word count for introduction
  const getWordCount = () => {
    return formData.introduction.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[1000] flex h-screen w-screen items-center justify-center backdrop-blur-sm">
      {isSubmitting && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <Loader className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      )}
      
      <div className="relative flex h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white p-6 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500"
        >
          &times;
        </button>

        <h2 className="mb-1 text-center text-xl font-bold text-blue-700">
          COMPLETE YOUR APPLICATION
        </h2>
        <p className="mb-2 text-center text-sm text-gray-600">
          Welcome, <strong>{userData?.fullName || 'User'}</strong>! Please complete your hiring form.
        </p>
        
        <button
          onClick={handleBackClick}
          className="mb-4 self-start text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          ← Back to login
        </button>
        <div className='px-2 text-gray-600 text-sm mb-2'>
          <span>Your LzyCrazyID: lcxxxxxxx{userData.tempUserData.companyId.slice(10)}</span>
        </div>

        <div className="max-h-[calc(95vh-200px)] flex-grow overflow-y-auto pr-2 pl-2">
          <form className="space-y-4" onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                required
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter your country"
              />
              <Input
                required
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter your state"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                required
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
              />
              <Input
                required
                label="Education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="Your highest education"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                required
                label="Experience Level"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                options={['Fresher', 'Junior', 'Mid-level', 'Senior', 'Expert']}
              />
              <Select
                required
                label="Job Category"
                name="jobCategory"
                value={formData.jobCategory}
                onChange={handleChange}
                options={['Marketing', 'Sales', 'Development', 'Operations', 'Design', 'HR', 'Finance', 'Engineering', 'Customer Service', 'Content Writing', 'Data Analysis', 'Project Management']}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Introduction (Max 50 Words) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="introduction"
                value={formData.introduction}
                onChange={handleChange}
                rows={4}
                required
                placeholder="Tell us about yourself in 50 words or less..."
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-colors resize-vertical"
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                  Word count: {getWordCount()}/50
                </p>
                {getWordCount() > 45 && (
                  <p className="text-xs text-orange-600 font-medium">
                    {50 - getWordCount()} words remaining
                  </p>
                )}
              </div>
            </div>

            <div className=''>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                15s Video Introduction <span className="text-red-500">*</span>
                <span className={`${recordedVideoBlob ? "flex text-green-500" : "hidden"}`}>Video Recorded Successfully</span>
              </label>
              
              {/* Recording Mode Toggle */}
              <div className="mt-2 mb-4 flex rounded-lg border border-gray-300 p-1">
                {/* <button
                  type="button"
                  onClick={() => setRecordingMode('upload')}
                  className={`flex-1 rounded-md py-2 px-3 text-sm font-medium transition-colors ${
                    recordingMode === 'upload'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Upload File
                </button> */}

                <button
                  type="button"
                  onClick={() => setRecordingMode(true)}
                  className={` flex-1 rounded-md py-2 px-3 text-sm font-medium transition-colors`}
                >
                  Record Video
                </button>
              </div>

              {/* File Upload Mode */}
              {/* {recordingMode === 'upload' && (
                <>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="mt-1 w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
                  />
                  <p className="mt-1 text-xs text-gray-500">Max size: 50MB, Max duration: 15 seconds. Formats: MP4, WebM, MOV, AVI, etc.</p>
                  
                  {videoFile && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-700 font-medium">✅ Video uploaded successfully!</p>
                      <p className="text-xs text-green-600 mt-1">File: {videoFile.name}</p>
                      <video
                        src={URL.createObjectURL(videoFile)}
                        controls
                        className="w-full rounded-md border mt-2"
                        style={{ maxHeight: '150px' }}
                      />
                    </div>
                  )}
                </>
              )} */}

              {recordingMode && <RecordingModal setRecordingMode={setRecordingMode} recordingMode={recordingMode} setRecordedVideoBlob={setRecordedVideoBlob} setVideoFile={setVideoFile} />}
            </div>

            {/* Recording Live Preview - Only show during recording */}
            

            <div className="flex justify-between gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={clearForm}
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 transition-colors"
              >
                Clear Form
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || (!videoFile && !recordedVideoBlob)}
                className={`rounded-md px-6 py-2 text-white font-medium transition-colors ${
                  isSubmitting || (!videoFile && !recordedVideoBlob)
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'SUBMIT APPLICATION'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
};

// Reusable Input Component
const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  required = false,
}) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-colors"
    />
  </div>
);

// Reusable Select Component
const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
}) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-colors"
    >
      <option value="">-- Select --</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default HiringDetailsModal;