export const getCroppedImg = (imageSrc, croppedAreaPixels) => {
  const image = new Image();
  image.src = imageSrc;
  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const { width, height } = croppedAreaPixels;
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        width,
        height,
        0,
        0,
        width,
        height
      );

      // Resolve the promise with the cropped image as a data URL
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      });
    };
    image.onerror = reject;
  });
};
