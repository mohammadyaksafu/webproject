package com.sust.hall.repository;

import com.sust.hall.entity.Complaint;
import com.sust.hall.entity.Complaint.Status;
import com.sust.hall.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByUser(User user);

    List<Complaint> findByStatus(Status status);

    List<Complaint> findByCategory(String category);
}
