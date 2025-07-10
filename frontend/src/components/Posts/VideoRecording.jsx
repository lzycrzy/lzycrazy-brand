import React, { useEffect, useRef, useState } from "react";

const VideoRecording = ({ onClose, onVideoRecorded,setFile,setLiveRecModal }) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]); 
  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const[videoIsRecorded,setVideoIsRecorded]=useState(false)
  // const[file,setFile]=useState(null)
  const[recordedVideoURL,setRecordedVideoURL]=useState("")
   const[recordedVideoBlob,setRecordedVideoBlob]=useState("")
  const streamRef=useRef(null)
  const startCamera = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({ video: true,audio:true });
        videoRef.current.srcObject = userStream;
        // i add on
        videoRef.current.play()
        setStream(userStream);
      } catch (error) {
        alert("Could not access camera");
        onClose();
      }
    };
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

   const startRecording = async () => {
    try {
      setVideoIsRecorded(false)
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => videoRef.current?.play().catch(err => console.error('Video play error:', err));
      }
      let options = { mimeType: 'video/webm;codecs=vp9' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) options = { mimeType: 'video/webm;codecs=vp8' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) options = { mimeType: 'video/webm' };

      chunksRef.current = [];
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const url = URL.createObjectURL(blob);
        const videoFile = new File([blob], 'recorded-video.webm', {
       type: 'video/webm',
       lastModified: Date.now(),
     });console.log(videoFile)
     setFile(videoFile)
        setRecordedVideoURL(url);
        setRecordedVideoBlob(blob);
        setVideoIsRecorded(true)
        stream.getTracks().forEach(track => track.stop());
      //   if (videoRef.current) videoRef.current.srcObject = null;
      //   toast.success('Video recorded successfully!');
       };
      recorder.start();
      setRecording(true);
    } catch (error) {
      toast.error('Unable to access camera and microphone. Please check permissions.');
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false)
    }
  };
console.log(onVideoRecorded)
  return (
    <div className="fixed inset-0 z-50 bg-white/80 bg-opacity-70 flex justify-center items-center">
      <div className="bg-blue-200/30 shadow-2xl rounded-lg p-5 w-[90%] max-w-md">
        <h2 className="text-lg font-semibold mb-4">Record a Video</h2>
      {videoIsRecorded? 
       <video
         src={recordedVideoURL}
         controls
          className="w-full rounded-md bg-black h-64"
        />
      : <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full rounded-md bg-black h-64"
        />}
        <div className="flex justify-between mt-4">
          {!recording ? (
            <button
              onClick={startRecording}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Start
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Stop
            </button>
          )}
          <button
            onClick={() => {
              if (stream) {
                stream.getTracks().forEach(track => track.stop());
              }
              setLiveRecModal(false)
              onClose();
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoRecording;