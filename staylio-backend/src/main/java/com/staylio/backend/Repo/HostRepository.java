package com.staylio.backend.Repo;

import com.staylio.backend.model.Host;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HostRepository extends JpaRepository<Host, Long> {
    
    List<Host> findByStatus(Host.HostStatus status);
    
    boolean existsByEmail(String email);
    
    Host findByEmail(String email);
}