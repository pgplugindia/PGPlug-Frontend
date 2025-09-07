"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Camera, Edit3, Save, X, LogOut, BookOpen, HelpCircle, Settings } from "lucide-react";
import { cn, getAvatarUrl } from "@/lib/utils";

export default function DetailsPage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    email: "",
    username: "",
    gender: ""
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userDataString = localStorage.getItem('user');
      if (!userDataString) {
        window.location.href = '/register';
        return;
      }

      const userData = JSON.parse(userDataString);
      
      try {
        // Fetch fresh user data from backend
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
        const response = await fetch(`${API_BASE_URL}/auth/user/${userData._id}`);
        
        if (response.ok) {
          const freshUserData = await response.json();
          
          // Update local storage with fresh data
          localStorage.setItem('user', JSON.stringify(freshUserData));
          
          setUser(freshUserData);
          setEditData({
            name: freshUserData.name || "",
            phone: freshUserData.phone || "",
            email: freshUserData.email || "",
            username: freshUserData.username || "",
            gender: freshUserData.gender || ""
          });
        } else {
          // Fallback to stored data if API fails
          setUser(userData);
          setEditData({
            name: userData.name || "",
            phone: userData.phone || "",
            email: userData.email || "",
            username: userData.username || "",
            gender: userData.gender || ""
          });
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // Fallback to stored data
        setUser(userData);
        setEditData({
          name: userData.name || "",
          phone: userData.phone || "",
          email: userData.email || "",
          username: userData.username || "",
          gender: userData.gender || ""
        });
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    window.location.href = '/register';
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      username: user?.username || "",
      gender: user?.gender || ""
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
      const response = await fetch(`${API_BASE_URL}/auth/user/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        const result = await response.json();
        
        // Store the updated user data directly (flat structure)
        localStorage.setItem('user', JSON.stringify(result.user));
        setUser(result.user);
        setIsEditing(false);
      } else {
        const error = await response.json();
        console.error('Failed to update profile:', error.message);
        alert('Failed to update profile: ' + error.message);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <motion.h1
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              PGPlug
            </motion.h1>

            {/* Search Bar Placeholder */}
            <div className="flex-1 max-w-4xl mx-8">

            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                    {user?.profile_pic ? (
                      <img
                        src={user.profile_pic}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                        {user?.profile_pic ? (
                          <img
                            src={user.profile_pic}
                            alt={user.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-lg">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <a href="/details" className="flex items-center gap-3 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg">
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </a>
                    <a href="/bookings" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <BookOpen className="w-4 h-4" />
                      <span>My Bookings</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <HelpCircle className="w-4 h-4" />
                      <span>Help Centre</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </a>
                    <div className="border-t border-gray-100 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                {!isEditing ? (
                  <motion.button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </motion.button>
                ) : (
                  <div className="flex gap-2">
                    <motion.button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </motion.button>
                    <motion.button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                    </motion.button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-lg text-gray-900">{user?.name || 'Not provided'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-lg text-gray-900">{user?.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <p className="text-lg text-gray-900">{user?.email || 'Not provided'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Gender</label>
                    <p className="text-lg text-gray-900">
                      {user?.gender === 'M' ? 'Male' : user?.gender === 'F' ? 'Female' : user?.gender === 'O' ? 'Other' : 'Not specified'}
                    </p>
                  </div>
                </div>

                {!isEditing && (
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Member Since</p>
                        <p className="text-gray-900">January 2024</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Account Status</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden mx-auto">
                  {user?.profile_pic ? (
                    <img
                      src={user.profile_pic}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                  )}
                </div>
                <motion.button
                  className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Camera className="w-5 h-5" />
                </motion.button>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">{user?.name || 'User'}</h3>
              <p className="text-gray-600 mb-6">{user?.email}</p>

              <div className="space-y-3">
                <motion.button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Camera className="w-4 h-4 inline mr-2" />
                  Change Photo
                </motion.button>

                <motion.button
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Select Avatar
                </motion.button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <a href="/bookings" className="block text-sm text-blue-600 hover:text-blue-700 transition-colors">
                    View My Bookings
                  </a>
                  <a href="/interface" className="block text-sm text-blue-600 hover:text-blue-700 transition-colors">
                    Search for PGs
                  </a>
                  <a href="#" className="block text-sm text-blue-600 hover:text-blue-700 transition-colors">
                    Help & Support
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
