import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFeaturedHotels } from '../data/hotels';
import hotelService from '../services/hotelService';
import { useError } from '../contexts/ErrorContext';
import ConnectionError from './ConnectionError';
import ApiErrorToast from './ApiErrorToast';
import BookingModal from './BookingModal';

const FeaturedHotels = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearchResults, setIsSearchResults] = useState(false);
  const [searchParams, setSearchParams] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if there are search results in localStorage
        const savedSearchResults = localStorage.getItem('searchResults');
        const savedSearchParams = localStorage.getItem('searchParams');

        if (savedSearchResults && savedSearchParams) {
          const searchResults = JSON.parse(savedSearchResults);
          const params = JSON.parse(savedSearchParams);

          if (searchResults.length > 0) {
            setHotels(searchResults);
            setSearchParams(params);
            setIsSearchResults(true);
            setLoading(false);
            return;
          }
        }

        // Load featured hotels if no search results
        const hotelData = await getFeaturedHotels();
        setHotels(hotelData);
        setIsSearchResults(false);
        setSearchParams(null);
      } catch (err) {
        console.error('Error loading hotels:', err);
        setError('Failed to load hotels. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Listen for search events
    const handleSearchCompleted = (event) => {
      const { results, params } = event.detail;
      setHotels(results);
      setSearchParams(params);
      setIsSearchResults(true);
      setLoading(false);
      setError(null);
    };

    // Add event listener
    window.addEventListener('hotelSearchCompleted', handleSearchCompleted);

    loadHotels();

    // Cleanup event listener
    return () => {
      window.removeEventListener('hotelSearchCompleted', handleSearchCompleted);
    };
  }, []);

  const handleBooking = (hotel) => {
    if (!isAuthenticated) {
      // Show login prompt for unauthenticated users
      const shouldLogin = window.confirm(
        `🔐 Login Required\n\n` +
        `You need to be logged in to book ${hotel.name}.\n\n` +
        `Would you like to go to the login page?`
      );
      
      if (shouldLogin) {
        navigate('/login');
      }
      return;
    }

    // User is authenticated, open booking modal
    setSelectedHotel(hotel);
    setIsBookingModalOpen(true);
  };

  const handleBookingModalClose = () => {
    setIsBookingModalOpen(false);
    setSelectedHotel(null);
  };

  const clearSearch = async () => {
    localStorage.removeItem('searchResults');
    localStorage.removeItem('searchParams');
    setIsSearchResults(false);
    setSearchParams(null);
    setLoading(true);

    try {
      const hotelData = await getFeaturedHotels();
      setHotels(hotelData);
    } catch (err) {
      setError('Failed to load hotels. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="hotels" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Hotels
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Loading our handpicked selection of premium hotels...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="hotels" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Hotels
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-red-800 font-medium">Unable to load hotels</h3>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                  <p className="text-red-600 text-sm mt-1">Please ensure the API server is running on http://localhost:8081</p>
                </div>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="hotels" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {isSearchResults ? 'Search Results' : 'Featured Hotels'}
          </h2>
          {isSearchResults && searchParams ? (
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-600 mb-4">
                Found {hotels.length} hotel{hotels.length !== 1 ? 's' : ''} in {searchParams.destination}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 inline-block">
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-700">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {searchParams.destination}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {searchParams.checkIn} - {searchParams.checkOut}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {searchParams.guests} guest{searchParams.guests !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
              >
                Clear search and show featured hotels
              </button>
            </div>
          ) : (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium hotels and resorts
            </p>
          )}
        </div>

        {hotels.length === 0 && !loading && !error ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isSearchResults ? 'No hotels found' : 'No hotels available'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isSearchResults
                ? `We couldn't find any hotels matching your search criteria in ${searchParams?.destination || 'this location'}.`
                : 'No hotels are currently available. Please try again later.'
              }
            </p>
            {isSearchResults && (
              <button
                onClick={clearSearch}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Featured Hotels
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel, index) => (
              <div
                key={hotel.id}
                className="bg-white rounded-2xl shadow-lg card-hover overflow-hidden group"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeIn 0.6s ease-in-out forwards'
                }}
              >
                {/* Hotel Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full shadow-md">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">
                        {hotel.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hotel Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {hotel.name}
                  </h3>

                  <div className="flex items-center text-gray-600 mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{hotel.city}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{hotel.rating}</span>
                      <span>({hotel.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">
                        ₹ {hotel.price}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">
                        /night
                      </span>
                    </div>

                    <button
                      onClick={() => handleBooking(hotel)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg cursor-pointer btn-hover-effect ${
                        isAuthenticated 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300'
                      }`}
                    >
                      {isAuthenticated ? (
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1M8 7h8m-9 4v8a2 2 0 002 2h8a2 2 0 002-2v-8M9 11h6" />
                          </svg>
                          <span>Book Now</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span>Login to Book</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/hotels')}
            className="btn-secondary transform hover:scale-105 cursor-pointer"
          >
            View All Hotels
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleBookingModalClose}
        hotel={selectedHotel}
      />
    </section>
  );
};

export default FeaturedHotels;