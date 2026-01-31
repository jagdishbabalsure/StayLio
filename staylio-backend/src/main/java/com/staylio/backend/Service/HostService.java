package com.staylio.backend.Service;

import com.staylio.backend.model.Host;
import com.staylio.backend.Repo.HostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class HostService {
    
    @Autowired
    private HostRepository hostRepository;
    
    public List<Host> getAllHosts() {
        return hostRepository.findAll();
    }
    
    public List<Host> getPendingHosts() {
        return hostRepository.findByStatus(Host.HostStatus.PENDING_APPROVAL);
    }
    
    public Host getHostById(Long id) {
        Optional<Host> host = hostRepository.findById(id);
        if (host.isPresent()) {
            return host.get();
        } else {
            throw new RuntimeException("Host not found with id: " + id);
        }
    }
    
    public Host createHost(Host host) {
        // Check if email already exists
        if (hostRepository.existsByEmail(host.getEmail())) {
            throw new RuntimeException("Host with email " + host.getEmail() + " already exists");
        }
        
        // Set default status if not provided
        if (host.getStatus() == null) {
            host.setStatus(Host.HostStatus.PENDING_APPROVAL);
        }
        
        return hostRepository.save(host);
    }
    
    public Host updateHost(Long id, Host hostDetails) {
        Host existingHost = getHostById(id);
        
        // Check if email is being changed and if it already exists
        if (!existingHost.getEmail().equals(hostDetails.getEmail()) && 
            hostRepository.existsByEmail(hostDetails.getEmail())) {
            throw new RuntimeException("Host with email " + hostDetails.getEmail() + " already exists");
        }
        
        existingHost.setOwnerName(hostDetails.getOwnerName());
        existingHost.setEmail(hostDetails.getEmail());
        existingHost.setPhone(hostDetails.getPhone());
        existingHost.setCompanyName(hostDetails.getCompanyName());
        existingHost.setBusinessAddress(hostDetails.getBusinessAddress());
        existingHost.setKycDocumentUrl(hostDetails.getKycDocumentUrl());
        existingHost.setPayoutDetails(hostDetails.getPayoutDetails());
        
        // Only update status if provided
        if (hostDetails.getStatus() != null) {
            existingHost.setStatus(hostDetails.getStatus());
        }
        
        return hostRepository.save(existingHost);
    }
    
    public void deleteHost(Long id) {
        Host host = getHostById(id);
        hostRepository.delete(host);
    }
    
    public Host approveHost(Long id) {
        Host host = getHostById(id);
        host.setStatus(Host.HostStatus.APPROVED);
        return hostRepository.save(host);
    }
    
    public Host rejectHost(Long id, String reason) {
        Host host = getHostById(id);
        host.setStatus(Host.HostStatus.REJECTED);
        // Note: You might want to add a rejection reason field to the Host entity
        // For now, we'll just change the status
        return hostRepository.save(host);
    }
    
    public boolean existsByEmail(String email) {
        return hostRepository.existsByEmail(email);
    }
}