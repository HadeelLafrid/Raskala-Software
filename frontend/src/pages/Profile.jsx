import HeaderLoggedIn from '../components/HeaderLoggedIn';
import Footer from '../components/Footer';
import ProfileHero from '../components/ProfileHero';
import PostItem from '../components/PostItem';
import { Plus, Phone } from 'lucide-react';
import bakery from '/src/assets/images/bakery.jpg';
import WishListItems from '../components/WishListItems';
import Messages from '../pages/messages';
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
          phone: "+33 65 55 55 55"
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
              className="rounded-lg p-6 sticky top-8"
              style={{ backgroundColor: COLORS.primary.orange + '33' }}
            >
              <h2 className="mb-4" style={{ color: COLORS.text.primary }}>About</h2>
              <p className="text-sm mb-6" style={{ color: COLORS.text.secondary }}>
                {user?.about || 'No bio available'}
              </p>
              <div className="mb-6">
                <div className="p-2 rounded-lg" style={{ backgroundColor: COLORS.neutral.white }}>
                  <div className="relative pt-[75%] sm:pt-[60%] lg:pt-[75%]">
                    <img
                      src={bakery}
                      alt="Bakery equipment"
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-b"
                    />
                  </div>
                </div>
              </div>
              <div 
                className="rounded-lg p-4 flex items-center gap-3"
                style={{ backgroundColor: COLORS.neutral.white }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: COLORS.primary.yellow }}
                >
                  <Phone className="w-5 h-5" style={{ color: COLORS.neutral.white }} />
                </div>
                <div>
                  <div className="text-xs" style={{ color: COLORS.text.secondary }}>CONTACT US</div>
                  <div style={{ color: COLORS.text.primary }}>{user?.phone || 'Not available'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}