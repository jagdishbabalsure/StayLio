import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const user = JSON.parse(localStorage.getItem('staylio_user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('staylio_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Host API (Admin endpoints)
export const hostAPI = {
  // Get all hosts (admin)
  getAllHosts: () => api.get('/admin/hosts'),
  
  // Get pending hosts (admin)
  getPendingHosts: () => api.get('/admin/hosts/pending'),
  
  // Get host by ID (admin)
  getHostById: (id) => api.get(`/admin/hosts/${id}`),
  
  // Approve host (admin)
  approveHost: (id) => api.put(`/admin/hosts/${id}/approve`),
  
  // Reject host (admin)
  rejectHost: (id, reason) => api.put(`/admin/hosts/${id}/reject`, { reason }),
  
  // Host profile endpoints
  getHostProfile: (id) => api.get(`/host/profile/${id}`),
  updateHostProfile: (id, hostData) => api.put(`/host/profile/${id}`, hostData),
};

// Admin API
export const adminAPI = {
  // Get all admins
  getAllAdmins: () => api.get('/admins'),
  
  // Get admin by ID
  getAdminById: (id) => api.get(`/admins/${id}`),
  
  // Create new admin
  createAdmin: (adminData) => api.post('/admins', adminData),
  
  // Update admin
  updateAdmin: (id, adminData) => api.put(`/admins/${id}`, adminData),
  
  // Delete admin
  deleteAdmin: (id) => api.delete(`/admins/${id}`),
  
  // Check email exists
  checkEmailExists: (email) => api.get(`/admins/exists/email/${email}`),
};

// Hotel API
export const hotelAPI = {
  // Get all hotels (admin only)
  getAllHotels: () => api.get('/hotels'),
  
  // Get hotels by hostname (host-specific)
  getHotelsByHostname: (hostname) => api.get(`/hotels/host/${hostname}`),
  
  // Get hotels by host ID
  getHotelsByHostId: (hostId) => api.get(`/hotels/hostId/${hostId}`),
  
  // Get hotel by ID
  getHotelById: (id) => api.get(`/hotels/${id}`),
  
  // Create new hotel
  createHotel: (hotelData) => api.post('/hotels', hotelData),
  
  // Update hotel (admin - can update any hotel)
  updateHotel: (id, hotelData) => api.put(`/hotels/${id}`, hotelData),
  
  // Update hotel by host (with ownership validation)
  updateHotelByHost: (id, hostname, hotelData) => api.put(`/hotels/${id}/host/${hostname}`, hotelData),
  
  // Delete hotel (admin - can delete any hotel)
  deleteHotel: (id) => api.delete(`/hotels/${id}`),
  
  // Delete hotel by host (with ownership validation)
  deleteHotelByHost: (id, hostname) => api.delete(`/hotels/${id}/host/${hostname}`),
  
  // Check if hotel is owned by host
  isHotelOwnedByHost: (hotelId, hostname) => api.get(`/hotels/${hotelId}/owner/${hostname}`),
  
  // Get hotel count by hostname
  getHotelCountByHostname: (hostname) => api.get(`/hotels/count/host/${hostname}`),
  
  // Test endpoints
  testHotelAPI: () => api.get('/hotels/test'),
  testCRUDOperations: (testData) => api.post('/hotels/debug/test-crud', testData),
};

// User API
export const userAPI = {
  // Get all users
  getAllUsers: () => api.get('/users'),
  
  // Get user by ID
  getUserById: (id) => api.get(`/users/${id}`),
  
  // Create new user
  createUser: (userData) => api.post('/users', userData),
  
  // Update user
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  
  // Delete user
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;