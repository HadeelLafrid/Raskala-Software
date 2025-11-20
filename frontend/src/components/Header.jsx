// Import the SearchBar component for the header's search functionality
import SearchBar from './SearchBar';
// Import the logo image asset to display in the header
import logo from '../assets/images/raskala_logo.png';
// Import useState hook for managing mobile menu state
import { useState } from 'react';

// Export the Header functional component as default
export default function Header() {
  // State to track if mobile menu is open
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Return the JSX structure for the header
  return (
    // Main header element with background and shadow styling
    <header className="bg-white shadow-md">
      {/* Container to center content with padding */}
      <div className="container mx-auto px-4 py-4">
        {/* Main row containing all elements */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          {/* Left section: Logo and navigation */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-8">
            {/* Logo wrapper prevents shrinking */}
            <div className="flex-shrink-0">
              {/* Link wrapping the logo to navigate to home */}
              <a href="/">
                {/* Logo image with fixed height */}
                <img src={logo} alt="Raskala Logo" className="h-10 md:h-12 w-auto" />
              </a>
            </div>

            {/* Desktop navigation - hidden on mobile */}
            <nav className="hidden md:block">
              {/* Navigation list horizontally spaced */}
              <ul className="flex gap-6">
                {/* Home navigation link */}
                <li><a href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</a></li>
                {/* About navigation link */}
                <li><a href="/about" className="text-gray-700 hover:text-blue-600 font-medium">About</a></li>
                {/* Contact navigation link */}
                <li><a href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a></li>
              </ul>
            </nav>

            {/* Hamburger menu button - visible only on mobile */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 focus:outline-none"
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

          {/* Middle area grows to fill space and constrains max width */}
          <div className="w-full md:flex-grow md:max-w-3xl">
            {/* Search bar component */}
            <SearchBar />
          </div>

          {/* Right side: Get Started button */}
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            {/* Call-to-action button with gradient and hover transition - visible on all screen sizes */}
            <button className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 md:px-6 py-2 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition text-sm md:text-base">
              {/* Button label */}
              Get Started
            </button>
          </div>
        </div>

        {/* Mobile navigation menu - hidden on desktop, toggleable on mobile */}
        {isMenuOpen && (
          <nav className="md:hidden border-t mt-4 pt-3">
            {/* Navigation list - vertical on mobile */}
            <ul className="flex flex-col gap-3 items-center">
              {/* Home navigation link */}
              <li><a href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</a></li>
              {/* About navigation link */}
              <li><a href="/about" className="text-gray-700 hover:text-blue-600 font-medium">About</a></li>
              {/* Contact navigation link */}
              <li><a href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a></li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}