package com.sust.hall.repository;

import com.sust.hall.entity.Complaint;
import com.sust.hall.entity.Complaint.Status;
import com.sust.hall.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByUser(User user);

    List<Complaint> findByStatus(Status status);

    List<Complaint> findByCategory(String category);

    List<Complaint> findByCategoryAndStatus(String category, Status status);

    @Query("SELECT c FROM Complaint c WHERE c.priority = :priority ORDER BY c.createdAt DESC")
    List<Complaint> findByPriorityOrderByCreatedAtDesc(@Param("priority") Complaint.Priority priority);

    List<Complaint> findByUserId(Long userId);
}