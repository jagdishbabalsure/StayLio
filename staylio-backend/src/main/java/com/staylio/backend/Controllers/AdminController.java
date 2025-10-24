package com.staylio.backend.Controllers;

import com.staylio.backend.model.Host;
import com.staylio.backend.Service.HostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private HostService hostService;
    
    // Get all pending host applications
    @GetMapping("/hosts/pending")
    public ResponseEntity<List<Host>> getPendingHosts() {
        try {
            List<Host> pendingHosts = hostService.getPendingHosts();
            return ResponseEntity.ok(pendingHosts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get all hosts (approved/rejected/pending)
    @GetMapping("/hosts")
    public ResponseEntity<List<Host>> getAllHosts() {
        try {
            List<Host> hosts = hostService.getAllHosts();
            return ResponseEntity.ok(hosts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Approve host application
    @PutMapping("/hosts/{hostId}/approve")
    public ResponseEntity<Map<String, Object>> approveHost(@PathVariable Long hostId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Host approvedHost = hostService.approveHost(hostId);
            
            response.put("success", true);
            response.put("message", "Host approved successfully");
            response.put("host", approvedHost);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", "Host not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to approve host: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Reject host application
    @PutMapping("/hosts/{hostId}/reject")
    public ResponseEntity<Map<String, Object>> rejectHost(
            @PathVariable Long hostId, 
            @RequestBody RejectRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Host rejectedHost = hostService.rejectHost(hostId, request.getReason());
            
            response.put("success", true);
            response.put("message", "Host rejected successfully");
            response.put("host", rejectedHost);
            response.put("reason", request.getReason());
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", "Host not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to reject host: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Get host by ID
    @GetMapping("/hosts/{hostId}")
    public ResponseEntity<Host> getHostById(@PathVariable Long hostId) {
        try {
            Host host = hostService.getHostById(hostId);
            return ResponseEntity.ok(host);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Request DTO for rejection
    public static class RejectRequest {
        private String reason;
        
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
}