"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Phone, Eye, EyeOff, LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const InputField = ({ icon: Icon, error, ...props }) => (
  <div className="relative">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
      <Icon className={`w-4 h-4 ${error ? 'text-red-400' : 'text-slate-400'}`} />
    </span>
    <input
      {...props}
      className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-700'} rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-white placeholder-slate-500`}
    />
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
);

const PasswordField = ({ show, onToggle, error, ...props }) => (
  <div className="relative">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
      <Lock className={`w-4 h-4 ${error ? 'text-red-400' : 'text-slate-400'}`} />
    </span>
    <input
      type={show ? "text" : "password"}
      {...props}
      className={`w-full pl-9 pr-8 py-2 text-sm bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-700'} rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-white placeholder-slate-500`}
    />
    <button
      type="button"
      onClick={onToggle}
      className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-white"
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
);


export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "male"
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const userDataString = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userDataString) {
      window.location.href = '/interface';
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (message.text) setMessage({ text: "", type: "" });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLoginView) {
      if (!formData.username.trim()) newErrors.username = 'Username is required';
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const API_BASE_URL = 'http://localhost:4000';
      const endpoint = isLoginView ? '/auth/login' : '/auth/register';
      
      const payload = isLoginView 
        ? { email: formData.email, password: formData.password }
        : {
            username: formData.username,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            gender: formData.gender,
            password: formData.password
          };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || (isLoginView ? 'Login failed' : 'Registration failed'));
      }

      if (isLoginView) {
        // Handle successful login
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage({
          text: 'Login successful! Redirecting...',
          type: 'success'
        });
        setTimeout(() => {
          window.location.href = '/interface';
        }, 1000);
      } else {
        // Handle successful registration
        setMessage({
          text: 'Registration successful! Please log in.',
          type: 'success'
        });
        setTimeout(() => {
          setIsLoginView(true);
          setFormData(prev => ({
            ...prev,
            username: "",
            name: "",
            phone: "",
            confirmPassword: ""
          }));
          setMessage({ text: "", type: "" });
        }, 2000);
      }
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };



  const formVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } },
    exit: { opacity: 0, y: -10 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white grid place-items-center p-4">
      <div className="w-full max-w-sm">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-white">PGPlug</h1>
          <p className="text-slate-400 text-sm mt-1">Your gateway to comfortable stays</p>
        </motion.div>

        <motion.div
          className="bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {isLoginView ? (
              <motion.div
                key="login"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-3"
              >
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold text-white">Welcome Back</h2>
                  <p className="text-slate-400 text-sm mt-0.5">Sign in to your account</p>
                </div>

                {message.text && (
                  <motion.div
                    variants={itemVariants}
                    className={cn(
                      "p-3 rounded-md mb-3 text-sm",
                      message.type === "error"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : message.type === "success"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : message.type === "warning"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    )}
                  >
                    <div className="flex flex-col space-y-2">
                      <span>{message.text}</span>
                      {message.action && (
                        <button
                          onClick={message.action.onClick}
                          disabled={isLoading}
                          className={cn(
                            "text-xs font-medium px-3 py-1.5 rounded border transition-colors",
                            message.type === "error"
                              ? "text-red-400 border-red-400/50 hover:bg-red-400/10"
                              : message.type === "success"
                                ? "text-green-400 border-green-400/50 hover:bg-green-400/10"
                                : message.type === "warning"
                                  ? "text-amber-400 border-amber-400/50 hover:bg-amber-400/10"
                                  : "text-blue-400 border-blue-400/50 hover:bg-blue-400/10",
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                          )}
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center">
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                              Processing...
                            </div>
                          ) : (
                            message.action.text
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleAuth} className="grid gap-2.5">
                  <motion.div variants={itemVariants}>
                    <InputField
                      icon={Mail}
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Email Address"
                      required
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <PasswordField
                      show={showPassword}
                      onToggle={() => setShowPassword(!showPassword)}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Password"
                      required
                    />
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex items-center justify-between text-xs">
                    <label className="flex items-center text-slate-400">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                        className="w-3.5 h-3.5 mr-1.5 text-indigo-500 bg-slate-700 border-slate-600 rounded focus:ring-1 focus:ring-indigo-500"
                      />
                      Remember me
                    </label>
                    <a href="#" className="text-indigo-400 hover:text-indigo-300">Forgot password?</a>
                  </motion.div>
                  <motion.button
                    variants={itemVariants}
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-1"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1.5"></div>
                    ) : (
                      <LogIn className="w-4 h-4 mr-1.5" />
                    )}
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </motion.button>
                </form>
                <p className="text-center text-xs text-slate-400 pt-1">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsLoginView(false)}
                    className="text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Create account
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-3"
              >
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold text-white">Create Account</h2>
                  <p className="text-slate-400 text-sm mt-0.5">Get started with PGPlug</p>
                </div>

                {message.text && (
                  <motion.div
                    variants={itemVariants}
                    className={cn(
                      "p-3 rounded-md mb-3 text-sm",
                      message.type === "error"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : message.type === "success"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : message.type === "warning"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    )}
                  >
                    <div className="flex flex-col space-y-2">
                      <span>{message.text}</span>
                      {message.action && (
                        <button
                          onClick={message.action.onClick}
                          disabled={isLoading}
                          className={cn(
                            "text-xs font-medium px-3 py-1.5 rounded border transition-colors",
                            message.type === "error"
                              ? "text-red-400 border-red-400/50 hover:bg-red-400/10"
                              : message.type === "success"
                                ? "text-green-400 border-green-400/50 hover:bg-green-400/10"
                                : message.type === "warning"
                                  ? "text-amber-400 border-amber-400/50 hover:bg-amber-400/10"
                                  : "text-blue-400 border-blue-400/50 hover:bg-blue-400/10",
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                          )}
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center">
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                              Processing...
                            </div>
                          ) : (
                            message.action.text
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleAuth} className="grid gap-2.5">
                  <motion.div variants={itemVariants}>
                    <InputField
                      icon={User}
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Username"
                      error={errors.username}
                      required
                    />
                  </motion.div>
                    <motion.div variants={itemVariants}>
                      <InputField
                        icon={User}
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Full Name"
                        error={errors.name}
                        required
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <InputField
                        icon={Mail}
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Email Address"
                        error={errors.email}
                        required
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <InputField
                        icon={Phone}
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Phone Number"
                        error={errors.phone}
                        required
                      />
                    </motion.div>
                    <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2.5">
                      <div>
                        <PasswordField
                          show={showPassword}
                          onToggle={() => setShowPassword(!showPassword)}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="Password"
                          error={errors.password}
                          required
                        />
                      </div>
                      <div>
                        <PasswordField
                          show={showConfirmPassword}
                          onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          placeholder="Confirm"
                          error={errors.confirmPassword}
                          required
                        />
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="mt-1">
                      <label className="text-xs text-slate-400">Gender</label>
                      <div className="flex gap-4 mt-1">
                        {['male', 'female', 'other'].map((gender) => (
                          <label key={gender} className="flex items-center text-sm">
                            <input
                              type="radio"
                              name="gender"
                              checked={formData.gender === gender}
                              onChange={() => handleInputChange('gender', gender)}
                              className="w-4 h-4 text-indigo-600 bg-slate-800 border-slate-700 focus:ring-indigo-500"
                            />
                            <span className="ml-2 capitalize">{gender}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                    <motion.button
                      variants={itemVariants}
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-1"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1.5"></div>
                      ) : (
                        <UserPlus className="w-4 h-4 mr-1.5" />
                      )}
                      {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </motion.button>
                  </form>
                <p className="text-center text-xs text-slate-400 pt-1">
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsLoginView(true)}
                    className="text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="text-center mt-4">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
