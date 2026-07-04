import { useState, useEffect } from 'react';
import HeaderLoggedIn from '../components/HeaderLoggedIn';
import { useUser } from '../contexts/UserContext';
import Footer from '../components/Footer';
import ProfileHero from '../components/ProfileHero';
import EditProfile from '../components/EditProfile';

export default function Profile() {
  const { user, loading, refetchUser, updateUser } = useUser();

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading profile...</p>
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
    <div className="flex flex-col min-h-screen">
      <HeaderLoggedIn />
      <main className="flex-grow">
        <ProfileHero user={user} isOwnProfile={true} />
        <EditProfile onUpdate={updateUser} />
      </main>
      <Footer />
    </div>
  );
}