import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from '../../lib/axios/axiosInstance';
import Loader from '../common/Spinner';
import { toast } from 'react-toastify';
import RecordingModal from './RecordingModal';

const HiringDetailsModal = ({
  isOpen,
  onClose,
  onBack,
  userData,
  onSubmitSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordingMode, setRecordingMode] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [recordedVideoBlob, setRecordedVideoBlob] = useState(null);
  const [introWordCount, setIntroWordCount] = useState(0);
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    city: '',
    education: '',
    experienceLevel: '',
    jobCategory: '',
    introduction: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'introduction') {
      setIntroWordCount(value.trim().split('').length);
      if (introWordCount + 1 >= 50) {
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
    const wordCount = formData.introduction.trim().split(/\s+/).filter((word) => word.length > 0).length;
    if (wordCount > 50) {
      toast.error('Introduction must not exceed 50 words');
      return false;
    }
    if (wordCount === 0) {
      toast.error('Introduction is required');
      return false;
    }
    if (!videoFile && !recordedVideoBlob) {
      toast.error('Please upload a video file or record a video introduction.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key].trim());
    });
    if (recordedVideoBlob) {
      const videoFileFromBlob = new File([recordedVideoBlob], 'intro-video.webm', { type: 'video/webm' });
      form.append('video', videoFileFromBlob);
    } else if (videoFile) {
      form.append('video', videoFile);
    }
    form.append('name', userData.name);
    try {
      const response = await axios.post('/v1/hiring', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Application submitted successfully!');
      if (onSubmitSuccess) onSubmitSuccess(true);
      clearForm();
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.[0] || 'Submission failed. Please try again.';
      toast.error(msg);
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setFormData({
      name: '', country: '', state: '', city: '', education: '', experienceLevel: '', jobCategory: '', introduction: '',
    });
    setVideoFile(null);
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

  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 px-4">
      {isSubmitting && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <Loader className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      )}

      <div className="relative w-full max-w-lg h-[90vh] sm:h-[90vh] overflow-hidden flex flex-col rounded-lg bg-white p-4 sm:p-6 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-red-500"
        >
          &times;
        </button>

        <h2 className="mb-1 text-center text-xl font-bold text-blue-700">
          COMPLETE YOUR APPLICATION
        </h2>
        <p className="mb-2 text-center text-sm text-gray-600">
          Welcome, {userData?.name || 'User'}! Please complete your hiring form.
        </p>

        <button
          onClick={handleBackClick}
          className="mb-3 sm:mb-4 flex items-center gap-1 self-start text-sm text-blue-600 hover:underline"
        >
          ← Back to login
        </button>

        <div className="mb-2 px-2 text-sm sm:text-base font-semibold text-gray-600">
          <span>Your LzyCrazyID: lcxxxxxxx{userData?.companyId.slice(10)}</span>
        </div>

        <div className="scrollbar flex-grow overflow-y-auto pr-1 sm:pr-2">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input required label="Country" name="country" value={formData.country} onChange={handleChange} placeholder="Enter your country" />
              <Input required label="State" name="state" value={formData.state} onChange={handleChange} placeholder="Enter your state" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input required label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Enter your city" />
              <Input required label="Education" name="education" value={formData.education} onChange={handleChange} placeholder="Your highest education" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select required label="Experience Level" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} options={['Dream Job', 'Experience ', 'First Job', 'Fresher', 'Internship']} />
              <Select required label="Job Category" name="jobCategory" value={formData.jobCategory} onChange={handleChange}
                options={[
                  '3D Designer',
                  'Architecture Designer',
                  'Area Manager',
                  'Bank Manager',
                  'Billing Executive',
                  'Business Analyst',
                  'Business Development Executive',
                  'CA CS ',
                  'Civil Engineer',
                  'Construction Engineer',
                  'Content Writer',
                  'Cricket Coach',
                  'Customer Service Executive',
                  'Delivery Executive',
                  'Django Developer',
                  'E-Commerce Manager',
                  'Ethical Hacker Engineer',
                  'Event Management Executive',
                  'Fashion Designer',
                  'Field Executive',
                  'Finance Advisor',
                  'Football Coach ',
                  'Graphic Designer',
                  'Hardware Engineer',
                  'Interior Designer',
                  'Java, Developer',
                  'Kotlin, Developer',
                  'Laser Engineer',
                  'Legal Advisor',
                  'Lens Engineer',
                  'Light Technology Engineer',
                  'Marketing & Sales Executive',
                  'Marketing Boys',
                  'Marketing Girls',
                  'Motion Graphic',
                  'Network Engineer',
                  'Node Developer',
                  'Payment Gateway Engineer',
                  'Property Sales Executive',
                  'Python Developer',
                  'React Developer',
                  'Real State Manager',
                  'Sales Manager',
                  'Scanner Engineer',
                  'Security Executive',
                  'Software Developer',
                  'Software Engineer',
                  'Swift, Developer',
                  'Tele-Caller Executive',
                  'UI UX Designer',
                  'VFX Designer',
                ]}
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
                required
                placeholder="Tell us about yourself in 50 words or less..."
                className="w-full rounded-md border border-gray-300 px-4 py-2 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
              />
              <div className="mt-1 flex items-center justify-between">
                <p className="text-xs text-gray-500">Word count: {introWordCount}/50</p>
                {introWordCount > 45 && (
                  <p className="text-xs font-medium text-orange-600">{50 - introWordCount} words remaining</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                15s Video Introduction <span className="text-red-500">*</span>
                <span className={`${recordedVideoBlob ? 'flex text-green-500' : 'hidden'}`}>Video Recorded Successfully</span>
              </label>
              <div className="mt-2 mb-4 flex rounded-lg border border-gray-300 p-1">
                <button
                  type="button"
                  onClick={() => setRecordingMode(true)}
                  className="flex-1 rounded-md px-3 py-2 text-sm font-medium"
                >
                  Record Video
                </button>
              </div>
              {recordingMode && (
                <RecordingModal
                  setRecordingMode={setRecordingMode}
                  recordingMode={recordingMode}
                  setRecordedVideoBlob={setRecordedVideoBlob}
                  setVideoFile={setVideoFile}
                />
              )}
            </div>

            <div className="flex justify-end gap-3 border-t pt-4 sm:pt-6">
              <button
                type="submit"
                disabled={isSubmitting || (!videoFile && !recordedVideoBlob)}
                className={`rounded-md px-6 py-2 font-medium text-white ${isSubmitting || (!videoFile && !recordedVideoBlob) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isSubmitting ? 'Submitting...' : 'SUBMIT APPLICATION'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

const Input = ({ label, name, value, onChange, placeholder = '', type = 'text', required = false }) => (
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
      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-colors text-sm"
    />
  </div>
);

const Select = ({ label, name, value, onChange, options = [], required = false }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
    >
      <option value="">-- Select --</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default HiringDetailsModal;