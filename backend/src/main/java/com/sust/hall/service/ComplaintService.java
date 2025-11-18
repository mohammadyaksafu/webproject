package com.sust.hall.service;

import com.sust.hall.dto.ComplaintDTO;
import com.sust.hall.entity.Complaint;
import com.sust.hall.repository.ComplaintRepository;
import com.sust.hall.entity.User;
import com.sust.hall.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    // User methods
    public ComplaintDTO.ComplaintResponse createComplaint(Long userId, ComplaintDTO.CreateComplaintRequest request) {
        //
         User user = userRepository.findUserById(userId);
        //         .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Complaint complaint = new Complaint(
                request.getTitle(),
                request.getDescription(),
                request.getCategory(),
                request.getPriority(),
                user
        );

        Complaint savedComplaint = complaintRepository.save(complaint);
        return new ComplaintDTO.ComplaintResponse(savedComplaint);
    }

    public List<ComplaintDTO.ComplaintResponse> getUserComplaints(Long userId) {
        List<Complaint> complaints = complaintRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return complaints.stream()
                .map(ComplaintDTO.ComplaintResponse::new)
                .collect(Collectors.toList());
    }

    public Optional<ComplaintDTO.ComplaintResponse> getUserComplaint(Long userId, Long complaintId) {
        return complaintRepository.findById(complaintId)
                .filter(complaint -> complaint.getUser().getId().equals(userId))
                .map(ComplaintDTO.ComplaintResponse::new);
    }

    public ComplaintDTO.ComplaintResponse updateUserComplaint(Long userId, Long complaintId, ComplaintDTO.UpdateComplaintRequest request) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .filter(c -> c.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Complaint not found or access denied"));

        // Only allow updates if complaint is still open
        if (complaint.getStatus() != Complaint.Status.OPEN) {
            throw new RuntimeException("Cannot update complaint that is not in OPEN status");
        }

        if (request.getTitle() != null) complaint.setTitle(request.getTitle());
        if (request.getDescription() != null) complaint.setDescription(request.getDescription());
        if (request.getCategory() != null) complaint.setCategory(request.getCategory());
        if (request.getPriority() != null) complaint.setPriority(request.getPriority());

        Complaint updatedComplaint = complaintRepository.save(complaint);
        return new ComplaintDTO.ComplaintResponse(updatedComplaint);
    }

    public void deleteUserComplaint(Long userId, Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .filter(c -> c.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Complaint not found or access denied"));

        complaintRepository.delete(complaint);
    }

    // Admin methods
    public Page<ComplaintDTO.ComplaintResponse> getAllComplaints(Pageable pageable) {
        return complaintRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(ComplaintDTO.ComplaintResponse::new);
    }

    public ComplaintDTO.ComplaintResponse updateComplaintStatus(Long complaintId, Complaint.Status status) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + complaintId));

        complaint.setStatus(status);
        Complaint updatedComplaint = complaintRepository.save(complaint);
        return new ComplaintDTO.ComplaintResponse(updatedComplaint);
    }

    public ComplaintDTO.ComplaintResponse addAdminResponse(Long complaintId, String adminResponse) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + complaintId));

        complaint.setAdminResponse(adminResponse);
        if (complaint.getStatus() == Complaint.Status.OPEN) {
            complaint.setStatus(Complaint.Status.IN_PROGRESS);
        }

        Complaint updatedComplaint = complaintRepository.save(complaint);
        return new ComplaintDTO.ComplaintResponse(updatedComplaint);
    }

    public ComplaintDTO.ComplaintStatistics getComplaintStatistics() {
        Object[] stats = complaintRepository.getComplaintStatistics();
        return new ComplaintDTO.ComplaintStatistics(stats);
    }

    // Search and filter methods
    public List<ComplaintDTO.ComplaintResponse> searchUserComplaints(Long userId, String searchTerm) {
        List<Complaint> complaints = complaintRepository.searchByUserAndKeyword(userId, searchTerm);
        return complaints.stream()
                .map(ComplaintDTO.ComplaintResponse::new)
                .collect(Collectors.toList());
    }

    public List<ComplaintDTO.ComplaintResponse> getUserComplaintsByStatus(Long userId, Complaint.Status status) {
        List<Complaint> complaints = complaintRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status);
        return complaints.stream()
                .map(ComplaintDTO.ComplaintResponse::new)
                .collect(Collectors.toList());
    }

    public List<ComplaintDTO.ComplaintResponse> getUserComplaintsByPriority(Long userId, Complaint.Priority priority) {
        List<Complaint> complaints = complaintRepository.findByUserIdAndPriorityOrderByCreatedAtDesc(userId, priority);
        return complaints.stream()
                .map(ComplaintDTO.ComplaintResponse::new)
                .collect(Collectors.toList());
    }
}