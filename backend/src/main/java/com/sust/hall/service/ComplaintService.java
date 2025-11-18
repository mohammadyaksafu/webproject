package com.sust.hall.service;

import com.sust.hall.dto.ComplaintRequestDTO;
import com.sust.hall.dto.ComplaintResponseDTO;

import java.util.List;

public interface ComplaintService {

    ComplaintResponseDTO createComplaint(ComplaintRequestDTO dto);

    ComplaintResponseDTO updateComplaintStatus(Long id, String status, String adminResponse);

    ComplaintResponseDTO getComplaintById(Long id);

    List<ComplaintResponseDTO> getUserComplaints(Long userId);

    List<ComplaintResponseDTO> getAllComplaints();

    void deleteComplaint(Long id);
}
