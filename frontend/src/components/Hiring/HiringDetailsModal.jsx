import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import * as faceapi from 'face-api.js';
import { toast } from 'react-toastify';
import axios from '../../lib/axios/axiosInstance';
import { completeHiringLogin } from '../../lib/redux/authSlice';
import { useUser } from '../../context/UserContext';
import Loader from '../common/Spinner';

// Reusable Input Component
const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  required = false,
  min,
  max,
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
      min={min}
      max={max}
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

// Reusable Textarea Component
const Textarea = ({
  label,
  name,
  value,
  onChange,
  rows = 3,
  required = false,
  placeholder = '',
}) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      required={required}
      placeholder={placeholder}
      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-colors resize-vertical"
    ></textarea>
  </div>
);

const HiringDetailsModal = ({ isOpen, onClose, onBack, userData, onSubmitSuccess }) => {
  const [cameraOn, setCameraOn] = useState(false);
  const [instruction, setInstruction] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dispatch = useDispatch();
  const { fetchUser } = useUser();

  const [formData, setFormData] = useState({
    country: '',
    state: '',
    city: '',
    location: '',
    education: '',
    age: '',
    height: '',
    weight: '',
    jobCategory: '',
    experience: '',
    about: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    const acceptedTypes = ['video/mp4', 'video/webm', 'video/ogg'];

    if (!acceptedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a video in MP4, WebM, or Ogg format.');
      return;
    }

    if (file.size > maxSize) {
      toast.error('File too large. Please upload a video less than 10MB.');
      return;
    }
    setVideoFile(file);
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      } catch (error) {
        console.error('Error loading face detection models:', error);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error('Camera error:', err);
        toast.error('Unable to access camera. Please check camera permissions.');
      }
    };

    const stopCamera = () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };

    if (cameraOn) startCamera();
    else stopCamera();

    return () => stopCamera();
  }, [cameraOn]);

  useEffect(() => {
    const detectFace = async () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        try {
          const detection = await faceapi.detectSingleFace(
            video,
            new faceapi.TinyFaceDetectorOptions(),
          );

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const dims = faceapi.matchDimensions(canvas, video, true);
          const guideBox = {
            x: dims.width / 2 - 100,
            y: dims.height / 2 - 100,
            width: 200,
            height: 200,
          };

          ctx.strokeStyle = 'gray';
          ctx.lineWidth = 2;
          ctx.strokeRect(guideBox.x, guideBox.y, guideBox.width, guideBox.height);

          if (detection && detection.box) {
            const resizedDetection = faceapi.resizeResults(detection, dims);
            const box = resizedDetection.box;
            const isInsideGuideBox =
              box.x > guideBox.x &&
              box.y > guideBox.y &&
              box.x + box.width < guideBox.x + guideBox.width &&
              box.y + box.height < guideBox.y + guideBox.height;

            ctx.strokeStyle = isInsideGuideBox ? 'green' : 'red';
            ctx.lineWidth = 3;
            ctx.strokeRect(box.x, box.y, box.width, box.height);

            setInstruction(
              isInsideGuideBox
                ? '✅ Face aligned – Good!'
                : '❗ Face not centered – Move face to center'
            );
          } else {
            setInstruction('❗ Face not detected – Please center your face.');
          }
        } catch (error) {
          console.error('Face detection error:', error);
        }
      }
    };

    if (cameraOn) {
      intervalRef.current = setInterval(detectFace, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [cameraOn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    
    // Add user data from login step
    form.append('email', userData.email);
    form.append('userId', userData.userId);
    
    // Add form data from step 2
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));
    
    if (videoFile) form.append('video', videoFile);

    try {
      const response = await axios.post('/v1/users/hiring', form, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${userData.token}`
        },
      });
     
      toast.success('Application submitted successfully!');
      
      // NOW complete the login process after successful hiring form submission
      if (userData.token && userData.tempUserData) {
        // Complete the hiring login process
        dispatch(completeHiringLogin({ 
          data: userData.tempUserData, 
          token: userData.token 
        }));

        // Update context
        fetchUser();
      }
      
      if (onSubmitSuccess) onSubmitSuccess(true);
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Submission failed. Please try again.';
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
      location: '',
      education: '',
      age: '',
      height: '',
      weight: '',
      jobCategory: '',
      experience: '',
      about: '',
    });
    setVideoFile(null);
    setInstruction('');
    setCameraOn(false);
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
          onClick={onClose}
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
          onClick={onBack}
          className="mb-4 self-start text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          ← Back to login
        </button>

        <div className="max-h-[calc(95vh-200px)] flex-grow overflow-y-auto pr-2">
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
              <Input
                required
                label="Age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Your age"
                min="18"
                max="65"
              />
              <Input
                required
                label="Height (cm)"
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Height in centimeters"
                min="100"
                max="250"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                required
                label="Weight (kg)"
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Weight in kilograms"
                min="30"
                max="200"
              />
              <Select
                required
                label="Select Job Category"
                name="jobCategory"
                value={formData.jobCategory}
                onChange={handleChange}
                options={['Marketing', 'Sales', 'Development', 'Operations', 'Design', 'HR', 'Finance']}
              />
            </div>

            <Select
              required
              label="Select Experience Level"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              options={['Fresher', '1-2 Years', '3-5 Years', '5+ Years']}
            />

            <Textarea
              required
              label="About Yourself (Max 50 Words)"
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us about yourself in 50 words or less..."
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Upload 15s Video Introduction <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  required
                  className="mt-1 w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
                />
                <p className="mt-1 text-xs text-gray-500">Max size: 10MB. Formats: MP4, WebM, OGG</p>
                
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="cameraToggle"
                    className="h-4 w-4 accent-blue-600"
                    checked={cameraOn}
                    onChange={() => setCameraOn(!cameraOn)}
                  />
                  <label htmlFor="cameraToggle" className="text-sm text-gray-700">
                    Open Camera for Preview
                  </label>
                </div>
              </div>

              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">
                  Example Video
                </p>
                <video
                  src="/example.mp4"
                  controls
                  className="w-full rounded-md border"
                  style={{ maxHeight: '200px' }}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Record a 15-second introduction video like this example
                </p>
              </div>
            </div>

            {cameraOn && (
              <div className="relative mt-4 rounded-md border border-blue-300 bg-gray-50 p-4">
                <p className="mb-2 text-sm text-blue-600 font-medium">📷 Camera Preview</p>
                <ul className="mb-4 list-inside list-disc text-sm text-gray-600">
                  <li>Ensure face is centered in the gray frame</li>
                  <li>Good lighting is recommended</li>
                  <li>Neutral background is preferred</li>
                  <li>Speak clearly and introduce yourself</li>
                </ul>
                <div className="relative w-full">
                  <video
                    ref={videoRef}
                    className="w-full rounded-md bg-black"
                    muted
                    autoPlay
                    playsInline
                    style={{ maxHeight: '400px' }}
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 h-full w-full"
                  />
                </div>
                <p className="mt-2 text-center text-sm font-medium text-blue-700">
                  {instruction}
                </p>
              </div>
            )}

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
                disabled={isSubmitting || !videoFile}
                className={`rounded-md px-6 py-2 text-white font-medium transition-colors ${
                  isSubmitting || !videoFile
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

export default HiringDetailsModal;