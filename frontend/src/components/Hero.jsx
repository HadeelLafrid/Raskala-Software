// import { useState, useEffect } from 'react';
import heroImage from '../assets/images/hero.png';

export default function Hero() {
  // Function to handle scroll down action
  const handleScrollDown = () => {
    window.scrollBy({
      top: window.innerHeight * 1, // Scroll down by 50% of viewport height
      behavior: 'smooth'
    });
  };

  return (
    // <section className="w-full">
    <section className="min-h-screen items-center justify-center bg-gradient-to-b from-orange-100 to-orange-50 py-8">
        <div className="flex justify-center">
        <img
            src={heroImage}
            alt="Hero"
            className="w-full max-w-5xl h-auto rounded-lg shadow-lg pt-3"
            />
            
            {/* Floating scroll down button */}
            <button
              onClick={handleScrollDown}
              className="absolute bottom-8 right-8 bg-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-lime-50 group"
              aria-label="Scroll down"
            >
              {/* Down arrow icon */}
              <svg
                className="w-6 h-6 text-lime-600 group-hover:text-lime-700 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
        </div>

        {/* Hero Text */}
        <div className="px-6 py-8 text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Find The Items You Need For Less
            </h1>
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
            Sell What You Don't Use And Earn Instantly
            </p>
        </div>
    </section>
  );
}