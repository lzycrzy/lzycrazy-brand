// HiringDetailsModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import * as faceapi from 'face-api.js';
import axios from '../../lib/axios/axiosInstance';
import Loader from '../common/Spinner';
import { toast } from 'react-toastify';

const HiringDetailsModal = ({ isOpen, onClose, onBack, userData, onSubmitSuccess }) => {
  const [instruction, setInstruction] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Video recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoURL, setRecordedVideoURL] = useState(null);
  const [recordedVideoBlob, setRecordedVideoBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingMode, setRecordingMode] = useState('upload'); // 'upload' or 'record'
  const recordingTimerRef = useRef(null);
  const mediaRecorderRef = useRef(null);

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

    // Check video duration
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;
      
      if (duration > 15) {
        toast.error('Video must be 15 seconds or less. Please upload a shorter video.');
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Video is valid
      setVideoFile(file);
      setRecordedVideoURL(null);
      setRecordedVideoBlob(null);
      toast.success('Video uploaded successfully!');
    };
    
    video.onerror = () => {
      toast.error('Error loading video file. Please try another file.');
      e.target.value = ''; // Clear the input
    };
    
    video.src = URL.createObjectURL(file);
  };

  // Start video recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true,
      });

      // Set stream to video element for live preview during recording
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // Prevent feedback
        videoRef.current.playsInline = true;
        await videoRef.current.play();
      }

      // Set up MediaRecorder with better browser compatibility
      let options = { mimeType: 'video/webm;codecs=vp9' };
      
      // Fallback for Safari and other browsers
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: 'video/mp4' };
        }
      }

      const recorder = new MediaRecorder(stream, options);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType });
        const url = URL.createObjectURL(blob);
        setRecordedVideoURL(url);
        setRecordedVideoBlob(blob);
        setVideoFile(null); // Clear uploaded file if any
        
        // Stop all tracks and clear video element
        stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        
        toast.success('Video recorded successfully!');
      };

      // Start recording
      recorder.start();
      setMediaRecorder(recorder);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);

      // Start 15-second timer with automatic stop
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          
          // Stop recording at exactly 15 seconds
          if (newTime >= 15) {
            if (recorder.state === 'recording') {
              recorder.stop();
            }
            setIsRecording(false);
            clearInterval(recordingTimerRef.current);
            return 15;
          }
          return newTime;
        });
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Unable to access camera and microphone. Please check permissions.');
    }
  };

  // Stop video recording manually
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  };

  // Re-record video
  const reRecord = () => {
    if (recordedVideoURL) {
      URL.revokeObjectURL(recordedVideoURL);
    }
    setRecordedVideoURL(null);
    setRecordedVideoBlob(null);
    setRecordingTime(0);
  };

  // Delete recorded video
  const deleteRecording = () => {
    if (recordedVideoURL) {
      URL.revokeObjectURL(recordedVideoURL);
    }
    setRecordedVideoURL(null);
    setRecordedVideoBlob(null);
    setRecordingTime(0);
    toast.success('Recording deleted');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if user has either uploaded a file or recorded a video
    if (!videoFile && !recordedVideoBlob) {
      toast.error('Please upload a video file or record a video introduction.');
      setIsSubmitting(false);
      return;
    }

    const form = new FormData();
    
    // Add user data from login step
    form.append('email', userData.email);
    form.append('userId', userData.userId);
    
    // Add form data from step 2
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));
    
    // Add video (either uploaded file or recorded blob)
    if (recordedVideoBlob) {
      // Convert blob to file for upload
      const videoFile = new File([recordedVideoBlob], 'intro-video.webm', {
        type: 'video/webm',
      });
      form.append('video', videoFile);
    } else if (videoFile) {
      form.append('video', videoFile);
    }

    try {
      const response = await axios.post('/v1/users/hiring', form, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${userData.token}`
        },
      });
     
      toast.success('Application submitted successfully!');
      if (onSubmitSuccess) onSubmitSuccess(true);
      
      // Clear form and close modal
      clearForm();
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
    
    // Clear recording states
    setRecordedVideoURL(null);
    setRecordedVideoBlob(null);
    setRecordingTime(0);
    setIsRecording(false);
    setRecordingMode('upload');
    
    // Clear timers
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    
    // Stop any ongoing recording
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    
    // Stop camera if running
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const handleBackClick = () => {
    clearForm();
    onBack();
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Cleanup recording timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      
      // Cleanup video URL
      if (recordedVideoURL) {
        URL.revokeObjectURL(recordedVideoURL);
      }
      
      // Stop any ongoing recording
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      
      // Stop camera
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

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

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                15s Video Introduction <span className="text-red-500">*</span>
              </label>
              
              {/* Recording Mode Toggle */}
              <div className="mt-2 mb-4 flex rounded-lg border border-gray-300 p-1">
                <button
                  type="button"
                  onClick={() => setRecordingMode('upload')}
                  className={`flex-1 rounded-md py-2 px-3 text-sm font-medium transition-colors ${
                    recordingMode === 'upload'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setRecordingMode('record')}
                  className={`flex-1 rounded-md py-2 px-3 text-sm font-medium transition-colors ${
                    recordingMode === 'record'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Record Video
                </button>
              </div>

              {/* File Upload Mode */}
              {recordingMode === 'upload' && (
                <>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="mt-1 w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
                  />
                  <p className="mt-1 text-xs text-gray-500">Max size: 10MB, Max duration: 15 seconds. Formats: MP4, WebM, OGG</p>
                  
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
              )}

              {/* Video Recording Mode */}
              {recordingMode === 'record' && (
                <>
                  {!recordedVideoURL && !isRecording && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={startRecording}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center gap-2"
                      >
                        <span className="w-3 h-3 bg-white rounded-full"></span>
                        Start Recording (15s)
                      </button>
                      <p className="mt-2 text-xs text-gray-500">
                        Click to start recording your 15-second introduction video. Camera will start automatically when recording begins.
                      </p>
                    </div>
                  )}

                  {isRecording && (
                    <div className="mt-2">
                      <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-700 font-medium">Recording...</span>
                          </div>
                          <span className="text-red-700 font-mono text-lg">
                            {recordingTime}/15s
                          </span>
                        </div>
                        
                        <div className="w-full bg-red-200 rounded-full h-2 mb-3">
                          <div 
                            className="bg-red-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${(recordingTime / 15) * 100}%` }}
                          ></div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md"
                        >
                          Stop Recording
                        </button>
                      </div>
                    </div>
                  )}

                  {recordedVideoURL && (
                    <div className="mt-2">
                      <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <p className="text-green-700 font-medium mb-3">✅ Video recorded successfully!</p>
                        
                        <video
                          src={recordedVideoURL}
                          controls
                          className="w-full rounded-md border mb-3"
                          style={{ maxHeight: '200px' }}
                        />
                        
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={reRecord}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm"
                          >
                            Re-record
                          </button>
                          <button
                            type="button"
                            onClick={deleteRecording}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Recording Live Preview - Only show during recording */}
            {isRecording && (
              <div className="relative mt-4 rounded-md border-2 border-red-500 bg-red-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-red-600 font-medium">🔴 Recording Live - {recordingTime}/15s</p>
                </div>
                
                <div className="relative w-full">
                  <video
                    ref={videoRef}
                    className="w-full rounded-md bg-black border-2 border-red-400"
                    muted
                    autoPlay
                    playsInline
                    style={{ maxHeight: '400px' }}
                  />
                  {/* Recording indicator overlay */}
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                    REC
                  </div>
                  <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                    {15 - recordingTime}s left
                  </div>
                </div>
                
                <p className="mt-2 text-center text-sm font-medium text-red-700">
                  Speak clearly and introduce yourself! Recording will auto-stop at 15 seconds.
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

export default HiringDetailsModal;