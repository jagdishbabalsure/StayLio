/**
 * Hotel Management Service
 * Comprehensive service for hotel CRUD operations with role-based access control
 */

import { hotelAPI } from './api';

class HotelManagementService {
  constructor() {
    this.currentUser = null;
  }

  // Set current user context
  setUser(user) {
    this.currentUser = user;
  }

  // Get current user from localStorage if not set
  getCurrentUser() {
    if (!this.currentUser) {
      const savedUser = localStorage.getItem('staylio_user');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
    }
    return this.currentUser;
  }

  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  // Check if user is host
  isHost() {
    const user = this.getCurrentUser();
    return user?.role === 'host';
  }

  // Get user's hostname
  getUserHostname() {
    const user = this.getCurrentUser();
    return user?.hostname;
  }

  /**
   * Fetch hotels based on user role
   * Admins get all hotels, hosts get only their hotels
   */
  async fetchHotels() {
    try {
      const user = this.getCurrentUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      let response;
      
      if (this.isAdmin()) {
        // Admin can see all hotels
        response = await hotelAPI.getAllHotels();
      } else if (this.isHost() && user.hostname) {
        // Host can only see their hotels
        response = await hotelAPI.getHotelsByHostname(user.hostname);
      } else {
        throw new Error('Insufficient permissions or missing hostname');
      }

      return {
        success: true,
        data: response.data || [],
        message: 'Hotels fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching hotels:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || error.message || 'Failed to fetch hotels'
      };
    }
  }

  /**
   * Get a specific hotel by ID
   */
  async getHotelById(hotelId) {
    try {
      const response = await hotelAPI.getHotelById(hotelId);
      return {
        success: true,
        data: response.data,
        message: 'Hotel fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching hotel:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch hotel'
      };
    }
  }

  /**
   * Create a new hotel
   */
  async createHotel(hotelData) {
    try {
      const user = this.getCurrentUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Validate required fields
      this.validateHotelData(hotelData);

      // Set hostname for hosts
      if (this.isHost() && user.hostname) {
        hotelData.hostname = user.hostname;
      }

      const response = await hotelAPI.createHotel(hotelData);
      
      return {
        success: true,
        data: response.data,
        message: 'Hotel created successfully'
      };
    } catch (error) {
      console.error('Error creating hotel:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || error.message || 'Failed to create hotel'
      };
    }
  }

  /**
   * Update a hotel with role-based access control
   */
  async updateHotel(hotelId, hotelData) {
    try {
      const user = this.getCurrentUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Validate required fields
      this.validateHotelData(hotelData);

      let response;

      if (this.isAdmin()) {
        // Admin can update any hotel
        response = await hotelAPI.updateHotel(hotelId, hotelData);
      } else if (this.isHost() && user.hostname) {
        // Host can only update their own hotels
        response = await hotelAPI.updateHotelByHost(hotelId, user.hostname, hotelData);
      } else {
        throw new Error('Insufficient permissions');
      }

      return {
        success: true,
        data: response.data,
        message: 'Hotel updated successfully'
      };
    } catch (error) {
      console.error('Error updating hotel:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || error.message || 'Failed to update hotel'
      };
    }
  }

  /**
   * Delete a hotel with role-based access control
   */
  async deleteHotel(hotelId) {
    try {
      const user = this.getCurrentUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (this.isAdmin()) {
        // Admin can delete any hotel
        await hotelAPI.deleteHotel(hotelId);
      } else if (this.isHost() && user.hostname) {
        // Host can only delete their own hotels
        await hotelAPI.deleteHotelByHost(hotelId, user.hostname);
      } else {
        throw new Error('Insufficient permissions');
      }

      return {
        success: true,
        message: 'Hotel deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting hotel:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to delete hotel'
      };
    }
  }

