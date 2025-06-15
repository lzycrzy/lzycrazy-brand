const detectFace = async () => {
    if (videoRef.current && cameraOn) {
      const result = await faceapi.detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );
  
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const dims = faceapi.matchDimensions(canvas, videoRef.current, true);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Draw guide box in center
      const guideBox = {
        x: dims.width / 2 - 100,
        y: dims.height / 2 - 100,
        width: 200,
        height: 200,
      };
      ctx.strokeStyle = 'gray';
      ctx.lineWidth = 2;
      ctx.strokeRect(guideBox.x, guideBox.y, guideBox.width, guideBox.height);
  
      if (result) {
        const resized = faceapi.resizeResults(result, dims);
        const box = resized.detection.box;
  
        // Check if face is within the guide box
        const isInsideGuideBox =
          box.x > guideBox.x &&
          box.y > guideBox.y &&
          box.x + box.width < guideBox.x + guideBox.width &&
          box.y + box.height < guideBox.y + guideBox.height;
  
        ctx.strokeStyle = isInsideGuideBox ? 'green' : 'red';
        ctx.lineWidth = 3;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
  
        setInstruction(isInsideGuideBox ? ' Face aligned – Good!' : '❗ Face not centered – Move face to center');
      } else {
        setInstruction('❗ Face not detected – Please center your face.');
      }
    }
  };
  