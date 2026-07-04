import HeaderLoggedIn from '../components/HeaderLoggedIn';
import Footer from '../components/Footer';
import Categories from '../components/Categories';
import Publicity from '../components/Publicity';
import Sponsored from '../components/Sponsor';
import PopularItems from '../components/PopularItems';
import AddItem from './AddItem';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export default function HomeAfterLogIn() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading ...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLoggedIn />
      <Categories />
      <Publicity />
      <Sponsored />
      <PopularItems />// 
      {/* the pink add button */}
      <Link
        to="/add-item"
        className="fixed bottom-8 right-8 bg-gradient-to-r from-pink-400 to-pink-500 text-white w-16 h-16 rounded-full shadow-lg hover:shadow-xl hover:from-pink-500 hover:to-pink-600 transition-all duration-300 flex items-center justify-center z-50 group"
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

      <Footer />
    </div>
  );
}
