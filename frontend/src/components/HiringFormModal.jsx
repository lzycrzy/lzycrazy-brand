import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import * as faceapi from 'face-api.js';

const HiringFormModal = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [cameraOn, setCameraOn] = useState(false);
  const [instruction, setInstruction] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  // Load face detection model
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      console.log('Model loaded successfully');
    };
    loadModels();
  }, []);

  // Camera start/stop
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

    if (cameraOn) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [cameraOn]);

  // Face detection logic
  useEffect(() => {
    const detectFace = async () => {
      if (videoRef.current && cameraOn && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Run face detection
        const detection = await faceapi.detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions(),
        );

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw gray guide box in center
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
          // Resize detection for canvas
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
              : '❗ Face not centered – Move face to center',
          );
        } else {
          setInstruction('❗ Face not detected – Please center your face.');
          console.log('No face detected.');
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

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="bg-opacity-40 fixed inset-0 z-[1000] flex h-screen w-screen items-center justify-center  backdrop-blur-sm">
      <div className="relative max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500"
        >
          &times;
        </button>

        <h2 className="mb-2 text-center text-2xl font-bold text-blue-700">
          WE ARE HIRING
        </h2>
        <p className="mb-2 text-center text-sm text-gray-600">
          Please sign up to get your <strong>LyCrazy ID</strong>.<br />
          Once you receive your LyCrazy ID (e.g. <code>lc09240031</code>), enter
          it below to continue the application.
        </p>
        <p className="mb-6 cursor-pointer text-center font-semibold text-blue-600 hover:underline">
          <a href="/signup" target="_blank" rel="noopener noreferrer">
            Sign Up Here
          </a>
        </p>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
            if (onSubmitSuccess) onSubmitSuccess();
          }}
        >
          <Input label="LyCrazy ID" placeholder="e.g. lc09240031" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Country" />
            <Input label="State" />
          </div>
          <Input label="Location (City/Town)" />
          <Input label="Education" placeholder="e.g. B.Tech, MBA, etc." />
          <Select
            label="Select Job Category"
            options={['Marketing', 'Sales', 'Development', 'Operations']}
          />
          <Textarea label="About Yourself (20 Words)" rows={2} />

          <div>
            <div className="int flex w-full grid-cols-1 items-end justify-between gap-4 px-3.5 sm:grid-cols-3">
              {/* Upload Video */}
              <div className="w-1/2">
                {/* Label + Checkbox in one row */}
                <div className="mb-2 flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">
                    Upload 15s Video
                  </label>
                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-blue-600"
                      checked={cameraOn}
                      onChange={() => setCameraOn(!cameraOn)}
                    />
                    <span className="text-sm text-gray-700">Open Camera</span>
                  </label>
                </div>

                {/* File input */}
                <input
                  type="file"
                  accept="video/*"
                  className="block w-full text-sm text-gray-700 file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
                />
              </div>

              {/* Height Input (Already present, moved here for alignment) */}
              <Input label="Height (cm)" className="w-12" type="number" />
            </div>

            {cameraOn && (
              <div className="relative mb-2 rounded-md border border-blue-300 bg-gray-50 p-4">
                <p className="mb-2 text-sm text-blue-600">📷 Camera is ON</p>
                <ul className="list-inside list-disc space-y-1 text-sm text-gray-500">
                  <li>Ensure face is centered in the frame</li>
                  <li>Good lighting is recommended</li>
                  <li>Neutral background is preferred</li>
                </ul>
                <div className="relative mt-4 w-full">
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
          </div>

          <div className="flex justify-between gap-4 px-3.5 sm:grid-cols-3">
            {/* <Input label="Height (cm)" type="number" /> */}
            <Input label="Weight (kg)" type="number" />
            <Input label="Age" type="number" />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition hover:bg-gray-300"
            >
              Clear
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

// Reusable components
const Input = ({ label, placeholder = '', type = 'text' }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
    />
  </div>
);

const Select = ({ label, options = [] }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none">
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const Textarea = ({ label, rows = 3 }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      rows={rows}
      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
    ></textarea>
  </div>
);

export default HiringFormModal;
