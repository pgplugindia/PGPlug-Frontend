"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, MapPin, Calendar, Phone, Clock, CheckCircle, XCircle, AlertCircle, LogOut, User, HelpCircle } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

export default function BookingsPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('at-home');
  const [bookings, setBookings] = useState({
    'at-home': [
      {
        id: 1,
        name: "Sunshine PG",
        address: "123 Main Street, Mumbai, Maharashtra",
        bookingId: "BK2024001",
        fromDate: "2024-01-15",
        toDate: "2024-12-31",
        rent: 12000,
        status: "confirmed",
        contact: "+91 98765 43210"
      }
    ],
    'completed': [
      {
        id: 2,
        name: "Green Valley Hostel",
        address: "456 Park Avenue, Delhi, NCR",
        bookingId: "BK2023001",
        fromDate: "2023-06-01",
        toDate: "2023-12-31",
        rent: 15000,
        status: "completed",
        contact: "+91 98765 43211"
      },
      {
        id: 3,
        name: "Student Haven PG",
        address: "789 College Road, Bangalore, Karnataka",
        bookingId: "BK2023002",
        fromDate: "2023-01-01",
        toDate: "2023-05-31",
        rent: 18000,
        status: "completed",
        contact: "+91 98765 43212"
      }
    ],
    'upcoming': [
      {
        id: 4,
        name: "Modern Living PG",
        address: "321 Tech Park, Hyderabad, Telangana",
        bookingId: "BK2024002",
        fromDate: "2024-07-01",
        toDate: "2024-12-31",
        rent: 14000,
        status: "upcoming",
        contact: "+91 98765 43213"
      }
    ]
  });

  useEffect(() => {
    const userDataString = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userDataString) {
      setUser(JSON.parse(userDataString));
    } else {
      window.location.href = '/register';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    window.location.href = '/register';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'upcoming':
        return <Clock className="w-5 h-5 text-orange-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
              <div className="bg-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-4 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Search functionality available on main page</span>
                </div>
              </div>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                    {user.user?.profile_pic ? (
                      <img 
                        src={user.user.profile_pic} 
                        alt={user.user.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{user.user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.user?.name || 'User'}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                        {user.user?.profile_pic ? (
                          <img 
                            src={user.user.profile_pic} 
                            alt={user.user.name} 
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span>{user.user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.user?.name || 'User'}</p>
                        <p className="text-sm text-gray-600">{user.user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <a href="/details" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </a>
                    <a href="/bookings" className="flex items-center gap-3 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg">
                      <BookOpen className="w-4 h-4" />
                      <span>My Bookings</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <HelpCircle className="w-4 h-4" />
                      <span>Help Centre</span>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">Manage and track all your accommodation bookings</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-1 shadow-lg border border-gray-200">
              {[
                { id: 'at-home', label: 'Current Stay', count: bookings['at-home'].length },
                { id: 'upcoming', label: 'Upcoming', count: bookings['upcoming'].length },
                { id: 'completed', label: 'Completed', count: bookings['completed'].length }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-6 py-3 rounded-lg font-medium transition-all duration-200 relative",
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    {tab.label}
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      activeTab === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-700"
                    )}>
                      {tab.count}
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Bookings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings[activeTab].map((booking, index) => (
              <motion.div
                key={booking.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{booking.name}</h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        {getStatusIcon(booking.status)}
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(booking.status))}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{booking.address}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Booking ID</p>
                        <p className="font-medium text-gray-900">{booking.bookingId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monthly Rent</p>
                        <p className="font-medium text-gray-900">{formatPrice(booking.rent)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">From</p>
                        <p className="font-medium text-gray-900">{formatDate(booking.fromDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">To</p>
                        <p className="font-medium text-gray-900">{formatDate(booking.toDate)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Phone className="w-4 h-4" />
                      <span>Contact PG</span>
                    </motion.button>
                    
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Extend Stay</span>
                    </motion.button>
                    
                    {(activeTab === 'at-home' || activeTab === 'upcoming') && (
                      <motion.button
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Cancel</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {bookings[activeTab].length === 0 && (
            <motion.div 
              className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No {activeTab.replace('-', ' ')} bookings</h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'at-home' && "You don't have any current stays."}
                {activeTab === 'upcoming' && "You don't have any upcoming bookings."}
                {activeTab === 'completed' && "You don't have any completed bookings yet."}
              </p>
              <motion.a
                href="/interface"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Search for PGs</span>
              </motion.a>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
