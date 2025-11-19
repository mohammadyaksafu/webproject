package com.sust.hall.controller;

import com.sust.hall.dto.*;
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

    // Get complaints by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ComplaintResponseDTO>> getComplaintsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(complaintService.getComplaintsByStatus(status));
    }

    // Get complaints by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ComplaintResponseDTO>> getComplaintsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(complaintService.getComplaintsByCategory(category));
    }

    // Admin/Teacher updates complaint status with response and note
    @PutMapping("/{id}/status")
    public ResponseEntity<ComplaintResponseDTO> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequestDTO updateRequest) {
        return ResponseEntity.ok(complaintService.updateComplaintStatus(id, updateRequest));
    }

    // Add note to complaint
    @PostMapping("/{id}/notes")
    public ResponseEntity<ComplaintResponseDTO> addNote(
            @PathVariable Long id,
            @Valid @RequestBody AddNoteRequestDTO noteRequest) {
        return ResponseEntity.ok(complaintService.addNoteToComplaint(id, noteRequest));
    }

    // Delete complaint
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.noContent().build();
    }
}