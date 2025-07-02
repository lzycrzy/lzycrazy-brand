import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VideoOptions = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const uploadedVideoUrl = state?.video;

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [collaborator, setCollaborator] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [recording, setRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const liveVideoRef = useRef(null);
  const streamRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      liveVideoRef.current.srcObject = stream;
      liveVideoRef.current.play();

      const recorder = new MediaRecorder(stream);
      setChunks([]);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setChunks((prev) => [...prev, e.data]);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        liveVideoRef.current.srcObject = null;
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      alert("Error accessing camera: " + err.message);
    }
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    streamRef.current.getTracks().forEach((track) => track.stop());
    setRecording(false);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(URL.createObjectURL(file));
      setShowDropdown(false);
    }
  };

  const handleSave = () => {
    const videoToSave = recordedUrl || uploadedVideoUrl;
    if (!videoToSave) {
      alert("No video to save.");
      return;
    }

    alert("Video saved!\n" + JSON.stringify({ title, tags, collaborator }));
    navigate("/");
  };

  const handleCancel = () => {
    if (window.confirm("Discard changes?")) {
      navigate("/");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel - Details */}
      <div className="w-80 bg-white p-6 flex flex-col gap-4 border-r overflow-y-auto">
        <h2 className="text-lg font-semibold">Video Details</h2>

        <input
          type="text"
          placeholder="Video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded text-sm"
        />
        <input
          type="text"
          placeholder="Add tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border p-2 rounded text-sm"
        />
        <input
          type="text"
          placeholder="Add collaborator"
          value={collaborator}
          onChange={(e) => setCollaborator(e.target.value)}
          className="w-full border p-2 rounded text-sm"
        />

        {/* Thumbnail */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-black text-sm border px-3 py-2 rounded w-full text-left"
          >
            Change thumbnail ⬇
          </button>
          {showDropdown && (
            <div className="absolute mt-1 w-full bg-white border shadow rounded p-2 z-10">
              <label className="text-sm cursor-pointer block">
                Upload from device
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {thumbnail && (
          <img
            src={thumbnail}
            alt="Thumbnail Preview"
            className="mt-2 w-full rounded shadow"
          />
        )}

        {/* Save/Cancel Buttons */}
        <div className="mt-auto flex gap-4 pt-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-200 px-4 py-2 rounded w-full"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Right Panel - Recording & Preview */}
      <div className="flex-1 bg-black flex flex-col items-center justify-center p-8">
        <h2 className="text-white mb-4 text-xl font-medium">Live Recording / Preview</h2>

        {/* Live video preview while recording */}
        {!recordedUrl && !uploadedVideoUrl && (
          <video ref={liveVideoRef} className="w-full max-w-2xl rounded mb-4" autoPlay muted />
        )}

        {/* Uploaded or Recorded Video Preview */}
        {(recordedUrl || uploadedVideoUrl) && (
          <video
            src={recordedUrl || uploadedVideoUrl}
            controls
            className="w-full max-w-2xl rounded mb-4"
          />
        )}

        {/* Controls */}
        <div>
          {!recording ? (
            <button
              onClick={startRecording}
              className="bg-green-600 text-white px-4 py-2 rounded mr-4"
            >
              🎥 Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              🛑 Stop Recording
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoOptions;

