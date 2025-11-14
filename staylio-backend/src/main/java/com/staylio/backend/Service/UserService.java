package com.staylio.backend.Service;

import com.staylio.backend.model.User;
import com.staylio.backend.Repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("User with email " + user.getEmail() + " already exists");
        }
        return userRepository.save(user);
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // Check if email is being changed and if new email already exists
        if (!user.getEmail().equals(userDetails.getEmail()) && 
            userRepository.existsByEmail(userDetails.getEmail())) {
            throw new RuntimeException("User with email " + userDetails.getEmail() + " already exists");
        }
        
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());
        user.setPhone(userDetails.getPhone());
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        userRepository.delete(user);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    // Authentication Methods
    public User registerUser(String firstName, String lastName, String email, String password, String phone) {
        // Check if user already exists
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("User with email " + email + " already exists");
        }
        
        // Validate input
        if (firstName == null || firstName.trim().isEmpty()) {
            throw new RuntimeException("First name is required");
        }
        if (lastName == null || lastName.trim().isEmpty()) {
            throw new RuntimeException("Last name is required");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (password == null || password.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters long");
        }
        if (phone == null || phone.trim().isEmpty()) {
            throw new RuntimeException("Phone number is required");
        }
        
        // Hash password
        String hashedPassword = hashPassword(password);
        
        // Create and save user
        User user = new User(firstName.trim(), lastName.trim(), email.trim().toLowerCase(), hashedPassword, phone.trim());
        user.setName(firstName.trim() + " " + lastName.trim()); // Ensure name field is set
        return userRepository.save(user);
    }
    
    public User authenticateUser(String email, String password) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new RuntimeException("Password is required");
        }
        
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(email.trim().toLowerCase());
        if (!userOptional.isPresent()) {
            throw new RuntimeException("Invalid email or password");
        }
        
        User user = userOptional.get();
        
        // Verify password
        String hashedPassword = hashPassword(password);
        if (!user.getPassword().equals(hashedPassword)) {
            throw new RuntimeException("Invalid email or password");
        }
        
        return user;
    }
    
    public boolean verifyPassword(String email, String password) {
        try {
            authenticateUser(email, password);
            return true;
        } catch (RuntimeException e) {
            return false;
        }
    }
    
    public User changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify old password
        String hashedOldPassword = hashPassword(oldPassword);
        if (!user.getPassword().equals(hashedOldPassword)) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        // Validate new password
        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters long");
        }
        
        // Update password
        user.setPassword(hashPassword(newPassword));
        return userRepository.save(user);
    }
    
    // Password hashing utility
    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = md.digest(password.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hashedBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
}