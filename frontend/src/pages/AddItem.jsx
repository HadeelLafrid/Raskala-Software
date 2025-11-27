import Footer from '../components/Footer';
import AddNewItem from '../components/AddNewItem';
import Header from '../components/HeaderLoggedIn'
import profileHeroImage from '../assets/images/profileHero.png';

export default function AddItem() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="relative">
        <img 
          src={profileHeroImage} 
          alt="Profile Banner" 
          className="w-full h-64 md:h-80 object-cover"
        />
      </div>
      <AddNewItem />
      <Footer />
    </div>
  );
}