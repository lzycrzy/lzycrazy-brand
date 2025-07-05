function getVideoThumbnailUrl(videoUrl, options = {}) {
  const { width = 300, height = 200, time = 2 } = options;

  if (!videoUrl.includes('/upload/')) return videoUrl;

  return videoUrl
    .replace('/upload/',` /upload/so_${time},w_${width},h_${height},c_fill/`)
    .replace('.mp4', '.jpg');  // Convert to JPG thumbnail
}
export default getVideoThumbnailUrl