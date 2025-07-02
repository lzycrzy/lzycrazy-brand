export default async function getCroppedImg(imageSrc, crop, rotation = 0, overlayText = "", font = "sans-serif") {
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

  const safeArea = Math.max(image.width, image.height) * 2;
  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

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

  if (overlayText) {
    ctx.font = `30px ${font}`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(overlayText, canvas.width / 2, canvas.height / 2);
  }

  return canvas.toDataURL("image/jpeg");
}
