/**
 * Booking Service
 * API service for managing hotel bookings
 */

const API_BASE_URL = 'http://localhost:8081/api';

class BookingService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 10000; // 10 seconds timeout
  }

  /**
   * Get authentication headers
   */
  getAuthHeaders() {
    const user = localStorage.getItem('staylio_user');
    const token = localStorage.getItem('staylio_token');
    
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(user && { 'X-User-ID': JSON.parse(user).id })
    };
  }

  /**
   * Create a fetch request with timeout and proper error handling
   */
  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.statusText = response.statusText;
        
        // Try to get error details from response
        try {
          const errorData = await response.json();
          error.data = errorData;
          error.message = errorData.message || error.message;
        } catch (e) {
          // Response is not JSON, use default message
        }
        
        throw error;
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout - Server is taking too long to respond');
        timeoutError.status = 0;
        timeoutError.code = 'TIMEOUT';
        throw timeoutError;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const networkError = new Error('Network connection failed - Please check your internet connection');
        networkError.status = 0;
        networkError.code = 'NETWORK_ERROR';
        throw networkError;
      }
      
      throw error;
    }
  }

  /**
   * Create a new booking
   */
  async createBooking(bookingData) {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/bookings`, {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw this.enhanceError(error, 'createBooking');
    }
  }

  /**
   * Get all bookings for a user
   */
  async getUserBookings(userId) {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/bookings/user/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw this.enhanceError(error, 'getUserBookings');
    }
  }

  /**
   * Get booking by ID
   */
  async getBookingById(bookingId) {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/bookings/${bookingId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw this.enhanceError(error, 'getBookingById');
    }
  }

  /**
   * Get booking by reference number
   */
  async getBookingByReference(reference) {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/bookings/reference/${reference}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching booking by reference:', error);
      throw this.enhanceError(error, 'getBookingByReference');
    }
  }

  /**
   * Update booking
   */
  async updateBooking(bookingId, updateData) {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/bookings/${bookingId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw this.enhanceError(error, 'updateBooking');
    }
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId) {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw this.enhanceError(error, 'cancelBooking');
    }
  }

  /**
   * Check hotel availability
   */
  async checkAvailability(hotelId, checkIn, checkOut, rooms = 1) {
    try {
      const params = new URLSearchParams({
        hotelId: hotelId.toString(),
        checkIn,
        checkOut,
        rooms: rooms.toString()
      });

      const response = await this.fetchWithTimeout(`${this.baseURL}/bookings/availability?${params}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw this.enhanceError(error, 'checkAvailability');
    }
  }

  /**
   * Get booking statistics
   */
  async getBookingStats() {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/bookings/stats`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      throw this.enhanceError(error, 'getBookingStats');
    }
  }

  /**
   * Calculate total amount for booking
   */
  calculateTotalAmount(pricePerNight, checkIn, checkOut, rooms = 1) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return {
      nights,
      totalAmount: pricePerNight * nights * rooms,
      pricePerNight,
      rooms
    };
  }

  /**
   * Validate booking data
   */
  validateBookingData(bookingData) {
    const errors = {};

    // Required fields
    if (!bookingData.userId) errors.userId = 'User ID is required';
    if (!bookingData.hotelId) errors.hotelId = 'Hotel ID is required';
    if (!bookingData.guestName?.trim()) errors.guestName = 'Guest name is required';
    if (!bookingData.guestEmail?.trim()) errors.guestEmail = 'Guest email is required';
    if (!bookingData.guestPhone?.trim()) errors.guestPhone = 'Guest phone is required';
    if (!bookingData.checkInDate) errors.checkInDate = 'Check-in date is required';
    if (!bookingData.checkOutDate) errors.checkOutDate = 'Check-out date is required';
    if (!bookingData.guests || bookingData.guests < 1) errors.guests = 'Number of guests is required';
    if (!bookingData.rooms || bookingData.rooms < 1) errors.rooms = 'Number of rooms is required';

    // Email validation
    if (bookingData.guestEmail && !/\S+@\S+\.\S+/.test(bookingData.guestEmail)) {
      errors.guestEmail = 'Please enter a valid email address';
    }

    // Date validation
    if (bookingData.checkInDate && bookingData.checkOutDate) {
      const checkIn = new Date(bookingData.checkInDate);
      const checkOut = new Date(bookingData.checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        errors.checkInDate = 'Check-in date cannot be in the past';
      }

      if (checkOut <= checkIn) {
        errors.checkOutDate = 'Check-out date must be after check-in date';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Format booking data for display
   */
  formatBookingForDisplay(booking) {
    return {
      ...booking,
      checkInFormatted: new Date(booking.checkInDate).toLocaleDateString(),
      checkOutFormatted: new Date(booking.checkOutDate).toLocaleDateString(),
      totalAmountFormatted: `₹${booking.totalAmount?.toLocaleString()}`,
      createdAtFormatted: new Date(booking.createdAt).toLocaleDateString(),
      statusFormatted: this.formatStatus(booking.status)
    };
  }

  /**
   * Format booking status for display
   */
  formatStatus(status) {
    const statusMap = {
      'PENDING': 'Pending',
      'CONFIRMED': 'Confirmed',
      'CANCELLED': 'Cancelled',
      'COMPLETED': 'Completed'
    };
    return statusMap[status] || status;
  }

  /**
   * Get status color for UI
   */
  getStatusColor(status) {
    const colorMap = {
      'PENDING': 'yellow',
      'CONFIRMED': 'green',
      'CANCELLED': 'red',
      'COMPLETED': 'blue'
    };
    return colorMap[status] || 'gray';
  }

  /**
   * Enhance error with additional context
   */
  enhanceError(error, operation, context = {}) {
    const enhancedError = new Error(error.message);
    enhancedError.status = error.status;
    enhancedError.code = error.code;
    enhancedError.data = error.data;
    enhancedError.operation = operation;
    enhancedError.context = context;
    enhancedError.timestamp = new Date().toISOString();
    enhancedError.baseURL = this.baseURL;
    
    return enhancedError;
  }
}

// Create singleton instance
const bookingService = new BookingService();

export default bookingService;