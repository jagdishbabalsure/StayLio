package com.staylio.backend.Repo;

import com.staylio.backend.model.BookingAttributes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingAttributesRepository extends JpaRepository<BookingAttributes, Long> {
    
    List<BookingAttributes> findByUserId(Long userId);
    
    List<BookingAttributes> findByStatus(BookingAttributes.BookingStatus status);
    
    List<BookingAttributes> findByUserIdAndStatus(Long userId, BookingAttributes.BookingStatus status);
}