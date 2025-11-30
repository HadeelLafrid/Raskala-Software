import { useState } from 'react';
import COLORS from '../constants/colors';
import SignUpPage from '../pages/SignUpPage';
export default function WelcomeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      >
        <div 
          className="relative rounded-lg shadow-xl max-w-2xl w-full p-8"
          style={{ 
            background: `linear-gradient(to bottom right, ${COLORS.neutral.gray}, ${COLORS.neutral.white})` 
          }}
          onClick={(e) => e.stopPropagation()} 
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 hover:opacity-70 transition-opacity"
            style={{ color: COLORS.text.secondary }}
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              style={{ color: COLORS.text.primary }}
            >
              Welcome To RasKala
            </h1>
            <p 
              className="text-lg md:text-xl mb-12"
              style={{ color: COLORS.text.secondary }}
            >
              Join RasKala community by creating or accessing your account
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="/LoginPage"
                className="w-64 px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-center inline-block hover:opacity-90"
                style={{ 
                  background: `linear-gradient(to right, ${COLORS.primary.lime}, ${COLORS.primary.lime})`,
                  color: COLORS.text.primary
                }}
              >
                Log in
              </a>
              <a
                href="/SignUpPage"
                className="w-64 px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-center inline-block hover:opacity-90"
                style={{ 
                  background: `linear-gradient(to right, ${COLORS.primary.lime}, ${COLORS.primary.lime})`,
                  color: COLORS.text.primary
                }}
              >
                Create an account
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

