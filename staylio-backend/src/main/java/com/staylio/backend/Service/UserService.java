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

    @Autowired
    private EmailService emailService;

    @Autowired
    private EmailVerificationService emailVerificationService;

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
    public User registerUser(String firstName, String lastName, String email, String password, String phone,
            String otp) {
        // Check if user already exists
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("User with email " + email + " already exists");
        }

        // Validate OTP if provided
        boolean emailVerified = false;
        // Validate OTP
        if (otp == null || otp.trim().isEmpty()) {
            throw new RuntimeException("Email verification is required");
        }

        if (emailVerificationService.verifyOtp(email, otp)) {
            emailVerified = true;
            // Delete verification record after successful use
            emailVerificationService.deleteVerification(email);
        } else {
            throw new RuntimeException("Invalid or expired email verification code");
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
        User user = new User(firstName.trim(), lastName.trim(), email.trim().toLowerCase(), hashedPassword,
                phone.trim());

        user.setName(firstName.trim() + " " + lastName.trim()); // Ensure name field is set
        user.setEmailVerified(emailVerified);

        User savedUser = userRepository.save(user);

        // Send welcome email asynchronously (don't fail registration if email fails)
        try {
            emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFirstName(), savedUser.getLastName());
        } catch (Exception e) {
            // Log the error but don't fail the registration
            System.err.println("Failed to send welcome email to " + savedUser.getEmail() + ": " + e.getMessage());
        }

        return savedUser;
    }

    // Overload for backward compatibility if needed, or just update callers
    public User registerUser(String firstName, String lastName, String email, String password, String phone) {
        // Default behavior: no OTP provided, email not verified
        return registerUser(firstName, lastName, email, password, phone, null);
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

    // Password Reset Methods
    public void generatePasswordResetOtp(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Generate 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));

        user.setResetPasswordOtp(otp);
        user.setResetPasswordOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        // Send OTP email
        try {
            emailService.sendPasswordResetOtp(user.getEmail(), otp);
        } catch (Exception e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
        }
    }

    public boolean verifyPasswordResetOtp(String email, String otp) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getResetPasswordOtp() == null || user.getResetPasswordOtpExpiry() == null) {
            return false;
        }

        if (java.time.LocalDateTime.now().isAfter(user.getResetPasswordOtpExpiry())) {
            return false;
        }

        return user.getResetPasswordOtp().equals(otp);
    }

    public void resetPasswordWithOtp(String email, String otp, String newPassword) {
        if (!verifyPasswordResetOtp(email, otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters long");
        }

        user.setPassword(hashPassword(newPassword));
        user.setResetPasswordOtp(null);
        user.setResetPasswordOtpExpiry(null);
        userRepository.save(user);
    }

    // Email Verification Methods
    public void generateEmailVerificationOtp(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (user.isEmailVerified()) {
            // Optional: throw exception or just resend?
            // Requirement says "Resend OTP ... Allow resend only after 30-60 secs".
            // For now, standard generation.
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));

        user.setEmailOtp(otp);
        user.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        // Send OTP email
        try {
            emailService.sendEmailVerificationOtp(user.getEmail(), otp);
        } catch (Exception e) {
            System.err.println("Failed to send verification OTP email: " + e.getMessage());
        }
    }

    public boolean verifyEmailVerificationOtp(String email, String otp) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getEmailOtp() == null || user.getOtpExpiry() == null) {
            return false;
        }

        if (java.time.LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            return false; // Expired
        }

        if (user.getEmailOtp().equals(otp)) {
            user.setEmailVerified(true);
            user.setEmailOtp(null);
            user.setOtpExpiry(null);
            userRepository.save(user);
            return true;
        }

        return false;
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