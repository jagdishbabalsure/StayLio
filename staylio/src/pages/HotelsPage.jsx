import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBooking = (hotel) => {
    const confirmed = window.confirm(
      `🏨 Book ${hotel.name}?\n\n` +
      `📍 Location: ${hotel.city}\n` +
      `💰 Price: ₹${hotel.price.toLocaleString()} per night\n` +
      `⭐ Rating: ${hotel.rating}/5 (${hotel.reviews.toLocaleString()} reviews)\n\n` +
      `Click OK to proceed with booking!`
    );

    if (confirmed) {
      alert(`🎉 Booking confirmed for ${hotel.name}!\n\nYou will receive a confirmation email shortly.\n\nThank you for choosing our service!`);
    }
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:8081/api/hotels');

        if (!response.ok) {
          throw new Error(`Failed to fetch hotels: ${response.status}`);
        }

        const data = await response.json();
        setHotels(data);
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-6"></div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Loading hotels...</h2>
              <p className="text-lg text-gray-600 mb-2">Please wait while we fetch the latest hotel information</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Failed to fetch hotels</h2>
              <p className="text-lg text-gray-600 mb-2">{error}</p>
              <p className="text-gray-500 mb-8">Please ensure the API server is running on http://localhost:8081</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors duration-300 font-semibold shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header Section */}
      <div className="pt-24 pb-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Available Hotels
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Discover <span className="text-blue-600 font-semibold">{hotels.length}</span> amazing hotels
            </p>
            <p className="text-lg text-gray-500">
              Find your perfect stay from our premium collection
            </p>
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel, index) => (
            <div
              key={hotel.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300 transform hover:scale-105"
            >
              {/* Hotel Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 shadow-md">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500 text-sm">⭐</span>
                    <span className="text-sm font-semibold text-gray-800">{hotel.rating}</span>
                  </div>
                </div>
              </div>

              {/* Hotel Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                  {hotel.name}
                </h3>

                <div className="flex items-center text-gray-600 mb-4">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">{hotel.city}</span>
                </div>

                <div className="flex items-center justify-between mb-4 pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      ₹{hotel.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">per night</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-700 font-medium">
                      {hotel.reviews.toLocaleString()} reviews
                    </div>
                    <div className="text-xs text-gray-500">verified</div>
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={() => handleBooking(hotel)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HotelsPage;