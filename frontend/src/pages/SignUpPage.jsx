import { useState } from 'react';
import { FullWidthButton, LinkButton } from '../components/Button';
import welcomeImage from '../assets/images/welcome.png';
import { Link } from "react-router-dom";
export default function SignUpPage() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phoneNumber: ''
  });
  const validateUserName = (userName) => {
    if (!userName) {
      return 'User name is required';
    }
    if (userName.length < 3) {
      return 'User name must be at least 3 characters';
    }
    return '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };
  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    if (confirmPassword !== password) {
      return 'Passwords do not match';
    }
    return '';
  };

  const validateAddress = (address) => {
    if (!address) {
      return 'Address is required';
    }
    if (address.length < 10) {
      return 'Please enter a complete address';
    }
    return '';
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    
    if (!phoneNumber) {
      return 'Phone number is required';
    }
    if (!phoneRegex.test(phoneNumber)) {
      return 'Please enter a valid phone number';
    }
    if (phoneNumber.replace(/\D/g, '').length < 10) {
      return 'Phone number must be at least 10 digits';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    let error = '';

    switch (name) {
      case 'userName':
        error = validateUserName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        if (formData.confirmPassword) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: validateConfirmPassword(formData.confirmPassword, value)
          }));
        }
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(value, formData.password);
        break;
      case 'address':
        error = validateAddress(value);
        break;
      case 'phoneNumber':
        error = validatePhoneNumber(value);
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = () => {
    const newErrors = {
      userName: validateUserName(formData.userName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
      address: validateAddress(formData.address),
      phoneNumber: validatePhoneNumber(formData.phoneNumber)
    };
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) {
      console.log('Form has errors');
      return; 
    }
    console.log('Sign up submitted:', formData);
  };
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-white overflow-hidden">
        <img 
          src={welcomeImage} 
          alt="Welcome to RasKala" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Get Started Now</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-base font-semibold text-gray-700 mb-2">
                user name
              </label>
              <input
                type="text"
                id="userName"
                name="userName" 
                value={formData.userName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition bg-gray-50 ${
                  errors.userName 
                    ? 'border-red-500 focus:ring-red-400' 
                    : 'border-gray-300 focus:ring-lime-400' 
                }`}
                placeholder=""
              />
              {errors.userName && (
                <p className="mt-1 text-sm text-red-600">{errors.userName}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-2">
                email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition bg-gray-50 ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-400' 
                    : 'border-gray-300 focus:ring-lime-400'
                }`}
                placeholder=""
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-base font-semibold text-gray-700 mb-2">
                password
              </label>
              <input
                type="password" 
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition bg-gray-50 ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-400' 
                    : 'border-gray-300 focus:ring-lime-400'
                }`}
                placeholder=""
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-base font-semibold text-gray-700 mb-2">
                confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition bg-gray-50 ${
                  errors.confirmPassword 
                    ? 'border-red-500 focus:ring-red-400' 
                    : 'border-gray-300 focus:ring-lime-400'
                }`}
                placeholder=""
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
            <div>
              <label htmlFor="address" className="block text-base font-semibold text-gray-700 mb-2">
                address (localization)
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition bg-gray-50 ${
                  errors.address 
                    ? 'border-red-500 focus:ring-red-400' 
                    : 'border-gray-300 focus:ring-lime-400'
                }`}
                placeholder=""
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-base font-semibold text-gray-700 mb-2">
                phone number
              </label>
              <input
                type="tel" 
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition bg-gray-50 ${
                  errors.phoneNumber 
                    ? 'border-red-500 focus:ring-red-400' 
                    : 'border-gray-300 focus:ring-lime-400'
                }`}
                placeholder=""
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>
            <Link to='/home-after-login'>
            <div className="pt-3">
              <FullWidthButton onClick={handleSubmit}>
                Sign up
              </FullWidthButton>
            </div>
            </Link>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <LinkButton href="/LoginPage">Sign In</LinkButton>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}