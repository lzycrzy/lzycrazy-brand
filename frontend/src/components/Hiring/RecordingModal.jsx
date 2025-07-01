import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

function RecordingModal({ setVideoFile, setRecordingMode, recordingMode, setRecordedVideoBlob }) {
  const videoRef = useRef(null);
  const chunksRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoURL, setRecordedVideoURL] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const recordingTimerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current && isRecording) {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  };

  const reRecord = () => {
    if (recordedVideoURL) {
      URL.revokeObjectURL(recordedVideoURL);
    }
    setRecordedVideoURL(null);
    setRecordedVideoBlob(null);
    setRecordingTime(0);
  };

  const deleteRecording = () => {
    if (recordedVideoURL) {
      URL.revokeObjectURL(recordedVideoURL);
    }
    setRecordedVideoURL(null);
    setRecordedVideoBlob(null);
    setIsRecording(false);
    setRecordingTime(0);
    toast.success('Recording deleted');
  };

  const startRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;

      // Assign stream to video element for live preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            ?.play()
            .catch((err) => console.error('Video play error:', err));
        };
      }

      let options = { mimeType: 'video/webm;codecs=vp9' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm;codecs=vp8' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: 'video/webm' };
        }
      }

      chunksRef.current = [];
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const url = URL.createObjectURL(blob);
        setRecordedVideoURL(url);
        setRecordedVideoBlob(blob);
        setVideoFile(null);

        streamRef.current?.getTracks().forEach((track) => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }

        toast.success('Video recorded successfully!');
      };

      recorder.start();
      setMediaRecorder(recorder);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
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
      toast.error(
        'Unable to access camera and microphone. Please check permissions.'
      );
    }
  };

  function saveVideo() {
    toast.success('Video Saved successfully!');
    console.log(recordedVideoURL);

    // Stop any ongoing recording
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
    setRecordingMode(false);

    // Clear timers
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }

    // Stop camera if running
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  }

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }

      if (recordedVideoURL) {
        URL.revokeObjectURL(recordedVideoURL);
      }

      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }

        if (streamRef?.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center backdrop-blur-lg">
      <div className=" relative max-w-[500px] border-2 border-gray-200 h-[600px] flex justify-center items-center p-2 bg-gray-100 rounded-md flex-col">
      <div className='absolute top-2 right-2 w-[30px] h-[30px] bg-gray-300 font-bold rounded-full flex cursor-pointer justify-center items-center' onClick={() => setRecordingMode(false)}>X</div>
        {recordingMode && (
          <>
            {!recordedVideoURL && !isRecording && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700"
                >
                  <span className="h-3 w-3 rounded-full bg-white"></span>
                  Start Recording (15s)
                </button>
                <p className="mt-2 text-xs text-gray-500">
                  Click to start recording your 15-second introduction video.
                  Camera will start automatically when recording begins.
                </p>
              </div>
            )}

            {isRecording && (
              <div className="mt-1 w-full">
                <div className="rounded-md border border-red-200 bg-red-50 p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
                      <span className="font-medium text-red-700">
                        Recording...
                      </span>
                    </div>
                    <span className="font-mono text-lg text-red-700">
                      {recordingTime}/15s
                    </span>
                  </div>

                  <div className="mb-3 h-2 w-full rounded-full bg-red-200">
                    <div
                      className="h-2 rounded-full bg-red-600 transition-all duration-1000"
                      style={{ width: `${(recordingTime / 15) * 100}%` }}
                    ></div>
                  </div>

                  <button
                    type="button"
                    onClick={stopRecording}
                    className="w-full rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                  >
                    Stop Recording
                  </button>
                </div>
              </div>
            )}

            {recordedVideoURL && (
              <div className="mt-2">
                <div className="rounded-md border border-green-200 bg-green-50 p-4">
                  <p className="mb-3 font-medium text-green-700">
                    ✅ Video recorded successfully!
                  </p>

                  <video
                    src={recordedVideoURL}
                    controls
                    className="mb-3 w-full rounded-md border"
                    style={{ maxHeight: '400px' }}
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={reRecord}
                      className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                    >
                      Re-record
                    </button>
                    <button
                      type="button"
                      onClick={deleteRecording}
                      className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {recordedVideoURL && (
              <button
                onClick={saveVideo}
                className="bg-gray-200 mt-5 cursor-pointer p-2 rounded-md flex justify-center items-center mx-auto"
              >
                Save Video
              </button>
            )}
          </>
        )}

        {isRecording && (
          <div className="relative mt-4 rounded-md border-2 border-red-500 bg-red-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-red-500"></div>
              <p className="text-sm font-medium text-red-600">
                🔴 Recording Live - {recordingTime}/15s
              </p>
            </div>

            <div className="relative w-full">
              <video
                ref={videoRef}
                className="w-full rounded-md border-2 border-red-400 bg-black"
                muted
                autoPlay
                playsInline
                style={{ maxHeight: '400px' }}
              />
              <div className="absolute top-2 left-2 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
                REC
              </div>
              <div className="absolute top-2 right-2 rounded bg-black px-2 py-1 text-sm text-white bg-opacity-60">
                {15 - recordingTime}s left
              </div>
            </div>

            <p className="mt-2 text-center text-sm font-medium text-red-700">
              Speak clearly and introduce yourself! Recording will auto-stop at 15 seconds.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecordingModal;
