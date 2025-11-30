import HeaderLoggedIn from '../components/HeaderLoggedIn';
import Footer from '../components/Footer';
import ProfileHero from '../components/ProfileHero';
import WishListItems from '../components/WishListItems';
import COLORS from '../constants/colors';

export default function Wishlist() {
  const user = {
    name: 'Hadil Lafrid',
    email: 'hadil@example.com',
    profileImage: null,
    followers: 328,
    following: 94,
    posts: 18
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.background.white }}>
      <HeaderLoggedIn user={user} />
      <ProfileHero user={user} isOwnProfile={true} />
      <div className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        <div className="flex gap-8 border-b mb-6" style={{ borderColor: COLORS.neutral.gray }}>
          <a 
            href="/profile"
            className="pb-3 font-semibold hover:opacity-80 transition-opacity"
            style={{ color: COLORS.text.secondary }}
          >
            Posts
          </a>
          <div 
            className="pb-3 border-b-2 font-semibold cursor-default"
            style={{ 
              color: COLORS.primary.pink,
              borderColor: COLORS.primary.pink 
            }}
          >
            WishList
          </div>
          <a 
            href="/messages"
            className="pb-3 font-semibold hover:opacity-80 transition-opacity"
            style={{ color: COLORS.text.secondary }}
          >
            Messages
          </a>
        </div>
        <WishListItems showTitle={false} />
      </div>
      <Footer />
    </div>
  );
}