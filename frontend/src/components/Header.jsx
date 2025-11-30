// Import the SearchBar component for the header's search functionality
import SearchBar from './SearchBar';
// Import the logo image asset to display in the header
import logo from '../assets/images/raskala_logo.png';
// Import useState hook for managing mobile menu state
import { useState } from 'react';
import { Link } from "react-router-dom";


// Export the Header functional component as default
export default function Header() {
  // State to track if mobile menu is open
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Return the JSX structure for the header
  return (
    // Main header element with background and shadow styling
    <header id="home" className="bg-white shadow-md">
      {/* Container to center content with padding */}
      <div className="container mx-auto px-4 py-4">
        {/* Main row containing all elements */}
        <div className="flex items-center justify-between gap-4">
          
          {/* Left section: Logo */}
          <div className="flex-shrink-0">
            {/* Link wrapping the logo to navigate to home */}
            <a href="/">
              {/* Logo image with fixed height */}
              <img src={logo} alt="Raskala Logo" className="h-10 md:h-12 w-auto" />
            </a>
          </div>

          {/* Middle: Search bar - hidden on small screens, shown on medium+ */}
          <div className="hidden md:flex flex-grow max-w-3xl">
            <SearchBar />
          </div>

          {/* Right section: Navigation + Get Started button + Hamburger */}
          <div className="flex items-center gap-4">
            
            {/* Desktop navigation - hidden below lg screens */}
            <nav className="hidden lg:block">
              {/* Navigation list horizontally spaced */}
              <ul className="flex gap-6">
                {/* Home navigation link */}
                <li><a href="#home" className="text-gray-700 hover:text-lime-600 font-medium">Home</a></li>
                {/* Popular Items navigation link */}
                <li><a href="#popular-items" className="text-gray-700 hover:text-lime-600 font-medium">Popular Items</a></li>
                {/* Footer navigation link */}
                <li><a href="#footer" className="text-gray-700 hover:text-lime-600 font-medium">Contact</a></li>
              </ul>
            </nav>

            {/* Get Started button - always visible, same size */}
            <Link to='/LoginPage'>
            <button className="flex-shrink-0 bg-gradient-to-r from-pink-400 to-pink-500 text-white px-4 md:px-6 py-2 rounded-full font-semibold hover:from-pink-500 hover:to-pink-600 transition text-sm md:text-base whitespace-nowrap">
              Get Started
            </button>
            </Link>

            {/* Hamburger menu button - visible below lg screens */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {/* Hamburger icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  // X icon when menu is open
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  // Hamburger icon when menu is closed
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

        {/* Mobile navigation menu - hidden on desktop, toggleable on mobile */}
        {isMenuOpen && (
          <nav className="lg:hidden border-t mt-4 pt-4">
            {/* Navigation list - vertical on mobile */}
            <ul className="flex flex-col gap-3">
              {/* Home navigation link */}
              <li>
                <a href="#home" className="text-gray-700 hover:text-lime-600 font-medium flex items-center justify-between py-2" onClick={() => setIsMenuOpen(false)}>
                  Home
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
              {/* Popular Items navigation link */}
              <li>
                <a href="#popular-items" className="text-gray-700 hover:text-lime-600 font-medium flex items-center justify-between py-2" onClick={() => setIsMenuOpen(false)}>
                  Popular Items
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
              {/* Footer navigation link */}
              <li>
                <a href="#footer" className="text-gray-700 hover:text-lime-600 font-medium flex items-center justify-between py-2" onClick={() => setIsMenuOpen(false)}>
                  Contact
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