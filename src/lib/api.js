const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to handle API requests
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// Auth API
export const authAPI = {
  register: async (userData) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  login: async (credentials) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  getCurrentUser: async () => {
    return fetchAPI('/auth/me');
  },
  
  updateProfile: async (userId, userData) => {
    return fetchAPI(`/auth/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }
};

// PG API
export const pgAPI = {
  create: async (pgData) => {
    return fetchAPI('/pg/create', {
      method: 'POST',
      body: JSON.stringify(pgData),
    });
  },
  
  update: async (id, pgData) => {
    return fetchAPI(`/pg/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pgData),
    });
  },
  
  delete: async (id) => {
    return fetchAPI(`/pg/delete/${id}`, {
      method: 'DELETE',
    });
  },
  
  searchNearby: async (coordinates, radius = 5000) => {
    return fetchAPI('/pg/search-nearby', {
      method: 'POST',
      body: JSON.stringify({ coordinates, radius }),
    });
  },
  
  searchByLocation: async (location) => {
    return fetchAPI(`/pg/search-location?q=${encodeURIComponent(location)}`);
  },
  
  getById: async (id) => {
    return fetchAPI(`/pg/${id}`);
  }
};
