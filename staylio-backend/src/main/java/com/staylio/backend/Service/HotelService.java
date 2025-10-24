package com.staylio.backend.Service;

import com.staylio.backend.model.Hotel;
import com.staylio.backend.model.Host;
import com.staylio.backend.Repo.HotelRepository;
import com.staylio.backend.Repo.HostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HotelService {
    
    @Autowired
    private HotelRepository hotelRepository;
    
    @Autowired
    private HostRepository hostRepository;
    
    // Get all hotels
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }
    
    // Get hotel by ID
    public Optional<Hotel> getHotelById(Long id) {
        return hotelRepository.findById(id);
    }
    
    // Get hotels by hostname (for host-specific access)
    public List<Hotel> getHotelsByHostname(String hostname) {
        return hotelRepository.findByHostname(hostname);
    }
    
    // Get hotels by host ID
    public List<Hotel> getHotelsByHostId(Long hostId) {
        return hotelRepository.findByHostId(hostId);
    }
    
    // Get hotels by host entity
    public List<Hotel> getHotelsByHost(Host host) {
        return hotelRepository.findByHost(host);
    }
    
    // Create new hotel
    public Hotel createHotel(Hotel hotel) {
        // Validate hotel data
        validateHotelData(hotel);
        
        // Set default values if not provided
        if (hotel.getReviews() == null) {
            hotel.setReviews(0);
        }
        
        return hotelRepository.save(hotel);
    }
    
    // Update hotel (admin access - can update any hotel)
    public Hotel updateHotel(Long id, Hotel hotelDetails) {
        Optional<Hotel> existingHotel = hotelRepository.findById(id);
        if (existingHotel.isPresent()) {
            Hotel hotel = existingHotel.get();
            
            // Validate updated data
            validateHotelData(hotelDetails);
            
            // Update fields
            hotel.setName(hotelDetails.getName());
            hotel.setImage(hotelDetails.getImage());
            hotel.setPrice(hotelDetails.getPrice());
            hotel.setRating(hotelDetails.getRating());
            hotel.setCity(hotelDetails.getCity());
            hotel.setReviews(hotelDetails.getReviews());
            hotel.setHostname(hotelDetails.getHostname());
            
            // Only update host if provided
            if (hotelDetails.getHost() != null) {
                hotel.setHost(hotelDetails.getHost());
            }
            
            return hotelRepository.save(hotel);
        } else {
            throw new RuntimeException("Hotel not found with id: " + id);
        }
    }
    
    // Delete hotel (admin access - can delete any hotel)
    public void deleteHotel(Long id) {
        if (hotelRepository.existsById(id)) {
            hotelRepository.deleteById(id);
        } else {
            throw new RuntimeException("Hotel not found with id: " + id);
        }
    }
    
    // Update hotel with host ownership validation
    public Hotel updateHotelByHost(Long id, String hostname, Hotel hotelDetails) {
        Optional<Hotel> existingHotel = hotelRepository.findById(id);
        if (existingHotel.isPresent()) {
            Hotel hotel = existingHotel.get();
            
            // Check if the hotel belongs to the host
            if (hotel.getHostname() == null || !hotel.getHostname().equals(hostname)) {
                throw new RuntimeException("Hotel not found or not authorized to update");
            }
            
            // Validate updated data
            validateHotelData(hotelDetails);
            
            // Update fields (hosts cannot change hostname)
            hotel.setName(hotelDetails.getName());
            hotel.setImage(hotelDetails.getImage());
            hotel.setPrice(hotelDetails.getPrice());
            hotel.setRating(hotelDetails.getRating());
            hotel.setCity(hotelDetails.getCity());
            hotel.setReviews(hotelDetails.getReviews());
            
            return hotelRepository.save(hotel);
        } else {
            throw new RuntimeException("Hotel not found with id: " + id);
        }
    }
    
    // Delete hotel with host ownership validation
    public void deleteHotelByHost(Long id, String hostname) {
        Optional<Hotel> existingHotel = hotelRepository.findById(id);
        if (existingHotel.isPresent()) {
            Hotel hotel = existingHotel.get();
            
            // Check if the hotel belongs to the host
            if (hotel.getHostname() == null || !hotel.getHostname().equals(hostname)) {
                throw new RuntimeException("Hotel not found or not authorized to delete");
            }
            
            hotelRepository.deleteById(id);
        } else {
            throw new RuntimeException("Hotel not found with id: " + id);
        }
    }
    
    // Validate hotel data
    private void validateHotelData(Hotel hotel) {
        if (hotel.getName() == null || hotel.getName().trim().isEmpty()) {
            throw new RuntimeException("Hotel name is required");
        }
        
        if (hotel.getCity() == null || hotel.getCity().trim().isEmpty()) {
            throw new RuntimeException("City is required");
        }
        
        if (hotel.getPrice() == null || hotel.getPrice() <= 0) {
            throw new RuntimeException("Valid price is required");
        }
        
        if (hotel.getRating() == null || hotel.getRating() < 0 || hotel.getRating() > 5) {
            throw new RuntimeException("Rating must be between 0 and 5");
        }
        
        if (hotel.getReviews() != null && hotel.getReviews() < 0) {
            throw new RuntimeException("Reviews count cannot be negative");
        }
        
        // Validate image URL format (basic validation)
        if (hotel.getImage() != null && !hotel.getImage().trim().isEmpty()) {
            String imageUrl = hotel.getImage().trim().toLowerCase();
            if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
                throw new RuntimeException("Image URL must be a valid HTTP/HTTPS URL");
            }
        }
    }
    
    // Check if hotel exists and belongs to host
    public boolean isHotelOwnedByHost(Long hotelId, String hostname) {
        Optional<Hotel> hotel = hotelRepository.findById(hotelId);
        return hotel.isPresent() && 
               hotel.get().getHostname() != null && 
               hotel.get().getHostname().equals(hostname);
    }
    
    // Get hotel count by hostname
    public long getHotelCountByHostname(String hostname) {
        return hotelRepository.findByHostname(hostname).size();
    }
}