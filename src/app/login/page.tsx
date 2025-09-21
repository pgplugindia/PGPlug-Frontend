'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { Mail, Phone, KeyRound } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { signIn } from "next-auth/react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../../lib/firebase';

interface LoginFormData {
  email: string;
  password: string;
  phone: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmailLogin, setIsEmailLogin] = useState<boolean>(true);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    phone: '',
  });

  // Initialize reCAPTCHA
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle OTP change
  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setOtp(e.target.value);
  };

  // Handle email login
  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data));
      
      // Show success message
      toast.success('Login successful!');
      
      // Redirect to home page
      router.push('/home');
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = (): void => {
    signIn("google", { callbackUrl: "/home" });
  };

  // Send OTP to phone number
  const sendOtp = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        `+1${formData.phone}`, // Assuming Indian numbers, adjust as needed
        appVerifier
      );
      
      // Store the confirmation result to use later
      (window as any).confirmationResult = confirmationResult;
      setOtpSent(true);
      toast.success('OTP sent successfully!');
      
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const confirmationResult = (window as any).confirmationResult;
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Show success message
      toast.success('Phone login successful!');
      
      // Redirect to home page
      router.push('/home');
      
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between email and phone login
  const toggleLoginMethod = (useEmail: boolean): void => {
    setIsEmailLogin(useEmail);
    setOtpSent(false);
    setOtp('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Login method toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => toggleLoginMethod(true)}
              className={`px-4 py-1 text-sm font-medium rounded-l-lg ${
                isEmailLogin
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Email Login
            </button>
            <button
              type="button"
              onClick={() => toggleLoginMethod(false)}
              className={`px-4 py-1 text-sm font-medium rounded-r-lg ${
                !isEmailLogin
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Phone Login
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {/* Email Login Form */}
          {isEmailLogin ? (
            <form className="space-y-4" onSubmit={handleEmailLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FcGoogle className="w-5 h-5 mr-2" />
                  Sign in with Google
                </button>
                <a href="/signup">
                <p className="text-center mt-4 hover:text-indigo-600 cursor-pointer text-sm">Create an Account</p>
                </a>
              </div>
            </form>
          ) : (
            /* Phone Login Form */
            <div className="space-y-6">
              {!otpSent ? (
                <form onSubmit={sendOtp} className="space-y-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 flex items-center">
                        <select
                          aria-label="Country"
                          className="h-full py-0 pl-3 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-l-md"
                        >
                          <option>+91</option>
                          <option>+1</option>
                          <option>+44</option>
                        </select>
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-24 sm:text-sm border-gray-300 rounded-md p-2 border"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading || !formData.phone}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={verifyOtp} className="space-y-6">
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                      Enter OTP
                    </label>
                    <div className="mt-1">
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="one-time-code"
                        required
                        value={otp}
                        onChange={handleOtpChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-2 sm:text-sm border-gray-300 rounded-md border"
                        placeholder="Enter 6-digit OTP"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      We've sent a verification code to +91 {formData.phone}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Change number
                    </button>
                    <button
                      type="button"
                      onClick={sendOtp}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Resend OTP
                    </button>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading || otp.length < 6}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </div>
                </form>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign in with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => toggleLoginMethod(true)}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Mail className="w-5 h-5 text-gray-500 mr-2" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FcGoogle className="w-5 h-5 mr-2" />
                  Google
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* reCAPTCHA container - must be in the DOM */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
