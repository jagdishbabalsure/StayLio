package com.staylio.backend.Service;

import com.staylio.backend.model.Booking;
import com.staylio.backend.model.Hotel;
import com.staylio.backend.model.User;
import com.staylio.backend.Repo.BookingRepository;
import com.staylio.backend.Repo.HotelRepository;
import com.staylio.backend.Repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private HotelRepository hotelRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    // Get booking by ID
    public Booking getBookingById(Long id) {
        Optional<Booking> booking = bookingRepository.findById(id);
        if (booking.isPresent()) {
            return booking.get();
        } else {
            throw new RuntimeException("Booking not found with id: " + id);
        }
    }
    
    // Get booking by reference
    public Booking getBookingByReference(String reference) {
        Optional<Booking> booking = bookingRepository.findByBookingReference(reference);
        if (booking.isPresent()) {
            return booking.get();
        } else {
            throw new RuntimeException("Booking not found with reference: " + reference);
        }
    }
    
    // Get bookings by user ID
    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
    
    // Get bookings by hotel ID
    public List<Booking> getBookingsByHotelId(Long hotelId) {
        return bookingRepository.findByHotelId(hotelId);
    }
    
    // Get bookings by status
    public List<Booking> getBookingsByStatus(Booking.BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }
    
    // Create new booking
    public Booking createBooking(Booking booking) {
        // Validate user exists
        Optional<User> user = userRepository.findById(booking.getUserId());
        if (!user.isPresent()) {
            throw new RuntimeException("User not found with id: " + booking.getUserId());
        }
        
        // Validate hotel exists
        Optional<Hotel> hotel = hotelRepository.findById(booking.getHotelId());
        if (!hotel.isPresent()) {
            throw new RuntimeException("Hotel not found with id: " + booking.getHotelId());
        }
        
        // Validate dates
        if (booking.getCheckInDate().isAfter(booking.getCheckOutDate())) {
            throw new RuntimeException("Check-in date must be before check-out date");
        }
        
        if (booking.getCheckInDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Check-in date cannot be in the past");
        }
        
        // Calculate total nights and amount
        long nights = ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate());
        booking.setTotalNights((int) nights);
        
        if (booking.getPricePerNight() == null) {
            booking.setPricePerNight(BigDecimal.valueOf(hotel.get().getPrice()));
        }
        
        BigDecimal totalAmount = booking.getPricePerNight()
            .multiply(BigDecimal.valueOf(nights))
            .multiply(BigDecimal.valueOf(booking.getRooms()));
        booking.setTotalAmount(totalAmount);
        
        // Check availability (basic check - can be enhanced)
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(
            booking.getHotelId(), booking.getCheckInDate(), booking.getCheckOutDate());
        
        // For now, we'll allow overlapping bookings (assuming multiple rooms available)
        // In a real system, you'd check room availability
        
        return bookingRepository.save(booking);
    }
    
    // Update booking
    public Booking updateBooking(Long id, Booking bookingDetails) {
        Booking existingBooking = getBookingById(id);
        
        // Update allowed fields (some fields shouldn't be updated after creation)
        if (bookingDetails.getGuestName() != null) {
            existingBooking.setGuestName(bookingDetails.getGuestName());
        }
        if (bookingDetails.getGuestEmail() != null) {
            existingBooking.setGuestEmail(bookingDetails.getGuestEmail());
        }
        if (bookingDetails.getGuestPhone() != null) {
            existingBooking.setGuestPhone(bookingDetails.getGuestPhone());
        }
        if (bookingDetails.getSpecialRequests() != null) {
            existingBooking.setSpecialRequests(bookingDetails.getSpecialRequests());
        }
        if (bookingDetails.getStatus() != null) {
            existingBooking.setStatus(bookingDetails.getStatus());
        }
        
        return bookingRepository.save(existingBooking);
    }
    
    // Update booking status
    public Booking updateBookingStatus(Long id, Booking.BookingStatus status) {
        Booking booking = getBookingById(id);
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
    
    // Cancel booking
    public Booking cancelBooking(Long id) {
        return updateBookingStatus(id, Booking.BookingStatus.CANCELLED);
    }
    
    // Confirm booking
    public Booking confirmBooking(Long id) {
        return updateBookingStatus(id, Booking.BookingStatus.CONFIRMED);
    }
    
    // Delete booking
    public void deleteBooking(Long id) {
        Booking booking = getBookingById(id);
        bookingRepository.delete(booking);
    }
    
    // Check availability for a hotel on given dates
    public boolean checkAvailability(Long hotelId, LocalDate checkIn, LocalDate checkOut, Integer rooms) {
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(hotelId, checkIn, checkOut);
        
        // Simple availability check - in a real system, you'd check actual room inventory
        // For now, assume hotel has unlimited rooms or implement basic logic
        return overlappingBookings.size() < 10; // Arbitrary limit for demo
    }
    
    // Get booking statistics
    public BookingStats getBookingStats() {
        long totalBookings = bookingRepository.count();
        long pendingBookings = bookingRepository.countByStatus(Booking.BookingStatus.PENDING);
        long confirmedBookings = bookingRepository.countByStatus(Booking.BookingStatus.CONFIRMED);
        long cancelledBookings = bookingRepository.countByStatus(Booking.BookingStatus.CANCELLED);
        
        return new BookingStats(totalBookings, pendingBookings, confirmedBookings, cancelledBookings);
    }
    
    // Inner class for booking statistics
    public static class BookingStats {
        private long totalBookings;
        private long pendingBookings;
        private long confirmedBookings;
        private long cancelledBookings;
        
        public BookingStats(long totalBookings, long pendingBookings, long confirmedBookings, long cancelledBookings) {
            this.totalBookings = totalBookings;
            this.pendingBookings = pendingBookings;
            this.confirmedBookings = confirmedBookings;
            this.cancelledBookings = cancelledBookings;
        }
        
        // Getters
        public long getTotalBookings() { return totalBookings; }
        public long getPendingBookings() { return pendingBookings; }
        public long getConfirmedBookings() { return confirmedBookings; }
        public long getCancelledBookings() { return cancelledBookings; }
    }
}