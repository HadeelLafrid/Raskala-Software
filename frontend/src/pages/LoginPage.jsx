import { useState } from 'react';
import { FullWidthButton, LinkButton } from '../components/Button';
import welcomeImage from '../assets/images/welcome.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [errors, setErrors] = useState({
    email: '',   
    password: '' 
  });

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
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors(prev => ({
      ...prev,                 
      email: validateEmail(value) 
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors(prev => ({
      ...prev,                        
      password: validatePassword(value) 
    }));
  };

  const handleSubmit = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setErrors({
      email: emailError,
      password: passwordError
    });
    if (emailError || passwordError) {
      console.log('Form has errors');
      return;
    }
    console.log('Login submitted:', { email, password, rememberMe, keepLoggedIn });
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  const handleAppleLogin = () => {
    console.log('Apple login clicked');
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center">
        <img 
          src={welcomeImage} 
          alt="Welcome to RasKala" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back !</h2>
            <p className="text-lg font-semibold text-gray-600">
              Enter your Credentials to access your account
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange} 
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-lime-400'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-base font-semibold text-gray-700">
                  Password
                </label>
                <a href="/forgot-password" className="text-sm text-gray-600 hover:text-lime-600">
                  forget password
                </a>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-lime-400'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm pt-2 pb-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
                />
                <span className="ml-2 text-gray-700 font-semibold">Remember me</span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  className="w-4 h-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
                />
                <span className="ml-2 text-gray-700 font-semibold">Keep me login</span>
              </label>
            </div>

            <div className="pt-3">
              <FullWidthButton onClick={handleSubmit}>
                Log in
              </FullWidthButton>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleGoogleLogin}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 font-medium">Sign in with Google</span>
              </button>

              <button
                onClick={handleAppleLogin}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="text-gray-700 font-medium">Sign in with Apple</span>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <LinkButton href="/signup" className="text-lime-500 hover:text-lime-600">
                Sign Up
              </LinkButton>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
