import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../api/users';
import api from '../api/axios';
import { useUser } from '../contexts/UserContext';

export default function EditProfile({ onUpdate }) {
  const { updateUser, refetchUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [locations, setLocations] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location_id: '',
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  // Store original data to compare changes
  const [originalData, setOriginalData] = useState({
    name: '',
    email: '',
    phone: '',
    location_id: '',
    profileImage: null
  });

  // Cleanup blob URLs on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    fetchProfile();
    fetchLocations();
  }, []);

  // Check if form has changes
  useEffect(() => {
    const dataChanged = 
      formData.name !== originalData.name ||
      formData.email !== originalData.email ||
      formData.phone !== originalData.phone ||
      formData.location_id !== originalData.location_id ||
      profileImage !== null ||
      formData.current_password !== '' ||
      formData.new_password !== '' ||
      formData.new_password_confirmation !== '';
    
    setHasChanges(dataChanged);
  }, [formData, originalData, profileImage]);

  const fetchLocations = async () => {
    try {
      const response = await api.get('/locations');
      console.log('Locations:', response.data);
      setLocations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();
      console.log('Profile response:', response.data);
      
      if (response.data.user) {
        const userData = response.data.user;
        const profileData = {
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          location_id: userData.location_id ? String(userData.location_id) : '',
          current_password: '',
          new_password: '',
          new_password_confirmation: ''
        };
        
        setFormData(profileData);
        
        // Store original data for comparison
        setOriginalData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          location_id: userData.location_id ? String(userData.location_id) : '',
          profileImage: userData.profileImage || null
        });
        
        // Set the profile image preview from the server
        if (userData.profileImage) {
          console.log('🖼️ Setting profile image from server:', userData.profileImage);
          setImagePreview(userData.profileImage);
        }

        // Update parent user state and global context
        if (onUpdate) {
          onUpdate(userData);
        }
        if (updateUser) {
          updateUser(userData);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      console.error('Error response:', error.response?.data);
      setErrors({ general: 'Failed to load profile data. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Allow empty phone or validate Algerian phone format
    if (!phone) return true;
    // Algerian phone: starts with 0, 10 digits OR starts with +213, 12 digits total
    const phoneRegex = /^(0[5-7]\d{8}|(\+213|00213)[5-7]\d{8})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Real-time validation
    if (name === 'email' && value) {
      if (!validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: ['Please enter a valid email address'] }));
      } else {
        setErrors(prev => ({ ...prev, email: undefined }));
      }
    }
    
    if (name === 'phone' && value) {
      if (!validatePhone(value)) {
        setErrors(prev => ({ ...prev, phone: ['Please enter a valid Algerian phone number (e.g., 0555123456)'] }));
      } else {
        setErrors(prev => ({ ...prev, phone: undefined }));
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ profile_photo: ['Image size must not exceed 5MB'] });
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ profile_photo: ['Only JPEG, PNG, and GIF images are allowed'] });
        return;
      }
      
      console.log('📸 Image selected:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      // Revoke old blob URL if it exists
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      
      setProfileImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      if (errors.profile_photo) {
        setErrors(prev => ({ ...prev, profile_photo: undefined }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation before submit
    let validationErrors = {};
    
    if (formData.email && !validateEmail(formData.email)) {
      validationErrors.email = ['Please enter a valid email address'];
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
      validationErrors.phone = ['Please enter a valid Algerian phone number'];
    }
    
    if (formData.new_password && formData.new_password.length < 8) {
      validationErrors.new_password = ['Password must be at least 8 characters'];
    }
    
    if (formData.new_password !== formData.new_password_confirmation) {
      validationErrors.new_password_confirmation = ['Passwords do not match'];
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setSaving(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const formDataToSend = new FormData();
      
      // Only append changed fields
      if (formData.name !== originalData.name && formData.name.trim()) {
        formDataToSend.append('name', formData.name.trim());
      }
      if (formData.email !== originalData.email && formData.email.trim()) {
        formDataToSend.append('email', formData.email.trim());
      }
      if (formData.phone !== originalData.phone) {
        formDataToSend.append('phone', formData.phone);
      }
      if (formData.location_id !== originalData.location_id) {
        formDataToSend.append('location_id', formData.location_id);
      }
      
      // Password fields
      if (formData.current_password) {
        formDataToSend.append('current_password', formData.current_password);
      }
      if (formData.new_password) {
        formDataToSend.append('new_password', formData.new_password);
      }
      if (formData.new_password_confirmation) {
        formDataToSend.append('new_password_confirmation', formData.new_password_confirmation);
      }
      
      // Profile photo
      if (profileImage) {
        console.log('📸 Uploading image:', {
          name: profileImage.name,
          size: profileImage.size,
          type: profileImage.type
        });
        formDataToSend.append('profile_photo', profileImage);
      }

      console.log('📤 Sending form data:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], typeof pair[1] === 'object' ? `File: ${pair[1].name}` : pair[1]);
      }

      const response = await updateUserProfile(formDataToSend);
      console.log('✅ Update response:', response.data);

      if (response.data.success) {
        setSuccessMessage('Profile updated successfully!');
        
        // Clear password fields after successful update
        setFormData(prev => ({
          ...prev,
          current_password: '',
          new_password: '',
          new_password_confirmation: ''
        }));
        
        // Clear the profile image file and preview
        setProfileImage(null);
        
        // Revoke the blob URL if it exists
        if (imagePreview && imagePreview.startsWith('blob:')) {
          URL.revokeObjectURL(imagePreview);
        }
        
        // Clear preview temporarily to force refresh
        setImagePreview(null);
        
        // First, refetch global user context to update all consuming components
        if (refetchUser) {
          try {
            await refetchUser();
            console.log('✅ Global user context refreshed');
          } catch (e) {
            console.warn('refetchUser failed:', e);
          }
        }
        
        // Then fetch the updated profile for this component
        await fetchProfile();
        
        console.log('🎉 Profile updated successfully');
        
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ 
          general: error.response?.data?.message || 'Failed to update profile. Please check your connection and try again.' 
        });
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  const getCurrentLocationName = () => {
    if (!formData.location_id) return 'Select your wilaya';
    const currentLocation = locations.find(
      loc => String(loc.location_id) === String(formData.location_id)
    );
    return currentLocation ? currentLocation.wilaya : 'Select your wilaya';
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-pink-500 border-b-2 border-pink-500 inline-block pb-2">
            Personal Information
          </h2>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {errors.general}
          </div>
        )}

        <div className="bg-white rounded-lg p-8 shadow-sm">
          
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img
                src={imagePreview || 'https://via.placeholder.com/150?text=No+Photo'}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-pink-400 object-cover"
                onError={(e) => {
                  console.error('❌ Image failed to load:', e.target.src);
                  e.target.src = 'https://via.placeholder.com/150?text=Error';
                }}
                onLoad={() => {
                  console.log('✅ Image loaded successfully:', imagePreview);
                }}
              />
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors shadow-lg"
                title="Upload profile photo"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          {errors.profile_photo && (
            <div className="text-center mb-4">
              <p className="text-sm text-red-600">{errors.profile_photo[0]}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className={`w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name ? 'focus:ring-red-500 ring-2 ring-red-500' : 'focus:ring-pink-500'
                } text-gray-700`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{Array.isArray(errors.name) ? errors.name[0] : errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email ? 'focus:ring-red-500 ring-2 ring-red-500' : 'focus:ring-pink-500'
                } text-gray-700`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{Array.isArray(errors.email) ? errors.email[0] : errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number (e.g., 0555123456)"
                className={`w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.phone ? 'focus:ring-red-500 ring-2 ring-red-500' : 'focus:ring-pink-500'
                } text-gray-700`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{Array.isArray(errors.phone) ? errors.phone[0] : errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Wilaya (Location)
              </label>
              <select
                name="location_id"
                value={formData.location_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.location_id ? 'focus:ring-red-500 ring-2 ring-red-500' : 'focus:ring-pink-500'
                } text-gray-700`}
              >
                <option value="">{getCurrentLocationName()}</option>
                {locations.map((location) => (
                  <option key={location.location_id} value={location.location_id}>
                    {location.wilaya}
                  </option>
                ))}
              </select>
              {errors.location_id && (
                <p className="mt-1 text-sm text-red-600">{Array.isArray(errors.location_id) ? errors.location_id[0] : errors.location_id}</p>
              )}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password (Optional)</h3>
            <p className="text-sm text-gray-600 mb-4">Leave blank if you don't want to change your password</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="current_password"
                  value={formData.current_password}
                  onChange={handleInputChange}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 ${
                    errors.current_password ? 'focus:ring-red-500 ring-2 ring-red-500' : 'focus:ring-pink-500'
                  } text-gray-700`}
                />
                {errors.current_password && (
                  <p className="mt-1 text-sm text-red-600">{Array.isArray(errors.current_password) ? errors.current_password[0] : errors.current_password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleInputChange}
                  placeholder="Enter new password (min 8 characters)"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 ${
                    errors.new_password ? 'focus:ring-red-500 ring-2 ring-red-500' : 'focus:ring-pink-500'
                  } text-gray-700`}
                />
                {errors.new_password && (
                  <p className="mt-1 text-sm text-red-600">{Array.isArray(errors.new_password) ? errors.new_password[0] : errors.new_password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="new_password_confirmation"
                  value={formData.new_password_confirmation}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 ${
                    errors.new_password_confirmation ? 'focus:ring-red-500 ring-2 ring-red-500' : 'focus:ring-pink-500'
                  } text-gray-700`}
                />
                {errors.new_password_confirmation && (
                  <p className="mt-1 text-sm text-red-600">{Array.isArray(errors.new_password_confirmation) ? errors.new_password_confirmation[0] : errors.new_password_confirmation}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleSubmit}
              disabled={saving || !hasChanges}
              className={`${
                saving || !hasChanges
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:from-orange-500 hover:to-orange-600'
              } bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg flex items-center gap-2`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  {hasChanges ? 'Save Changes' : 'No Changes'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}