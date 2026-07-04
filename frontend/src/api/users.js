import api from './axios';

// Get user profile (own or others)
export const getUserProfile = (userId = null) => {
  const endpoint = userId ? `/profile/${userId}` : '/profile';
  return api.get(endpoint);
};

// Update user profile
export const updateUserProfile = (formData) => {
  return api.post('/profile/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Upload profile photo separately
export const uploadProfilePhoto = (formData) => {
  return api.post('/profile/upload-photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Follow/Unfollow
export const followUser = (userId) => {
  return api.post(`/users/${userId}/follow`);
};

export const unfollowUser = (userId) => {
  return api.post(`/users/${userId}/unfollow`);
};