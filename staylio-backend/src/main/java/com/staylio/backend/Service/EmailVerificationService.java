package com.staylio.backend.Service;

import com.staylio.backend.model.EmailVerification;
import com.staylio.backend.Repo.EmailVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class EmailVerificationService {

    @Autowired
    private EmailVerificationRepository emailVerificationRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public void generateAndSendSignupOtp(String email) {
        String normalizedEmail = email.trim().toLowerCase();

        // Check if there's an existing OTP entry, update it or create new
        Optional<EmailVerification> existing = emailVerificationRepository.findByEmail(normalizedEmail);

        String otp = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);

        if (existing.isPresent()) {
            EmailVerification ev = existing.get();
            ev.setOtp(otp);
            ev.setExpiry(expiry);
            emailVerificationRepository.save(ev);
        } else {
            EmailVerification ev = new EmailVerification(normalizedEmail, otp, expiry);
            emailVerificationRepository.save(ev);
        }

        try {
            emailService.sendEmailVerificationOtp(normalizedEmail, otp);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }

    public boolean verifyOtp(String email, String otp) {
        String normalizedEmail = email.trim().toLowerCase();
        Optional<EmailVerification> entry = emailVerificationRepository.findByEmail(normalizedEmail);

        if (!entry.isPresent()) {
            return false;
        }

        EmailVerification ev = entry.get();
        if (LocalDateTime.now().isAfter(ev.getExpiry())) {
            return false;
        }

        return ev.getOtp().equals(otp);
    }

    @Transactional
    public void deleteVerification(String email) {
        emailVerificationRepository.deleteByEmail(email.trim().toLowerCase());
    }
}