  /**
   * Check if current user can edit a specific hotel
   */
  canEditHotel(hotel) {
    const user = this.getCurrentUser();
    
    if (!user) return false;
    
    // Admin can edit any hotel
    if (this.isAdmin()) return true;
    
    // Host can only edit their own hotels
    if (this.isHost() && user.hostname && hotel.hostname === user.hostname) {
      return true;
    }
    
    return false;
  }

  /**
   * Check if current user can delete a specific hotel
   */
  canDeleteHotel(hotel) {
    // Same logic as edit for now
    return this.canEditHotel(hotel);
  }

  /**
   * Validate hotel data
   */
  validateHotelData(hotelData) {
    const errors = [];

    if (!hotelData.name || hotelData.name.trim().length === 0) {
      errors.push('Hotel name is required');
    }

    if (!hotelData.city || hotelData.city.trim().length === 0) {
      errors.push('City is required');
    }

    if (!hotelData.price || hotelData.price <= 0) {
      errors.push('Valid price is required');
    }

    if (hotelData.rating === null || hotelData.rating === undefined || 
        hotelData.rating < 0 || hotelData.rating > 5) {
      errors.push('Rating must be between 0 and 5');
    }

    if (hotelData.reviews !== null && hotelData.reviews !== undefined && hotelData.reviews < 0) {
      errors.push('Reviews count cannot be negative');
    }

    if (hotelData.image && hotelData.image.trim().length > 0) {
      const imageUrl = hotelData.image.trim().toLowerCase();
      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        errors.push('Image URL must be a valid HTTP/HTTPS URL');
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  /**
   * Get hotel statistics for dashboard
   */
  async getHotelStats() {
    try {
      const hotelsResult = await this.fetchHotels();
      
      if (!hotelsResult.success) {
        return {
          success: false,
          data: null,
          message: hotelsResult.message
        };
      }

      const hotels = hotelsResult.data;
      
      const stats = {
        totalHotels: hotels.length,
        totalRevenue: hotels.reduce((sum, hotel) => sum + (hotel.price * hotel.reviews * 0.1), 0),
        averageRating: hotels.length > 0 
          ? hotels.reduce((sum, hotel) => sum + hotel.rating, 0) / hotels.length 
          : 0,
        totalReviews: hotels.reduce((sum, hotel) => sum + hotel.reviews, 0),
        highestRated: hotels.length > 0 
          ? Math.max(...hotels.map(h => h.rating))
          : 0,
        lowestPrice: hotels.length > 0 
          ? Math.min(...hotels.map(h => h.price))
          : 0,
        highestPrice: hotels.length > 0 
          ? Math.max(...hotels.map(h => h.price))
          : 0,
      };

      return {
        success: true,
        data: stats,
        message: 'Statistics calculated successfully'
      };
    } catch (error) {
      console.error('Error calculating hotel stats:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to calculate statistics'
      };
    }
  }

  /**
   * Search and filter hotels
   */
  filterHotels(hotels, searchTerm, filters = {}) {
    let filtered = [...hotels];

    // Text search
    if (searchTerm && searchTerm.trim().length > 0) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(hotel =>
        hotel.name?.toLowerCase().includes(term) ||
        hotel.city?.toLowerCase().includes(term) ||
        hotel.hostname?.toLowerCase().includes(term)
      );
    }

    // Price range filter
    if (filters.minPrice !== undefined && filters.minPrice !== null) {
      filtered = filtered.filter(hotel => hotel.price >= filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
      filtered = filtered.filter(hotel => hotel.price <= filters.maxPrice);
    }

    // Rating filter
    if (filters.minRating !== undefined && filters.minRating !== null) {
      filtered = filtered.filter(hotel => hotel.rating >= filters.minRating);
    }

    // City filter
    if (filters.city && filters.city.trim().length > 0) {
      filtered = filtered.filter(hotel => 
        hotel.city?.toLowerCase().includes(filters.city.toLowerCase().trim())
      );
    }

    return filtered;
  }
}

// Create singleton instance
const hotelManagementService = new HotelManagementService();

export default hotelManagementService;