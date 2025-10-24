package com.staylio.backend.Controllers;

import com.staylio.backend.model.Hotel;
import com.staylio.backend.Service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    // GET - Get all hotels
    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotels() {
        try {
            List<Hotel> hotels = hotelService.getAllHotels();
            if (hotels.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(hotels, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET - Get hotels by hostname (for host-specific access)
    @GetMapping("/host/{hostname}")
    public ResponseEntity<List<Hotel>> getHotelsByHostname(@PathVariable String hostname) {
        try {
            List<Hotel> hotels = hotelService.getHotelsByHostname(hostname);
            return new ResponseEntity<>(hotels, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET - Get hotels by host ID
    @GetMapping("/hostId/{hostId}")
    public ResponseEntity<List<Hotel>> getHotelsByHostId(@PathVariable Long hostId) {
        try {
            List<Hotel> hotels = hotelService.getHotelsByHostId(hostId);
            return new ResponseEntity<>(hotels, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET - Get hotel by ID
    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        try {
            Optional<Hotel> hotel = hotelService.getHotelById(id);
            if (hotel.isPresent()) {
                return new ResponseEntity<>(hotel.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // POST - Create new hotel
    @PostMapping
    public ResponseEntity<?> createHotel(@RequestBody Hotel hotel) {
        try {
            // Validate required fields
            if (hotel.getName() == null || hotel.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Hotel name is required"));
            }
            if (hotel.getCity() == null || hotel.getCity().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("City is required"));
            }
            if (hotel.getPrice() == null || hotel.getPrice() <= 0) {
                return ResponseEntity.badRequest().body(createErrorResponse("Valid price is required"));
            }
            if (hotel.getRating() == null || hotel.getRating() < 0 || hotel.getRating() > 5) {
                return ResponseEntity.badRequest().body(createErrorResponse("Rating must be between 0 and 5"));
            }

            Hotel createdHotel = hotelService.createHotel(hotel);
            return new ResponseEntity<>(createdHotel, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to create hotel"));
        }
    }

    // PUT - Update hotel
    @PutMapping("/{id}")
    public ResponseEntity<?> updateHotel(@PathVariable Long id, @RequestBody Hotel hotelDetails) {
        try {
            // Validate required fields
            if (hotelDetails.getName() == null || hotelDetails.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Hotel name is required"));
            }
            if (hotelDetails.getCity() == null || hotelDetails.getCity().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("City is required"));
            }
            if (hotelDetails.getPrice() == null || hotelDetails.getPrice() <= 0) {
                return ResponseEntity.badRequest().body(createErrorResponse("Valid price is required"));
            }
            if (hotelDetails.getRating() == null || hotelDetails.getRating() < 0 || hotelDetails.getRating() > 5) {
                return ResponseEntity.badRequest().body(createErrorResponse("Rating must be between 0 and 5"));
            }

            Hotel updatedHotel = hotelService.updateHotel(id, hotelDetails);
            return new ResponseEntity<>(updatedHotel, HttpStatus.OK);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Hotel not found with id: " + id));
            } else if (e.getMessage().contains("not authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createErrorResponse("Not authorized to update this hotel"));
            }
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to update hotel"));
        }
    }

    // DELETE - Delete hotel
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHotel(@PathVariable Long id) {
        try {
            hotelService.deleteHotel(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Hotel not found with id: " + id));
            } else if (e.getMessage().contains("not authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createErrorResponse("Not authorized to delete this hotel"));
            }
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to delete hotel"));
        }
    }

    // PUT - Update hotel with ownership validation
    @PutMapping("/{id}/host/{hostname}")
    public ResponseEntity<?> updateHotelByHost(@PathVariable Long id, @PathVariable String hostname, @RequestBody Hotel hotelDetails) {
        try {
            Hotel updatedHotel = hotelService.updateHotelByHost(id, hostname, hotelDetails);
            return new ResponseEntity<>(updatedHotel, HttpStatus.OK);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Hotel not found or not owned by host"));
            } else if (e.getMessage().contains("not authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createErrorResponse("Not authorized to update this hotel"));
            }
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to update hotel"));
        }
    }

    // DELETE - Delete hotel with ownership validation
    @DeleteMapping("/{id}/host/{hostname}")
    public ResponseEntity<?> deleteHotelByHost(@PathVariable Long id, @PathVariable String hostname) {
        try {
            hotelService.deleteHotelByHost(id, hostname);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Hotel not found or not owned by host"));
            } else if (e.getMessage().contains("not authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createErrorResponse("Not authorized to delete this hotel"));
            }
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to delete hotel"));
        }
    }

    // Helper method to create error response
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", true);
        errorResponse.put("message", message);
        errorResponse.put("timestamp", System.currentTimeMillis());
        return errorResponse;
    }

    // Test endpoint to verify hotel operations
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testHotelOperations() {
        Map<String, Object> testResponse = new HashMap<>();
        testResponse.put("message", "Hotel API is working");
        testResponse.put("timestamp", System.currentTimeMillis());
        testResponse.put("totalHotels", hotelService.getAllHotels().size());
        testResponse.put("endpoints", List.of(
                "GET /api/hotels - Get all hotels",
                "GET /api/hotels/{id} - Get hotel by ID",
                "POST /api/hotels - Create hotel",
                "PUT /api/hotels/{id} - Update hotel",
                "DELETE /api/hotels/{id} - Delete hotel",
                "GET /api/hotels/host/{hostname} - Get hotels by hostname",
                "PUT /api/hotels/{id}/host/{hostname} - Update hotel by host",
                "DELETE /api/hotels/{id}/host/{hostname} - Delete hotel by host"
        ));
        return ResponseEntity.ok(testResponse);
    }

    // Debug endpoint to test specific hotel operations
    @PostMapping("/debug/test-crud")
    public ResponseEntity<?> testCRUDOperations(@RequestBody Map<String, Object> testData) {
        Map<String, Object> results = new HashMap<>();

        try {
            // Test Create
            Hotel testHotel = new Hotel();
            testHotel.setName("Debug Test Hotel");
            testHotel.setCity("Debug City");
            testHotel.setPrice(999);
            testHotel.setRating(4.0);
            testHotel.setReviews(10);
            testHotel.setImage("https://example.com/test.jpg");
            testHotel.setHostname((String) testData.get("hostname"));

            Hotel created = hotelService.createHotel(testHotel);
            results.put("created", created);

            // Test Update
            created.setName("Debug Test Hotel - Updated");
            created.setPrice(1099);
            Hotel updated = hotelService.updateHotel(created.getId(), created);
            results.put("updated", updated);

            // Test Delete
            hotelService.deleteHotel(created.getId());
            results.put("deleted", true);
            results.put("message", "All CRUD operations successful");

            return ResponseEntity.ok(results);

        } catch (Exception e) {
            results.put("error", e.getMessage());
            results.put("message", "CRUD test failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(results);
        }
    }
}