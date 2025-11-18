package com.sust.hall.service;

import com.sust.hall.dto.ComplaintRequestDTO;
import com.sust.hall.dto.ComplaintResponseDTO;
import com.sust.hall.entity.Complaint;
import com.sust.hall.entity.User;
import com.sust.hall.repository.ComplaintRepository;
import com.sust.hall.repository.UserRepository;
import com.sust.hall.service.ComplaintService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public ComplaintServiceImpl(ComplaintRepository complaintRepository,
                                UserRepository userRepository) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ComplaintResponseDTO createComplaint(ComplaintRequestDTO dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = new Complaint(
                dto.getTitle(),
                dto.getDescription(),
                dto.getCategory(),
                Complaint.Priority.valueOf(dto.getPriority().toUpperCase()),
                user
        );

        complaintRepository.save(complaint);

        return mapToDTO(complaint);
    }

    @Override
    public ComplaintResponseDTO updateComplaintStatus(Long id, String status, String adminResponse) {

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(Complaint.Status.valueOf(status.toUpperCase()));
        complaint.setAdminResponse(adminResponse);

        return mapToDTO(complaintRepository.save(complaint));
    }

    @Override
    public ComplaintResponseDTO getComplaintById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
        return mapToDTO(complaint);
    }

    @Override
    public List<ComplaintResponseDTO> getUserComplaints(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return complaintRepository.findByUser(user)
                .stream().map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ComplaintResponseDTO> getAllComplaints() {
        return complaintRepository.findAll()
                .stream().map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteComplaint(Long id) {
        complaintRepository.deleteById(id);
    }

    // ---------- Mapping ----------
    private ComplaintResponseDTO mapToDTO(Complaint c) {
        ComplaintResponseDTO dto = new ComplaintResponseDTO();
        dto.setId(c.getId());
        dto.setTitle(c.getTitle());
        dto.setDescription(c.getDescription());
        dto.setCategory(c.getCategory());
        dto.setPriority(String.valueOf(c.getPriority()));
        dto.setStatus(String.valueOf(c.getStatus()));
        dto.setUserId(c.getUser().getId());
        dto.setAdminResponse(c.getAdminResponse());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        dto.setResolvedAt(c.getResolvedAt());
        return dto;
    }
}
