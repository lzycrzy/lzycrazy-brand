export const getCroppedImg = (imageSrc, crop, rotation = 0) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const radians = (rotation * Math.PI) / 180;
      const sin = Math.abs(Math.sin(radians));
      const cos = Math.abs(Math.cos(radians));

      const width = image.width;
      const height = image.height;

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.translate(-crop.x, -crop.y);
      ctx.translate(width / 2, height / 2);
      ctx.rotate(radians);
      ctx.translate(-width / 2, -height / 2);

      ctx.drawImage(image, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Canvas is empty'));
        const fileUrl = URL.createObjectURL(blob);
        resolve(fileUrl);
      }, 'image/jpeg');
    };

    image.onerror = (e) => reject(e);
  });
};
