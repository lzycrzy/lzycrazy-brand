export default async function getCroppedImg(
  imageSrc,
  crop,
  rotation = 0,
  overlayText = "",
  font = "sans-serif",
  fontSize = 100 // You can tweak this value or pass it dynamically
) {
  // Load the image
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });

  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Calculate bounding box for rotated image
  const radians = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const bBoxWidth = image.width * cos + image.height * sin;
  const bBoxHeight = image.width * sin + image.height * cos;

  // Set canvas size to final crop size
  canvas.width = crop.width;
  canvas.height = crop.height;

  // Apply rotation
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(radians);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  // Draw the rotated and cropped image
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  // Reset transform before drawing text
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  if (overlayText) {
    ctx.font = `bold ${fontSize}px ${font}`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    ctx.shadowBlur = 8;
    ctx.fillText(overlayText, canvas.width / 2, canvas.height / 2);
  }

  // Export as a JPEG file
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error("Canvas is empty or corrupted");
        return;
      }
      const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
      resolve(file);
    }, "image/jpeg");
  });
}
