import { useState } from 'react';
import defaultProfile from '../assets/images/profile.png';

export default function EditProfile({ user }) {
  const [_imageError, setImageError] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || defaultProfile);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    postalCode: user?.postalCode || '',
    gender: user?.gender || 'female',
    dateOfBirth: user?.dateOfBirth || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      // In real app, upload to server here
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated profile:', formData);
    // Add your API call here to save changes
  };

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Personal Information Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-pink-500 border-b-2 border-pink-500 inline-block pb-2">
            Personal Information
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-sm">
          
          {/* Profile Picture Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img
                src={profileImage}
                alt="Profile"
                onError={() => {
                  setImageError(true);
                  setProfileImage(defaultProfile);
                }}
                className="w-24 h-24 rounded-full border-4 border-pink-400 object-cover"
              />
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors shadow-lg"
              >
                <span className="text-xl font-bold">H</span>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Hadi Lafrid"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Hadi Lafrid"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Hadil.Lafrid@gmail.com"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+213 55 55 68 89"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Algiers, Algeria"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700"
              />
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="1234567"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700 appearance-none cursor-pointer"
              >
                <option value="female">female</option>
                <option value="male">male</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Date of Birth
              </label>
              <input
                type="text"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                placeholder="1 Feb, 1995"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-500 hover:to-orange-600 transition-all shadow-lg flex items-center gap-2"
            >
              Save Changes
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}