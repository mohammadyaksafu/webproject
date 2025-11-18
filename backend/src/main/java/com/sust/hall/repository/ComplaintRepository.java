package com.sust.hall.repository;

import com.sust.hall.entity.Complaint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    
   
    List<Complaint> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    
    Page<Complaint> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    
    List<Complaint> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, Complaint.Status status);
    
    
    List<Complaint> findByUserIdAndPriorityOrderByCreatedAtDesc(Long userId, Complaint.Priority priority);
    
    
    List<Complaint> findByUserIdAndCategoryOrderByCreatedAtDesc(Long userId, String category);
    
    
    @Query("SELECT c FROM Complaint c WHERE c.user.id = :userId AND " +
           "(LOWER(c.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY c.createdAt DESC")
    List<Complaint> searchByUserAndKeyword(@Param("userId") Long userId, @Param("searchTerm") String searchTerm);
    
    
    @Query("SELECT c.status, COUNT(c) FROM Complaint c WHERE c.user.id = :userId GROUP BY c.status")
    List<Object[]> countByStatusForUser(@Param("userId") Long userId);
    
    
    Page<Complaint> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    
    Page<Complaint> findByStatusOrderByCreatedAtDesc(Complaint.Status status, Pageable pageable);
    
   
    Page<Complaint> findByPriorityOrderByCreatedAtDesc(Complaint.Priority priority, Pageable pageable);
    
   
    @Query("SELECT COUNT(c), " +
           "SUM(CASE WHEN c.status = 'OPEN' THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN c.status = 'IN_PROGRESS' THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN c.status = 'RESOLVED' THEN 1 ELSE 0 END) " +
           "FROM Complaint c")
    Object[] getComplaintStatistics();
}