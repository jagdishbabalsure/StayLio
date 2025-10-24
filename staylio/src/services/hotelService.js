/**
 * Hotel Service
 * API service for fetching hotel data from backend with proper error handling
 */

const API_BASE_URL = 'http://localhost:8081/api';

class HotelService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 10000; // 10 seconds timeout
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
          'Content-Type': 'application/json',
          'Accept': 'application/json',
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
   * Fetch all hotels from the API
   */
  async getAllHotels() {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/hotels`);
      const data = await response.json();
      
      // Transform API data to match our UI expectations
      return this.transformHotelData(data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      
      // Re-throw the error so components can handle it properly
      throw this.enhanceError(error, 'getAllHotels');
    }
  }

  /**
   * Fetch a specific hotel by ID
   */
  async getHotelById(id) {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/hotels/${id}`);
      const data = await response.json();
      return this.transformSingleHotel(data);
    } catch (error) {
      console.error(`Error fetching hotel ${id}:`, error);
      throw this.enhanceError(error, 'getHotelById', { hotelId: id });
    }
  }

  /**
   * Search hotels with filters
   */
  async searchHotels(searchParams) {
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const response = await this.fetchWithTimeout(`${this.baseURL}/hotels/search?${queryString}`);
      const data = await response.json();
      return this.transformHotelData(data);
    } catch (error) {
      console.error('Error searching hotels:', error);
      throw this.enhanceError(error, 'searchHotels', { searchParams });
    }
  }

  /**
   * Transform API data to match UI expectations
   */
  transformHotelData(apiData) {
    // Handle different API response formats
    const hotels = Array.isArray(apiData) ? apiData : 
                  apiData.hotels ? apiData.hotels : 
                  apiData.data ? apiData.data : [];

    return hotels.map(hotel => this.transformSingleHotel(hotel));
  }

  /**
   * Transform single hotel data
   */
  transformSingleHotel(hotel) {
    return {
      id: hotel.id || hotel._id,
      name: hotel.name || hotel.hotelName || 'Unknown Hotel',
      image: hotel.image || hotel.primaryImage || hotel.images?.[0] || hotel.photo || 
             'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: hotel.price || hotel.pricePerNight || hotel.basePrice || hotel.rate || 0,
      rating: hotel.rating || hotel.averageRating || hotel.stars || hotel.starRating || 0,
      city: hotel.city || hotel.location?.city || hotel.address?.city || 'Unknown City',
      reviews: hotel.reviews || hotel.reviewCount || hotel.totalReviews || hotel.numberOfReviews || 0,
      
      // Additional fields that might be useful
      description: hotel.description || hotel.shortDescription || '',
      address: hotel.address || hotel.location?.address || '',
      country: hotel.country || hotel.location?.country || '',
      amenities: hotel.amenities || hotel.facilities || [],
      images: hotel.images || [hotel.image].filter(Boolean) || [],
      
      // Ensure backward compatibility with existing UI
      get displayPrice() {
        return `$${this.price}`;
      },
      get displayRating() {
        return Math.round(this.rating * 10) / 10;
      }
    };
  }

  /**
   * Fallback hotels in case API is unavailable
   */
  getFallbackHotels() {
    return [
      {
        id: 'fallback-1',
        name: "API Connection Error",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        price: 0,
        rating: 0,
        city: "Please check API connection",
        reviews: 0,
        description: "Unable to load hotels from API. Please ensure the backend server is running on http://localhost:8081"
      }
    ];
  }

  /**
   * Get featured hotels (first 6 hotels)
   */
  async getFeaturedHotels() {
    const allHotels = await this.getAllHotels();
    return allHotels.slice(0, 6);
  }

  /**
   * Check API health
   */
  async checkApiHealth() {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/health`);
      return {
        isHealthy: response.ok,
        status: response.status,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.warn('API health check failed:', error);
      return {
        isHealthy: false,
        error: error.message,
        status: error.status || 0,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Enhance error with additional context and metadata
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

  /**
   * Get fallback hotels with proper error indication
   */
  getFallbackHotels() {
    return [];
  }
}

// Create singleton instance
const hotelService = new HotelService();

export default hotelService;