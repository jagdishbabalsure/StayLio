package com.staylio.backend.Service;

import com.staylio.backend.model.BookingAttributes;
import com.staylio.backend.Repo.BookingAttributesRepository;
import com.staylio.backend.Repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BookingAttributesService {
    
    @Autowired
    private BookingAttributesRepository bookingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<BookingAttributes> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public Optional<BookingAttributes> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }
    
    public List<BookingAttributes> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
    
    public List<BookingAttributes> getBookingsByStatus(BookingAttributes.BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }
    
    public BookingAttributes createBooking(BookingAttributes booking) {
        // Validate user exists
        if (!userRepository.existsById(booking.getUserId())) {
            throw new RuntimeException("User not found with id: " + booking.getUserId());
        }
        
        // Validate dates
        if (booking.getCheckInDate().isAfter(booking.getCheckOutDate())) {
            throw new RuntimeException("Check-in date cannot be after check-out date");
        }
        
        return bookingRepository.save(booking);
    }
    
    public BookingAttributes updateBooking(Long id, BookingAttributes bookingDetails) {
        BookingAttributes booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        
        // Validate user exists if userId is being changed
        if (!booking.getUserId().equals(bookingDetails.getUserId()) && 
            !userRepository.existsById(bookingDetails.getUserId())) {
            throw new RuntimeException("User not found with id: " + bookingDetails.getUserId());
        }
        
        // Validate dates
        if (bookingDetails.getCheckInDate().isAfter(bookingDetails.getCheckOutDate())) {
            throw new RuntimeException("Check-in date cannot be after check-out date");
        }
        
        booking.setUserId(bookingDetails.getUserId());
        booking.setRoomTypeId(bookingDetails.getRoomTypeId());
        booking.setCheckInDate(bookingDetails.getCheckInDate());
        booking.setCheckOutDate(bookingDetails.getCheckOutDate());
        booking.setGuests(bookingDetails.getGuests());
        booking.setTotalAmount(bookingDetails.getTotalAmount());
        booking.setStatus(bookingDetails.getStatus());
        
        return bookingRepository.save(booking);
    }
    
    public BookingAttributes updateBookingStatus(Long id, BookingAttributes.BookingStatus status) {
        BookingAttributes booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
    
    public void deleteBooking(Long id) {
        BookingAttributes booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        bookingRepository.delete(booking);
    }
}