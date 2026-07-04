import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import profileHeroImage from '../assets/images/profileHero.png';
import defaultProfile from '../assets/images/profile.png';
import api from '../api/axios';
import { useUser } from '../contexts/UserContext';

export default function ProfileHero({ user, isOwnProfile = true }) {
  const [imageError, setImageError] = useState(false);
  const [isFollowing, setIsFollowing] = useState(user?.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(user?.followers || 0);
  const location = useLocation();
  const { imageKey } = useUser();

  // Update local state when user prop changes
  useEffect(() => {
    setIsFollowing(user?.isFollowing || false);
    setFollowersCount(user?.followers || 0);
    setImageError(false); // Reset image error when user changes
  }, [user]);

  if (!user) return <div className="text-center py-10">User data is missing.</div>;

  // Add cache-busting parameter to profile image URL
  const getProfileImageUrl = () => {
    if (!user.profileImage || imageError) return defaultProfile;
    const url = user.profileImage;
    // Add cache-busting parameter if it's a server URL
    if (url.includes('http')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}v=${imageKey}`;
    }
    return url;
  };

  const profileImage = getProfileImageUrl();
  
  // Check if we're on the edit profile page
  const isEditProfilePage = location.pathname === '/edit-profile';

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.post(`/users/${user.id}/unfollow`);
        setFollowersCount((c) => c - 1);
      } else {
        await api.post(`/users/${user.id}/follow`);
        setFollowersCount((c) => c + 1);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Failed to update follow status:', error);
    }
  };

  const handleEditProfile = () => {
    window.location.href = '/edit-profile';
  };

  return (
    <section className="bg-white">
      {/* Hero Banner */}
      <div className="relative">
        <img
          src={profileHeroImage}
          alt="Profile Banner"
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute -bottom-16 left-8 md:left-16">
          <img
            src={profileImage}
            alt={user.name || 'Profile'}
            onError={() => setImageError(true)}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white object-cover shadow-lg"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="container mx-auto pl-15 px-4 pt-20 pb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Name and Stats */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{user.name}</h1>
            <div className="flex gap-8 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{followersCount}</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{user.following || 0}</p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{user.products_count || 0}</p>
                <p className="text-sm text-gray-500">Posts</p>
              </div>
              {isOwnProfile && (
                <div>
                  <Link
                    to="/add-item"
                    className="bg-gradient-to-r from-pink-400 to-pink-500 text-white w-16 h-16 rounded-full shadow-lg hover:shadow-xl hover:from-pink-500 hover:to-pink-600 transition-all duration-300 flex items-center justify-center z-50 group"
                    aria-label="Add new item"
                  >
                    <svg
                      className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex gap-3 items-center">
            {isOwnProfile ? (
              // Only show Edit Profile button if NOT on edit profile page
              !isEditProfilePage && (
                <button
                  onClick={handleEditProfile}
                  className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-orange-500 hover:to-orange-600 transition-all flex items-center gap-2"
                >
                  Edit Profile
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              )
            ) : (
              <button
                onClick={handleFollow}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                  isFollowing
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600'
                }`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}