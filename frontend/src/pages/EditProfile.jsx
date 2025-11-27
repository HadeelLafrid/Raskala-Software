import HeaderLoggedIn from '../components/HeaderLoggedIn';
import Footer from '../components/Footer';
import ProfileHero from '../components/ProfileHero';
import EditProfile from '../components/EditProfile';
export default function Profile() {
  // Simulate user data - in real app, fetch from API/database
  const user = {
    name: 'Hadil Lafrid',
    email: 'hadil@example.com',
    profileImage: null, // Set to image URL or null for default
    followers: 328,
    following: 38,
    posts: 18
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLoggedIn user={user} />
      <main className="flex-grow">
        <ProfileHero user={user} isOwnProfile={true} />
        <EditProfile/>
      </main>
      <Footer />
    </div>
  );
}