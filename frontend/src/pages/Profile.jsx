import HeaderLoggedIn from '../components/HeaderLoggedIn';
import Footer from '../components/Footer';
import ProfileHero from '../components/ProfileHero';
import PostItem from '../components/PostItem';
import { Plus, Phone, Edit2, X, Check, Camera, Mail, Upload } from 'lucide-react';
import bakery from '/src/assets/images/bakery.jpg';
import WishListItems from '../components/WishListItems';
import { useState, useEffect } from 'react';
import petrin from '/src/assets/images/petrin.jpg';
import COLORS from '../constants/colors';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = {
          id: 1,
          name: " Ibtihal",
          profileImage: null,
          followers: 228,
          following: 94,
          posts: 18,
          about: "Welcome to my shop! I sell unique old couture items and quality used bakery tools. Everything is well-maintained and ready for a new life. Honest deals, fast replies, and smooth transactions.",
          about: "",
          phone: "",
          email: "",
          sidebarImage: null
        };
        const postsData = [
          {
            id: 1,
            image: petrin,
            title: "Pétrin professionnel",
            description: "Cras a professional spiral dough mixer (pétrin professionnel) used in bakeries for mixing large quantities of dough...",
            status: "active",
            likes: 12
          },
          {
            id: 2,
            image: petrin,
            title: "Pétrin professionnel",
            description: "Cras a professional spiral dough mixer (pétrin professionnel) used in bakeries for mixing large quantities of dough...",
            status: "expired",
            likes: 8
          }
        ];
        setUser(userData);
        setPosts(postsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading profile data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const [editMode, setEditMode] = useState({ bio: false, image: false, contact: false });
  const [formData, setFormData] = useState({ bio: '', phone: '', email: '' });
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  // Initialize form data when user loads
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
    // Reset form data to current user data on edit start
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
    // Validation
    if (section === 'contact') {
      const newErrors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Simple phone regex for example purposes
      const phoneRegex = /^\+?[\d\s-]{10,}$/;

      if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone format';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    // Update User State
    setUser(prev => ({
      ...prev,
      about: section === 'bio' ? formData.bio : prev.about,
      phone: section === 'contact' ? formData.phone : prev.phone,
      email: section === 'contact' ? formData.email : prev.email,
      sidebarImage: section === 'image' ? previewImage : prev.sidebarImage
    }));

    setEditMode(prev => ({ ...prev, [section]: false }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const handlePostDelete = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
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
            </div>
            <div className="space-y-4">
              {activeTab === 'posts' && (
                <>
                  {posts.length > 0 ? (
                    posts.map(post => (
                      <PostItem
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
                  {user?.about && !editMode.bio && (
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
                      <button
                        onClick={() => handleEditClick('bio')}
                        className="w-full py-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-sm hover:bg-gray-50 transition-colors"
                        style={{ borderColor: COLORS.neutral.gray, color: COLORS.text.secondary }}
                      >
                        <Plus className="w-6 h-6 mb-1" />
                        <span>Add Bio</span>
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Image Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase" style={{ color: COLORS.text.secondary }}>Gallery / Shop</span>
                  {user?.sidebarImage && !editMode.image && (
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
                  <button
                    onClick={() => handleEditClick('image')}
                    className="w-full py-12 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-sm hover:bg-gray-50 transition-colors"
                    style={{ borderColor: COLORS.neutral.gray, color: COLORS.text.secondary }}
                  >
                    <Upload className="w-8 h-8 mb-2" />
                    <span>Add Shop Image</span>
                  </button>
                )}
              </div>

              {/* Contact Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold" style={{ color: COLORS.text.primary }}>Contact Info</h3>
                  {(user?.phone || user?.email) && !editMode.contact && (
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
                  <button
                    onClick={() => handleEditClick('contact')}
                    className="w-full py-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-sm hover:bg-gray-50 transition-colors"
                    style={{ borderColor: COLORS.neutral.gray, color: COLORS.text.secondary }}
                  >
                    <Plus className="w-6 h-6 mb-1" />
                    <span>Add Contact Info</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div >
  );
}