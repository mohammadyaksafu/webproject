package com.sust.hall.service;

import com.sust.hall.dto.*;
import com.sust.hall.entity.Complaint;
import com.sust.hall.entity.ComplaintNote;
import com.sust.hall.entity.User;
import com.sust.hall.repository.ComplaintRepository;
import com.sust.hall.repository.UserRepository;
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
                .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.getUserId()));

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
    public ComplaintResponseDTO updateComplaintStatus(Long id, StatusUpdateRequestDTO updateRequest) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + id));

        Complaint.Status newStatus = Complaint.Status.valueOf(updateRequest.getStatus().toUpperCase());
        
        // Update status with note
        complaint.updateStatus(newStatus, updateRequest.getUpdatedBy(), updateRequest.getNote());
        
        // Set admin response if provided
        if (updateRequest.getAdminResponse() != null && !updateRequest.getAdminResponse().trim().isEmpty()) {
            complaint.setAdminResponse(updateRequest.getAdminResponse(), updateRequest.getUpdatedBy());
        }

        complaintRepository.save(complaint);
        return mapToDTO(complaint);
    }

    @Override
    public ComplaintResponseDTO addNoteToComplaint(Long complaintId, AddNoteRequestDTO noteRequest) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + complaintId));

        complaint.addNote(noteRequest.getNote(), noteRequest.getAuthorId());
        complaintRepository.save(complaint);
        
        return mapToDTO(complaint);
    }

    @Override
    public ComplaintResponseDTO getComplaintById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + id));
        return mapToDTO(complaint);
    }

    @Override
    public List<ComplaintResponseDTO> getUserComplaints(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        return complaintRepository.findByUser(user)
                .stream().map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ComplaintResponseDTO> getComplaintsByStatus(String status) {
        Complaint.Status complaintStatus = Complaint.Status.valueOf(status.toUpperCase());
        return complaintRepository.findByStatus(complaintStatus)
                .stream().map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ComplaintResponseDTO> getComplaintsByCategory(String category) {
        return complaintRepository.findByCategory(category)
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
        if (!complaintRepository.existsById(id)) {
            throw new RuntimeException("Complaint not found with id: " + id);
        }
        complaintRepository.deleteById(id);
    }

    // ---------- Mapping ----------
    private ComplaintResponseDTO mapToDTO(Complaint complaint) {
        ComplaintResponseDTO dto = new ComplaintResponseDTO();
        dto.setId(complaint.getId());
        dto.setTitle(complaint.getTitle());
        dto.setDescription(complaint.getDescription());
        dto.setCategory(complaint.getCategory());
        dto.setPriority(String.valueOf(complaint.getPriority()));
        dto.setStatus(String.valueOf(complaint.getStatus()));
        dto.setUserId(complaint.getUser().getId());
        dto.setUserName(complaint.getUser().getName()); 
        dto.setAdminResponse(complaint.getAdminResponse());
        dto.setRespondedBy(complaint.getRespondedBy());
        dto.setCreatedAt(complaint.getCreatedAt());
        dto.setUpdatedAt(complaint.getUpdatedAt());
        dto.setResolvedAt(complaint.getResolvedAt());
        
        // Map notes
        if (complaint.getNotes() != null) {
            List<ComplaintNoteDTO> noteDTOs = complaint.getNotes().stream()
                    .map(this::mapNoteToDTO)
                    .collect(Collectors.toList());
            dto.setNotes(noteDTOs);
        }
        
        return dto;
    }

    private ComplaintNoteDTO mapNoteToDTO(ComplaintNote note) {
        ComplaintNoteDTO dto = new ComplaintNoteDTO();
        dto.setId(note.getId());
        dto.setNote(note.getNote());
        dto.setAuthorId(note.getAuthorId());
        // You might want to fetch author name from user repository
        // dto.setAuthorName(getUserNameById(note.getAuthorId()));
        dto.setCreatedAt(note.getCreatedAt());
        return dto;
    }
}