package com.staylio.backend.Controllers;

import com.staylio.backend.model.Host;
import com.staylio.backend.Service.HostService;
import com.staylio.backend.Repo.HostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private HostService hostService;
    
    @Autowired
    private HostRepository hostRepository;
    
    // Host Registration
    @PostMapping("/signup-host")
    public ResponseEntity<Map<String, Object>> signupHost(@RequestBody HostSignupRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check if email already exists
            if (hostService.existsByEmail(request.getEmail())) {
                response.put("success", false);
                response.put("message", "An account with this email already exists");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }
            
            // Create new host
            Host host = new Host();
            host.setOwnerName(request.getOwnerName());
            host.setEmail(request.getEmail());
            host.setPhone(request.getPhone());
            host.setPassword(request.getPassword()); // In production, hash this password
            host.setCompanyName(request.getCompanyName());
            host.setBusinessAddress(request.getBusinessAddress());
            host.setKycDocumentUrl(request.getKycDocumentUrl());
            host.setPayoutDetails(request.getPayoutDetails());
            host.setStatus(Host.HostStatus.PENDING_APPROVAL);
            
            Host savedHost = hostService.createHost(host);
            
            response.put("success", true);
            response.put("message", "Your application has been submitted for admin approval. You will be able to log in once approved.");
            response.put("hostId", savedHost.getId());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    // Host Login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Host host = hostRepository.findByEmail(request.getEmail());
            
            if (host == null) {
                response.put("success", false);
                response.put("message", "Invalid email or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            // Check password (in production, use proper password hashing)
            if (!host.getPassword().equals(request.getPassword())) {
                response.put("success", false);
                response.put("message", "Invalid email or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            // Check host status
            switch (host.getStatus()) {
                case APPROVED:
                    response.put("success", true);
                    response.put("message", "Login successful");
                    response.put("user", createUserResponse(host));
                    return ResponseEntity.ok(response);
                    
                case PENDING_APPROVAL:
                    response.put("success", false);
                    response.put("message", "Your application is under review by the admin.");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
                    
                case REJECTED:
                    response.put("success", false);
                    response.put("message", "Your application has been rejected by the admin.");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
                    
                default:
                    response.put("success", false);
                    response.put("message", "Account status unknown");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    private Map<String, Object> createUserResponse(Host host) {
        Map<String, Object> user = new HashMap<>();
        user.put("id", host.getId());
        user.put("name", host.getOwnerName());
        user.put("email", host.getEmail());
        user.put("phone", host.getPhone());
        user.put("companyName", host.getCompanyName());
        user.put("role", "host");
        user.put("status", host.getStatus().toString());
        return user;
    }
    
    // Request DTOs
    public static class HostSignupRequest {
        private String ownerName;
        private String email;
        private String phone;
        private String password;
        private String companyName;
        private String businessAddress;
        private String kycDocumentUrl;
        private String payoutDetails;
        
        // Getters and Setters
        public String getOwnerName() { return ownerName; }
        public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        
        public String getCompanyName() { return companyName; }
        public void setCompanyName(String companyName) { this.companyName = companyName; }
        
        public String getBusinessAddress() { return businessAddress; }
        public void setBusinessAddress(String businessAddress) { this.businessAddress = businessAddress; }
        
        public String getKycDocumentUrl() { return kycDocumentUrl; }
        public void setKycDocumentUrl(String kycDocumentUrl) { this.kycDocumentUrl = kycDocumentUrl; }
        
        public String getPayoutDetails() { return payoutDetails; }
        public void setPayoutDetails(String payoutDetails) { this.payoutDetails = payoutDetails; }
    }
    
    public static class LoginRequest {
        private String email;
        private String password;
        
        // Getters and Setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}