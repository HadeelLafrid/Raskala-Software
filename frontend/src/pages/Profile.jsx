import HeaderLoggedIn from '../components/HeaderLoggedIn';
import Footer from '../components/Footer';
import ProfileHero from '../components/ProfileHero';
import PostItem from '../components/PostItem';
import { Plus, Phone, Edit2, X, Check, Camera, Mail, Upload } from 'lucide-react';
import bakery from '/src/assets/images/bakery.jpg';
import { useState, useEffect, memo } from 'react';
import { useParams } from 'react-router-dom';
import COLORS from '../constants/colors';
import api from '../api/axios';
import { updateUserProfile } from '../api/users';
import { useUser } from '../contexts/UserContext';

// Memoize PostItem to prevent unnecessary re-renders
const MemoizedPostItem = memo(PostItem);

export default function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [apiLoadTime, setApiLoadTime] = useState(null); // Track API time

  useEffect(() => {
    const loadData = async () => {
      const startTime = performance.now();
      
      try {
        const endpoint = userId ? `/profile/${userId}` : '/profile';
        console.log('🔍 Fetching profile from:', endpoint);
        
        const response = await api.get(endpoint);
        const data = response.data;

        const endTime = performance.now();
        const loadTime = ((endTime - startTime) / 1000).toFixed(2);
        setApiLoadTime(loadTime);
        
        console.log(' API Response received:', {
          loadTime: `${loadTime}s`,
          hasUser: !!data.user,
          hasPosts: !!data.user?.posts,
          postsCount: data.user?.posts?.length || 0,
          productsCount: data.user?.products_count,
          fullData: data
        });
        
        if (data.debug) {
          console.log('Backend Debug:', data.debug);
        }

        setUser(data.user);
        setPosts(data.user.posts || []);
        setIsOwnProfile(data.user.isOwnProfile);
        setLoading(false);
      } catch (error) {
        console.error('Error loading profile data:', error);
        console.error('Error response:', error.response?.data);
        const endTime = performance.now();
        const loadTime = ((endTime - startTime) / 1000).toFixed(2);
        console.log(`Failed API call took ${loadTime} seconds`);
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  const [editMode, setEditMode] = useState({ bio: false, image: false, contact: false });
  const [formData, setFormData] = useState({ bio: '', phone: '', email: '' });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedShopFile, setSelectedShopFile] = useState(null);
  const [errors, setErrors] = useState({});
  const { refetchUser } = useUser();

  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.about || '',
        phone: user.phone || '',
        email: user.email || ''
      });
      setPreviewImage(user.sidebarImage || bakery);
    }
  }, [user]);

  const handleEditClick = (section) => {
    setEditMode(prev => ({ ...prev, [section]: true }));
    if (section === 'bio') setFormData(prev => ({ ...prev, bio: user.about }));
    if (section === 'contact') setFormData(prev => ({ ...prev, phone: user.phone, email: user.email }));
    setErrors({});
  };

  const handleCancelClick = (section) => {
    setEditMode(prev => ({ ...prev, [section]: false }));
    setErrors({});
    if (section === 'image') setPreviewImage(user.sidebarImage || bakery);
  };

  const handleSaveClick = (section) => {
    if (section === 'contact') {
      const newErrors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?[\d\s-]{10,}$/;

      if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone format';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    // Prepare payload and call backend to persist changes
    const sendUpdate = async () => {
      try {
        const formDataToSend = new FormData();

        if (section === 'bio') {
          formDataToSend.append('about', formData.bio || '');
        }

        if (section === 'contact') {
          formDataToSend.append('phone', formData.phone || '');
          formDataToSend.append('email', formData.email || '');
        }

        if (section === 'image' && selectedShopFile) {
          formDataToSend.append('shop_image', selectedShopFile);
        }

        // Only send if there's something to update
        if ([...formDataToSend.keys()].length === 0) {
          setEditMode(prev => ({ ...prev, [section]: false }));
          return;
        }

        const res = await updateUserProfile(formDataToSend);
        const respData = res.data?.data || {};

        // Update UI with returned data where available
        setUser(prev => ({
          ...prev,
          about: section === 'bio' ? formData.bio : prev.about,
          phone: section === 'contact' ? formData.phone : prev.phone,
          email: section === 'contact' ? formData.email : prev.email,
          sidebarImage: section === 'image' ? (respData.shop_image_url || previewImage || prev.sidebarImage) : prev.sidebarImage
        }));

        // Clear selected file after success
        if (section === 'image') setSelectedShopFile(null);

        setEditMode(prev => ({ ...prev, [section]: false }));
        // If user context available, trigger refetch so header updates
        if (refetchUser) {
          try { await refetchUser(); } catch (e) { console.warn('refetchUser failed', e); }
        }

      } catch (err) {
        console.error('Failed to save profile section', err);
        setErrors({ general: 'Failed to save. Please try again.' });
      }
    };

    sendUpdate();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setSelectedShopFile(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.product_id === updatedPost.product_id ? updatedPost : post
      )
    );
  };

  const handlePostDelete = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.product_id !== postId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: COLORS.primary.pink }}
          ></div>
          <p className="mt-4" style={{ color: COLORS.text.secondary }}>Loading profile...</p>
          {apiLoadTime && (
            <p className="mt-2 text-xs" style={{ color: COLORS.text.secondary }}>
              API took {apiLoadTime}s
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl" style={{ color: COLORS.text.primary }}>User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.background.white }}>
      <HeaderLoggedIn />
      <ProfileHero user={user} isOwnProfile={isOwnProfile} />
      <div className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex gap-8 border-b mb-6" style={{ borderColor: COLORS.neutral.gray }}>
              <div
                className="pb-3 border-b-2 font-semibold cursor-default"
                style={{
                  color: COLORS.primary.pink,
                  borderColor: COLORS.primary.pink
                }}
              >
                Posts
              </div>
              {isOwnProfile && (
                <>
                  <a
                    href="/wishlist"
                    className="pb-3 font-semibold hover:opacity-80 transition-opacity"
                    style={{ color: COLORS.text.secondary }}
                  >
                    WishList
                  </a>
                  <a
                    href="/messages"
                    className="pb-3 font-semibold hover:opacity-80 transition-opacity"
                    style={{ color: COLORS.text.secondary }}
                  >
                    Messages
                  </a>
                  <button
                    className="ml-auto mb-2 w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: COLORS.primary.pink,
                      color: COLORS.neutral.white
                    }}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            <div className="space-y-4">
              {activeTab === 'posts' && (
                <>
                  {posts && posts.length > 0 ? (
                    posts.map(post => (
                      <MemoizedPostItem
                        key={post.id}
                        post={post}
                        isOwnProfile={isOwnProfile}
                        onPostUpdate={handlePostUpdate}
                        onPostDelete={handlePostDelete}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p style={{ color: COLORS.text.secondary }}>No posts yet</p>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'wishlist' && (
                <div className="text-center py-12">
                  <p style={{ color: COLORS.text.secondary }}>Wishlist items will appear here</p>
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="text-center py-12">
                  <p style={{ color: COLORS.text.secondary }}>Messages will appear here</p>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div
              className="rounded-lg p-6 sticky top-8 space-y-6"
              style={{ backgroundColor: COLORS.primary.orange + '33' }}
            >
              {/* Bio Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold" style={{ color: COLORS.text.primary }}>About</h2>
                  {user?.about && !editMode.bio && isOwnProfile && (
                    <button onClick={() => handleEditClick('bio')} className="p-1 hover:bg-black/5 rounded">
                      <Edit2 className="w-4 h-4" style={{ color: COLORS.text.secondary }} />
                    </button>
                  )}
                  {editMode.bio && (
                    <div className="flex gap-2">
                      <button onClick={() => handleSaveClick('bio')} className="p-1 hover:bg-green-100 rounded text-green-600">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleCancelClick('bio')} className="p-1 hover:bg-red-100 rounded text-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {editMode.bio ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full text-sm p-2 rounded border focus:outline-none focus:ring-2"
                    rows={4}
                    style={{ borderColor: COLORS.neutral.gray }}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <>
                    {user?.about ? (
                      <p className="text-sm whitespace-pre-wrap" style={{ color: COLORS.text.secondary }}>
                        {user.about}
                      </p>
                    ) : (
                      isOwnProfile && (
                        <button
                          onClick={() => handleEditClick('bio')}
                          className="w-full py-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-sm hover:bg-gray-50 transition-colors"
                          style={{ borderColor: COLORS.neutral.gray, color: COLORS.text.secondary }}
                        >
                          <Plus className="w-6 h-6 mb-1" />
                          <span>Add Bio</span>
                        </button>
                      )
                    )}
                  </>
                )}
              </div>

              {/* Image Section - Lazy load images */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase" style={{ color: COLORS.text.secondary }}>Gallery / Shop</span>
                  {user?.sidebarImage && !editMode.image && isOwnProfile && (
                    <button onClick={() => handleEditClick('image')} className="p-1 hover:bg-black/5 rounded">
                      <Edit2 className="w-4 h-4" style={{ color: COLORS.text.secondary }} />
                    </button>
                  )}
                  {editMode.image && (
                    <div className="flex gap-2">
                      <button onClick={() => handleSaveClick('image')} className="p-1 hover:bg-green-100 rounded text-green-600">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleCancelClick('image')} className="p-1 hover:bg-red-100 rounded text-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {editMode.image || user?.sidebarImage ? (
                  <div className="p-2 rounded-lg relative group" style={{ backgroundColor: COLORS.neutral.white }}>
                    <div className="relative pt-[75%]">
                      <img
                        src={editMode.image ? (previewImage || bakery) : (user?.sidebarImage || bakery)}
                        alt="Shop"
                        className="absolute top-0 left-0 w-full h-full object-cover rounded"
                        loading="lazy"
                      />
                      {editMode.image && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded">
                          <label className="cursor-pointer flex flex-col items-center text-white">
                            <Camera className="w-8 h-8 mb-2" />
                            <span className="text-xs">Change Image</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  isOwnProfile && (
                    <button
                      onClick={() => handleEditClick('image')}
                      className="w-full py-12 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-sm hover:bg-gray-50 transition-colors"
                      style={{ borderColor: COLORS.neutral.gray, color: COLORS.text.secondary }}
                    >
                      <Upload className="w-8 h-8 mb-2" />
                      <span>Add Shop Image</span>
                    </button>
                  )
                )}
              </div>

              {/* Contact Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold" style={{ color: COLORS.text.primary }}>Contact Info</h3>
                  {(user?.phone || user?.email) && !editMode.contact && isOwnProfile && (
                    <button onClick={() => handleEditClick('contact')} className="p-1 hover:bg-black/5 rounded">
                      <Edit2 className="w-4 h-4" style={{ color: COLORS.text.secondary }} />
                    </button>
                  )}
                  {editMode.contact && (
                    <div className="flex gap-2">
                      <button onClick={() => handleSaveClick('contact')} className="p-1 hover:bg-green-100 rounded text-green-600">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleCancelClick('contact')} className="p-1 hover:bg-red-100 rounded text-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {editMode.contact || (user?.phone || user?.email) ? (
                  <div className="space-y-3">
                    {/* Phone */}
                    <div
                      className="rounded-lg p-3 flex items-start gap-3"
                      style={{ backgroundColor: COLORS.neutral.white }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                        style={{ backgroundColor: COLORS.primary.yellow }}
                      >
                        <Phone className="w-4 h-4" style={{ color: COLORS.neutral.white }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold uppercase mb-1" style={{ color: COLORS.text.secondary }}>Phone</div>
                        {editMode.contact ? (
                          <>
                            <input
                              type="text"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={`w-full text-sm p-1 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="+1234567890"
                            />
                            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                          </>
                        ) : (
                          <div className="text-sm truncate" style={{ color: COLORS.text.primary }}>{user?.phone || 'Not provided'}</div>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div
                      className="rounded-lg p-3 flex items-start gap-3"
                      style={{ backgroundColor: COLORS.neutral.white }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                        style={{ backgroundColor: COLORS.primary.blue }}
                      >
                        <Mail className="w-4 h-4" style={{ color: COLORS.neutral.white }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold uppercase mb-1" style={{ color: COLORS.text.secondary }}>Email</div>
                        {editMode.contact ? (
                          <>
                            <input
                              type="text"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`w-full text-sm p-1 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="example@raskala.com"
                            />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                          </>
                        ) : (
                          <div className="text-sm truncate" style={{ color: COLORS.text.primary }}>{user?.email || 'Not provided'}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  isOwnProfile && (
                    <button
                      onClick={() => handleEditClick('contact')}
                      className="w-full py-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-sm hover:bg-gray-50 transition-colors"
                      style={{ borderColor: COLORS.neutral.gray, color: COLORS.text.secondary }}
                    >
                      <Plus className="w-6 h-6 mb-1" />
                      <span>Add Contact Info</span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}