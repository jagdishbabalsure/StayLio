import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/bookingService';

const BookingModal = ({ isOpen, onClose, hotel }) => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Confirmation, 3: Success
  const [bookingData, setBookingData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    rooms: 1,
    roomType: 'Standard',
    specialRequests: ''
  });
  const [errors, setErrors] = useState({});
  const [bookingResult, setBookingResult] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [nights, setNights] = useState(0);

  // Initialize form with user data if logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setBookingData(prev => ({
        ...prev,
        guestName: user.fullName || `${user.firstName} ${user.lastName}` || '',
        guestEmail: user.email || '',
        guestPhone: user.phone || ''
      }));
    }
  }, [isAuthenticated, user]);

  // Calculate total amount when dates or rooms change
  useEffect(() => {
    if (bookingData.checkInDate && bookingData.checkOutDate && hotel) {
      const calculation = bookingService.calculateTotalAmount(
        hotel.price,
        bookingData.checkInDate,
        bookingData.checkOutDate,
        bookingData.rooms
      );
      setTotalAmount(calculation.totalAmount);
      setNights(calculation.nights);
    }
  }, [bookingData.checkInDate, bookingData.checkOutDate, bookingData.rooms, hotel]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const validation = bookingService.validateBookingData({
      ...bookingData,
      userId: user?.id,
      hotelId: hotel?.id
    });

    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleBookingSubmit = async () => {
    if (!isAuthenticated) {
      alert('Please log in to make a booking');
      return;
    }

    setLoading(true);
    try {
      const bookingPayload = {
        userId: user.id,
        hotelId: hotel.id,
        guestName: bookingData.guestName,
        guestEmail: bookingData.guestEmail,
        guestPhone: bookingData.guestPhone,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        guests: parseInt(bookingData.guests),
        rooms: parseInt(bookingData.rooms),
        roomType: bookingData.roomType,
        specialRequests: bookingData.specialRequests
      };

      const result = await bookingService.createBooking(bookingPayload);
      
      if (result.success) {
        setBookingResult(result);
        setStep(3);
      } else {
        setErrors({ general: result.message || 'Booking failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: error.message || 'Booking failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setErrors({});
    setBookingResult(null);
    setBookingData({
      guestName: user?.fullName || `${user?.firstName} ${user?.lastName}` || '',
      guestEmail: user?.email || '',
      guestPhone: user?.phone || '',
      checkInDate: '',
      checkOutDate: '',
      guests: 1,
      rooms: 1,
      roomType: 'Standard',
      specialRequests: ''
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen || !hotel) return null;

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle bg-white shadow-xl rounded-2xl transform transition-all">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {step === 1 && 'Book Your Stay'}
                  {step === 2 && 'Confirm Booking'}
                  {step === 3 && 'Booking Confirmed!'}
                </h3>
                <p className="text-blue-100 text-sm">{hotel.name} - {hotel.city}</p>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:text-blue-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress indicator */}
            <div className="mt-4 flex items-center space-x-2">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-8 h-1 mx-2 ${
                      step > stepNum ? 'bg-white' : 'bg-blue-500'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Modal Content */}
          <div className="px-6 py-6">
            {/* Step 1: Booking Details */}
            {step === 1 && (
              <div className="space-y-6">
                {!isAuthenticated && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex">
                      <svg className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-21 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Login Required</h4>
                        <p className="text-sm text-yellow-700 mt-1">Please log in to make a booking.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Guest Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="guestName"
                        value={bookingData.guestName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.guestName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.guestName && <p className="text-sm text-red-600 mt-1">{errors.guestName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="guestEmail"
                        value={bookingData.guestEmail}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.guestEmail ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                      {errors.guestEmail && <p className="text-sm text-red-600 mt-1">{errors.guestEmail}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="guestPhone"
                        value={bookingData.guestPhone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.guestPhone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your phone number"
                      />
                      {errors.guestPhone && <p className="text-sm text-red-600 mt-1">{errors.guestPhone}</p>}
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in Date *
                      </label>
                      <input
                        type="date"
                        name="checkInDate"
                        value={bookingData.checkInDate}
                        onChange={handleInputChange}
                        min={today}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.checkInDate ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.checkInDate && <p className="text-sm text-red-600 mt-1">{errors.checkInDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out Date *
                      </label>
                      <input
                        type="date"
                        name="checkOutDate"
                        value={bookingData.checkOutDate}
                        onChange={handleInputChange}
                        min={bookingData.checkInDate || today}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.checkOutDate ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.checkOutDate && <p className="text-sm text-red-600 mt-1">{errors.checkOutDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Guests *
                      </label>
                      <select
                        name="guests"
                        value={bookingData.guests}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Rooms *
                      </label>
                      <select
                        name="rooms"
                        value={bookingData.rooms}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Room Type
                      </label>
                      <select
                        name="roomType"
                        value={bookingData.roomType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Standard">Standard Room</option>
                        <option value="Deluxe">Deluxe Room</option>
                        <option value="Suite">Suite</option>
                        <option value="Premium">Premium Room</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        name="specialRequests"
                        value={bookingData.specialRequests}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any special requests or preferences..."
                      />
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                {nights > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Price Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>₹{hotel.price.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''} × {bookingData.rooms} room{bookingData.rooms > 1 ? 's' : ''}</span>
                        <span>₹{totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>₹{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700">{errors.general}</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Confirmation */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">Booking Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><span className="font-medium">Hotel:</span> {hotel.name}</p>
                      <p><span className="font-medium">Location:</span> {hotel.city}</p>
                      <p><span className="font-medium">Guest:</span> {bookingData.guestName}</p>
                      <p><span className="font-medium">Email:</span> {bookingData.guestEmail}</p>
                      <p><span className="font-medium">Phone:</span> {bookingData.guestPhone}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Check-in:</span> {new Date(bookingData.checkInDate).toLocaleDateString()}</p>
                      <p><span className="font-medium">Check-out:</span> {new Date(bookingData.checkOutDate).toLocaleDateString()}</p>
                      <p><span className="font-medium">Guests:</span> {bookingData.guests}</p>
                      <p><span className="font-medium">Rooms:</span> {bookingData.rooms}</p>
                      <p><span className="font-medium">Room Type:</span> {bookingData.roomType}</p>
                    </div>
                  </div>
                  {bookingData.specialRequests && (
                    <div className="mt-4">
                      <p><span className="font-medium">Special Requests:</span> {bookingData.specialRequests}</p>
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <p className="text-lg font-semibold text-blue-900">
                      Total Amount: ₹{totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700">{errors.general}</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && bookingResult && (
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                  <p className="text-gray-600 mb-4">Your booking has been successfully created.</p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 text-left">
                    <h4 className="font-semibold text-gray-900 mb-2">Booking Details</h4>
                    <p><span className="font-medium">Booking Reference:</span> {bookingResult.bookingReference}</p>
                    <p><span className="font-medium">Hotel:</span> {hotel.name}</p>
                    <p><span className="font-medium">Check-in:</span> {new Date(bookingData.checkInDate).toLocaleDateString()}</p>
                    <p><span className="font-medium">Check-out:</span> {new Date(bookingData.checkOutDate).toLocaleDateString()}</p>
                    <p><span className="font-medium">Total Amount:</span> ₹{totalAmount.toLocaleString()}</p>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    A confirmation email has been sent to {bookingData.guestEmail}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between">
            {step === 1 && (
              <>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!isAuthenticated}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleBookingSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </>
            )}

            {step === 3 && (
              <button
                onClick={handleClose}
                className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;