package com.sust.hall.service;

import com.sust.hall.dto.*;

import java.util.List;

public interface ComplaintService {
    ComplaintResponseDTO createComplaint(ComplaintRequestDTO dto);
    ComplaintResponseDTO updateComplaintStatus(Long id, StatusUpdateRequestDTO updateRequest);
    ComplaintResponseDTO addNoteToComplaint(Long complaintId, AddNoteRequestDTO noteRequest);
    ComplaintResponseDTO getComplaintById(Long id);
    List<ComplaintResponseDTO> getUserComplaints(Long userId);
    List<ComplaintResponseDTO> getComplaintsByStatus(String status);
    List<ComplaintResponseDTO> getComplaintsByCategory(String category);
    List<ComplaintResponseDTO> getAllComplaints();
    void deleteComplaint(Long id);
}