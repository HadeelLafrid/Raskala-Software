import { useState, useEffect } from 'react';
import { FullWidthButton, LinkButton } from '../components/Button';
import welcomeImage from '../assets/images/welcome.png';
import { Link } from "react-router-dom";
import api from '../api/axios';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    locationId: '', 
  });

  const [errors, setErrors] = useState({});
  const [locations, setLocations] = useState([]); // ✅ wilayas list

  // Fetch locations from backend
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get('/locations');
        if (response.data.success) {
          setLocations(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };
    fetchLocations();
  }, []);

  // Validation functions
  const validateUserName = (userName) => {
    if (!userName) return 'User name is required';
    if (userName.length < 3) return 'User name must be at least 3 characters';
    return '';
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };
  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    return '';
  };
  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  };
  
  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[\d\s\-+()]+$/;
    if (!phoneNumber) return 'Phone number is required';
    if (!phoneRegex.test(phoneNumber)) return 'Please enter a valid phone number';
    if (phoneNumber.replace(/\D/g, '').length < 10) return 'Phone number must be at least 10 digits';
    return '';
  };
  const validateLocation = (locationId) => {
    if (!locationId) return 'Please select a wilaya';
    return '';
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate field
    let error = '';
    switch (name) {
      case 'userName': error = validateUserName(value); break;
      case 'email': error = validateEmail(value); break;
      case 'password':
        error = validatePassword(value);
        if (formData.confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(formData.confirmPassword, value) }));
        }
        break;
      case 'confirmPassword': error = validateConfirmPassword(value, formData.password); break;
      
      case 'phoneNumber': error = validatePhoneNumber(value); break;
      case 'locationId': error = validateLocation(value); break;
      default: break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Handle submit
  const handleSubmit = async () => {
    const newErrors = {
      userName: validateUserName(formData.userName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
     
      phoneNumber: validatePhoneNumber(formData.phoneNumber),
      locationId: validateLocation(formData.locationId),
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) return;

    try {
      const response = await api.post('/signup', {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
       
        phoneNumber: formData.phoneNumber,
        location_id: formData.locationId, // ✅ send location id
      });

alert(response.data.message); // ✅ now response is used
window.location.href = '/LoginPage';} catch (error) {
      console.error('Signup failed:', error);
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      else alert(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-white overflow-hidden">
        <img src={welcomeImage} alt="Welcome to RasKala" className="w-full h-full object-cover" />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Get Started Now</h2>
          <div className="space-y-4">

            {/* USERNAME */}
            <div>
              <label htmlFor="userName" className="block text-base font-semibold text-gray-700 mb-2">User name</label>
              <input type="text" name="userName" id="userName" value={formData.userName} onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition bg-gray-50 ${errors.userName ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-lime-400'}`} />
              {errors.userName && <p className="mt-1 text-sm text-red-600">{errors.userName}</p>}
            </div>

            {/* EMAIL */}
            <div>
              <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition bg-gray-50 ${errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-lime-400'}`} />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* PASSWORD */}
            <div>
              <label htmlFor="password" className="block text-base font-semibold text-gray-700 mb-2">Password</label>
              <input type="password" name="password" id="password" value={formData.password} onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition bg-gray-50 ${errors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-lime-400'}`} />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label htmlFor="confirmPassword" className="block text-base font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition bg-gray-50 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-lime-400'}`} />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>



            {/* PHONE */}
            <div>
              <label htmlFor="phoneNumber" className="block text-base font-semibold text-gray-700 mb-2">Phone Number</label>
              <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition bg-gray-50 ${errors.phoneNumber ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-lime-400'}`} />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
            </div>

            {/* LOCATION DROPDOWN */}
            <div>
              <label htmlFor="locationId" className="block text-base font-semibold text-gray-700 mb-2">Wilaya</label>
              <select name="locationId" id="locationId" value={formData.locationId} onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition bg-gray-50 ${errors.locationId ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-lime-400'}`}>
                <option value="">Select your wilaya</option>
                {locations.map(loc => (
                  <option key={loc.location_id} value={loc.location_id}>{loc.wilaya}</option>
                ))}
              </select>
              {errors.locationId && <p className="mt-1 text-sm text-red-600">{errors.locationId}</p>}
            </div>

            {/* SUBMIT */}
            <div className="pt-3">
              <FullWidthButton onClick={handleSubmit}>Sign Up</FullWidthButton>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account? <LinkButton href="/LoginPage">Sign In</LinkButton>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
