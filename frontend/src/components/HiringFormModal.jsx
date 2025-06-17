import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import * as faceapi from 'face-api.js';
import axios from '../lib/axios/axiosInstance';
import Loader from '../components/Spinner';

const HiringFormModal = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [cameraOn, setCameraOn] = useState(false);
  const [instruction, setInstruction] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    lycrazyId: '',
    country: '',
    state: '',
    city: '',
    location: '',
    education: '',
    age: '',
    height: '',
    weight: '',
    phone: '',
    email: '',
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
      alert(
        'Invalid file type. Please upload a video in MP4, WebM, or Ogg format.',
      );
      return;
    }

    if (file.size > maxSize) {
      alert('File too large. Please upload a video less than 10MB.');
      return;
    }
    setVideoFile(e.target.files[0]);
  };

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    };
    loadModels();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
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
              ? ' Face aligned – Good!'
              : '❗ Face not centered – Move face to center'
          );
        } else {
          setInstruction('❗ Face not detected – Please center your face.');
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
    setIsSubmitting(true); // 🚀 Start spinner

    const form = new FormData();
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));
    if (videoFile) form.append('video', videoFile);

    try {
      await axios.post('/v1/users/hiring', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Submitted!');
      if (onSubmitSuccess) onSubmitSuccess(true);
      onClose();
    } catch (err) {
      alert('Submission failed');
      console.error(err);
    } finally {
      setIsSubmitting(false); // ✅ Stop spinner
    }
  };
  if (!isOpen) return null;
    if (isSubmitting) return <Loader />;
  return ReactDOM.createPortal(
    <div className="bg-opacity-40 fixed inset-0 z-[1000] flex h-screen w-screen items-center justify-center backdrop-blur-sm">
      <div className="relative flex h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500"
        >
          &times;
        </button>

        <h2 className="mb-1 text-center text-xl font-bold text-blue-700">
          WE ARE HIRING
        </h2>
        <p className="text-center text-sm text-gray-600">
          Please sign up to get your <strong>LyCrazy ID</strong>.<br />
          Then enter your LyCrazy ID (e.g. <code>lc09240031</code>) below.
        </p>
        <p className="mb-4 text-center text-sm text-blue-600 hover:underline">
          <a href="/signup" target="_blank" rel="noopener noreferrer">
            Sign Up Here
          </a>
        </p>

        <div className="max-h-[calc(95vh-150px)] flex-grow overflow-y-auto pr-2">
          <form className="space-y-1" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                required
                label="LyCrazy ID"
                name="lycrazyId"
                value={formData.lycrazyId}
                onChange={handleChange}
                placeholder="e.g. lc09240031"
              />
              <Input
                required
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                required
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
              <Input
                required
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                required
                label="Education"
                name="education"
                value={formData.education}
                onChange={handleChange}
              />
              <Input
                required
                label="Age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                required
                label="Height (cm)"
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
              />
              <Input
                required
                label="Weight (kg)"
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                required
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
              />
              <Input
                required
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                required
                label="Select Job Category"
                name="jobCategory"
                value={formData.jobCategory}
                onChange={handleChange}
                options={['Marketing', 'Sales', 'Development', 'Operations']}
              />
              <Select
                required
                label="Select Experience Level"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                options={['Fresher', '1-2 Years', '3-5 Years', '5+ Years']}
              />
            </div>

            <Textarea
              required
              label="About Yourself (20 Words)"
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows={2}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Upload 15s Video
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  required
                  className="mt-1 w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
                />
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-blue-600"
                    checked={cameraOn}
                    onChange={() => setCameraOn(!cameraOn)}
                  />
                  <span className="text-sm text-gray-700">Open Camera</span>
                </div>
              </div>

              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">
                  Example Video
                </p>
                <video
                  src="/example.mp4"
                  controls
                  className="w-1/2 rounded-md border"
                />
              </div>
            </div>

            {cameraOn && (
              <div className="relative mt-4 rounded-md border border-blue-300 bg-gray-50 p-4">
                <p className="mb-2 text-sm text-blue-600">📷 Camera is ON</p>
                <ul className="mb-4 list-inside list-disc text-sm text-gray-500">
                  <li>Ensure face is centered in the frame</li>
                  <li>Good lighting is recommended</li>
                  <li>Neutral background is preferred</li>
                </ul>
                <div className="relative w-full">
                  <video
                    ref={videoRef}
                    className="w-full rounded-md bg-black"
                    muted
                    autoPlay
                    playsInline
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

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    lycrazyId: '',
                    country: '',
                    state: '',
                    city: '',
                    location: '',
                    education: '',
                    age: '',
                    height: '',
                    weight: '',
                    phone: '',
                    email: '',
                    jobCategory: '',
                    experience: '',
                    about: '',
                  });
                  setVideoFile(null);
                  setInstruction('');
                  setCameraOn(false);
                }}
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`rounded-md px-6 py-2 text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isSubmitting ? 'Submitting...' : 'SUBMIT'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
};

// Reusable Input
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
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
    />
  </div>
);

// Reusable Select
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
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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

// Reusable Textarea
const Textarea = ({
  label,
  name,
  value,
  onChange,
  rows = 3,
  required = false,
}) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      required={required}
      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
    ></textarea>
  </div>
);

export default HiringFormModal;
