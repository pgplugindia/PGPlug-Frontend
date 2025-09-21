import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes with clsx and tailwind-merge
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
export function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Truncate text with ellipsis
export function truncate(text, length = 50) {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
}

// Get first letter of each word
export function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

// Generate avatar URL with initials
export function getAvatarUrl(name, color = '3b82f6') {
  const initials = getInitials(name);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials
  )}&background=${color}&color=fff&size=128`;
}

// Format phone number
export function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';
  // Remove all non-digit characters
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  // Check if the number is 10 digits (Indian mobile number)
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+91 ${match[1]}-${match[2]}-${match[3]}`;
  }
  return phoneNumber;
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format distance in kilometers
export function formatDistance(meters) {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

// Get amenity icon
export function getAmenityIcon(amenity) {
  const icons = {
    wifi: '🌐',
    ac: '❄️',
    food: '🍽️',
    laundry: '👕',
    cleaning: '🧹',
    power: '🔌',
    water: '💧',
    security: '🔒',
    parking: '🅿️',
    gym: '💪',
    tv: '📺',
    geyser: '♨️',
    bed: '🛏️',    
  };
  return icons[amenity] || '✅';
}

// Validate email
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Validate phone number (Indian format)
export function validatePhone(phone) {
  const re = /^[6-9]\d{9}$/;
  return re.test(String(phone).replace(/\D/g, ''));
}
