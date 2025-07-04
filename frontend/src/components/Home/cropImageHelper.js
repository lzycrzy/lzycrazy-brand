export default async function getCroppedVideo(
  videoSrc,
  crop,
  rotation = 0,
  overlayText = "",
  font = "sans-serif",
  fontSize = 100
) {
  const video = document.createElement("video");
  video.src = videoSrc;
  video.crossOrigin = "anonymous";

  // Create canvas to draw video frames
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Wait for the video to load and play
  await new Promise((resolve) => {
    video.onloadeddata = resolve;
    video.play();
  });

  // Set up the canvas to match the video dimensions
  canvas.width = crop.width;
  canvas.height = crop.height;

  // Function to draw text and video frames
  const drawFrame = () => {
    // Draw the video frame onto the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw the cropped and rotated part of the video
    ctx.drawImage(
      video,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );

    // Apply text overlay if needed
    if (overlayText) {
      ctx.font = `bold ${fontSize}px ${font}`;
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
      ctx.shadowBlur = 8;
      ctx.fillText(overlayText, canvas.width / 2, canvas.height / 2);
    }

    // Save the current frame
    ctx.restore();

    // Repeat this function for each frame
    requestAnimationFrame(drawFrame);
  };

  // Start the drawing loop
  drawFrame();

  // Wait for the video to finish processing or define when to stop
  return new Promise((resolve) => {
    // Example: Stop the process after a set time or at the end of the video
    setTimeout(() => {
      video.pause();
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty or corrupted");
          return;
        }
        const file = new File([blob], "cropped_video_with_text.mp4", { type: "video/mp4" });
        resolve(file);
      }, "video/mp4");
    }, 5000); // Example: stop after 5 seconds
  });
}
