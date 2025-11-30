import SearchBar from './SearchBar';
import logo from '../assets/images/raskala_logo.png';
import defaultProfile from '../assets/images/profile.png';
import { useState } from 'react';
import { Link } from "react-router-dom";

export default function HeaderLoggedIn({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Determine which profile image to use, when we link it with db it will fetch picture from it, if it doesnt exists it will just use the default one
  const profileImage = (user?.profileImage && !imageError) ? user.profileImage : defaultProfile;

  return (
    <header id="home" className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left section: Logo */}
          <div className="flex-shrink-0">
            <a href="/">
              <img src={logo} alt="Raskala Logo" className="h-10 md:h-12 w-auto" />
            </a>
          </div>

          {/* Middle: Search bar - hidden on small screens, shown on medium+ */}
          <div className="hidden md:flex flex-grow max-w-3xl">
            <SearchBar />
          </div>

          {/* Right section: Profile + Hamburger */}
          <div className="flex items-center gap-4">
            
            {/* Desktop navigation - hidden below lg screens */}
            <nav className="hidden lg:block">
              <ul className="flex gap-6 items-center">
                {/* Home with dropdown */}
                <li className="relative group">
                  <a href="/home-after-login" className="text-gray-700 hover:text-lime-600 font-medium flex items-center gap-1">
                    Home
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </a>
                </li>

                {/* About Us with dropdown */}
                <li className="relative group">
                  <a href="#about" className="text-gray-700 hover:text-lime-600 font-medium flex items-center gap-1">
                    About Us
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </a>
                </li>

                {/* Pages with dropdown */}
                <li className="relative group">
                  <a href="/browse-categories" className="text-gray-700 hover:text-lime-600 font-medium flex items-center gap-1">
                    All Categories
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </a>
                </li>

                {/* Dashboard with dropdown */}
                <li className="relative group">
                  <a href="#dashboard" className="text-gray-700 hover:text-lime-600 font-medium flex items-center gap-1">
                    Dashboard
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </a>
                </li>

                {/* Log Out link */}
                <li>
                  <a href="/" className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1">
                    Log Out
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </li>
              </ul>
            </nav>

            {/* Profile picture - always visible, same size */}
            <div className="relative">
              {/* <Link to = '/Profile'>               */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={profileImage}
                  alt="Profile"
                  onError={() => setImageError(true)}
                  className="w-12 h-12 rounded-full border-2 border-pink-400 object-cover hover:border-pink-500 transition-colors"
                />
              </button>
              {/* </Link> */}
              {/* Profile dropdown menu - only on desktop */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link  
                  to="/edit-profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                    My Profile
                  </Link>
                  <a href="/Profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                    Settings
                  </a>
                  {/* <a href="#my-items" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                    My Items
                  </a> */}
                  {/* <hr className="my-2" /> */}
                  {/* <a href="#logout" className="block px-4 py-2 text-red-600 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                    Log Out
                  </a> */}
                </div>
              )}
            </div>

            {/* Hamburger menu button - visible below lg screens */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile search bar - shown only on small screens */}
        <div className="md:hidden mt-4">
          <SearchBar />
        </div>

        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <nav className="lg:hidden border-t mt-4 pt-4">
            <ul className="flex flex-col gap-3">
              <li>
                <a href="#home" className="text-gray-700 hover:text-lime-600 font-medium flex items-center justify-between py-2" onClick={() => setIsMenuOpen(false)}>
                  Home
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-700 hover:text-lime-600 font-medium flex items-center justify-between py-2" onClick={() => setIsMenuOpen(false)}>
                  About Us
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="#pages" className="text-gray-700 hover:text-lime-600 font-medium flex items-center justify-between py-2" onClick={() => setIsMenuOpen(false)}>
                  Pages
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="#dashboard" className="text-gray-700 hover:text-lime-600 font-medium flex items-center justify-between py-2" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
              
              {/* Profile options in mobile menu */}
              <li className="border-t pt-3 mt-2">
                <a href="#profile" className="text-gray-700 hover:text-lime-600 font-medium flex items-center justify-between py-2" onClick={() => setIsMenuOpen(false)}>
                  My Profile
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="#settings" className="text-gray-700 hover:text-lime-600 font-medium flex items-center justify-between py-2" onClick={() => setIsMenuOpen(false)}>
                  Settings
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="#my-items" className="text-gray-700 hover:text-lime-600 font-medium flex items-center justify-between py-2" onClick={() => setIsMenuOpen(false)}>
                  My Items
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
              
              <li className="border-t pt-3 mt-2">
                <a href="/home-after-login" className="text-orange-500 hover:text-orange-600 font-medium flex items-center justify-between py-2" onClick={() => setIsMenuOpen(false)}>
                  Log Out
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}