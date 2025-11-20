import footerImage from '../assets/images/raskala_picture.svg';

export default function Footer() {
  return (
    <footer className="bg-lime-300 text-gray-800 p-12 mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Left Section - Image */}
          <div className="flex justify-center md:justify-start">
            <img 
              src={footerImage} 
              alt="Raskala" 
              className="w-64 h-auto"
            />
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b-4 border-gray-700 inline-block pb-1">
              Useful Links
            </h3>
            <ul className="space-y-2 mt-4">
              <li><a href="/values" className="text-gray-700 hover:text-gray-900">Our values</a></li>
              <li><a href="/advisory" className="text-gray-700 hover:text-gray-900">Our advisory board</a></li>
              <li><a href="/partners" className="text-gray-700 hover:text-gray-900">Our partners</a></li>
              <li><a href="/become-partner" className="text-gray-700 hover:text-gray-900">Become a partner</a></li>
              <li><a href="/careers" className="text-gray-700 hover:text-gray-900">Work at Future Learn</a></li>
              <li><a href="/quizlet" className="text-gray-700 hover:text-gray-900">Quizlet Plus</a></li>
            </ul>
          </div>

          {/* Our Company */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b-4 border-gray-700 inline-block pb-1">
              Our Company
            </h3>
            <ul className="space-y-2 mt-4">
              <li><a href="/contact" className="text-gray-700 hover:text-gray-900">Contact Us</a></li>
              <li><a href="/become-teacher" className="text-gray-700 hover:text-gray-900">Become Teacher</a></li>
              <li><a href="/blog" className="text-gray-700 hover:text-gray-900">Blog</a></li>
              <li><a href="/instructor" className="text-gray-700 hover:text-gray-900">Instructor</a></li>
              <li><a href="/events" className="text-gray-700 hover:text-gray-900">Events</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 border-2 border-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Contact us</h3>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-lg">+213 55 55 68 89</p>
              <p className="font-semibold text-lg">raskala.dz@gmail.com</p>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="text-center mt-8 pt-6 border-t border-gray-700">
          <p className="text-gray-700">&copy; 2025 Raskala. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}