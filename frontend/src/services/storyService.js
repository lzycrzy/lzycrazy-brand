import axios from 'axios';

export const uploadStoryToBackend = async (storyData, token) => {
  const config = {
    headers: {
      'Content-Type': storyData instanceof FormData ? 'multipart/form-data' : 'application/json',
      Authorization: `Bearer ${token}`,
      withCredentials: true,
    },
  };

  const response = await axios.post(
    '/api/v1/users/story',
    storyData,
    config
  );

  return response.data;
};
