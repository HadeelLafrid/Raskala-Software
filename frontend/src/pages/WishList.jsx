import { useState, useEffect } from 'react';
import HeaderLoggedIn from '../components/HeaderLoggedIn';
import { useUser } from '../contexts/UserContext';
import Footer from '../components/Footer';
import ProfileHero from '../components/ProfileHero';
import WishListItems from '../components/WishListItems';
import COLORS from '../constants/colors';

export default function Wishlist() {
  const { user, loading, refetchUser } = useUser();

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-gray-600">No user data available</p>
            <button onClick={refetchUser} className="mt-4 bg-pink-500 text-white px-4 py-2 rounded">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.background.white }}>
      <HeaderLoggedIn />
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