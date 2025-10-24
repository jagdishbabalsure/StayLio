package com.staylio.backend.Service;

import com.staylio.backend.model.Admin;
import com.staylio.backend.Repo.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AdminService {
    
    @Autowired
    private AdminRepository adminRepository;
    
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }
    
    public Admin getAdminById(Long id) {
        Optional<Admin> admin = adminRepository.findById(id);
        if (admin.isPresent()) {
            return admin.get();
        } else {
            throw new RuntimeException("Admin not found with id: " + id);
        }
    }
    
    public Admin createAdmin(Admin admin) {
        // Check if email already exists
        if (adminRepository.existsByEmail(admin.getEmail())) {
            throw new RuntimeException("Admin with email " + admin.getEmail() + " already exists");
        }
        
        return adminRepository.save(admin);
    }
    
    public Admin updateAdmin(Long id, Admin adminDetails) {
        Admin existingAdmin = getAdminById(id);
        
        // Check if email is being changed and if it already exists
        if (!existingAdmin.getEmail().equals(adminDetails.getEmail()) && 
            adminRepository.existsByEmail(adminDetails.getEmail())) {
            throw new RuntimeException("Admin with email " + adminDetails.getEmail() + " already exists");
        }
        
        existingAdmin.setName(adminDetails.getName());
        existingAdmin.setEmail(adminDetails.getEmail());
        existingAdmin.setPhone(adminDetails.getPhone());
        
        return adminRepository.save(existingAdmin);
    }
    
    public void deleteAdmin(Long id) {
        Admin admin = getAdminById(id);
        adminRepository.delete(admin);
    }
    
    public boolean existsByEmail(String email) {
        return adminRepository.existsByEmail(email);
    }
}