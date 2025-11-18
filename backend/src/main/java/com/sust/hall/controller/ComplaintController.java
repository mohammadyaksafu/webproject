package com.sust.hall.controller;

import com.sust.hall.dto.ComplaintRequestDTO;
import com.sust.hall.dto.ComplaintResponseDTO;
import com.sust.hall.service.ComplaintService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    // Create complaint
    @PostMapping
    public ResponseEntity<ComplaintResponseDTO> createComplaint(
            @Valid @RequestBody ComplaintRequestDTO dto) {
        return ResponseEntity.ok(complaintService.createComplaint(dto));
    }

    // Get complaint by ID
    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponseDTO> getComplaint(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }

    // Get all complaints
    @GetMapping
    public ResponseEntity<List<ComplaintResponseDTO>> getAll() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    // Get complaints for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ComplaintResponseDTO>> getUserComplaints(@PathVariable Long userId) {
        return ResponseEntity.ok(complaintService.getUserComplaints(userId));
    }

    // Admin updates complaint status
    @PutMapping("/{id}/status")
    public ResponseEntity<ComplaintResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String adminResponse) {

        return ResponseEntity.ok(
                complaintService.updateComplaintStatus(id, status, adminResponse));
    }

    // Delete complaint
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.noContent().build();
    }
}
