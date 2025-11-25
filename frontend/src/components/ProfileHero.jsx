import { useState } from 'react';
import { Link } from 'react-router-dom';
import profileHeroImage from '../assets/images/profileHero.png';
import defaultProfile from '../assets/images/profile.png';

export default function ProfileHero({ user, isOwnProfile = true }) {
  const [imageError, setImageError] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Determine which profile image to use
  const profileImage = (user?.profileImage && !imageError) ? user.profileImage : defaultProfile;

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // Add your follow/unfollow logic here
  };

  const handleEditProfile = () => {
    // Navigate to edit profile page
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
        
        {/* Profile Picture - Overlapping the banner */}
        <div className="absolute -bottom-16 left-8 md:left-16">
          <img
            src={profileImage}
            alt={user?.name || 'Profile'}
            onError={() => setImageError(true)}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white object-cover shadow-lg"
          />
        </div>
      </div>

      {/* Profile Info Section */}

      {/* modify the margin left as much as i need to align it  */}
      <div className="container mx-auto pl-15 px-4 pt-20 pb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Left: Name and Stats */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {user?.name || 'User Name'}
            </h1>
            
            {/* Stats */}
            <div className="flex gap-8 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{user?.followers || 328}</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{user?.following || 38}</p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{user?.posts || 18}</p>
                <p className="text-sm text-gray-500">posts</p>
              </div>
               <div>
              {/* the pink add button */}
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
                
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex gap-3 items-center">
            {isOwnProfile ? (
              <>
                {/* Edit Profile Button */}
                <button
                  onClick={handleEditProfile}
                  className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-orange-500 hover:to-orange-600 transition-all flex items-center gap-2"
                >
                  Edit Profile
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                {/* Follow Button */}
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}