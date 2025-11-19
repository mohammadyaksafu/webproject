package com.sust.hall.dto;

import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequestDTO {
    
    @NotNull(message = "Status is required")
    private String status;
    
    private String adminResponse;
    
    private String note; // Optional note for status change
    
    @NotNull(message = "Updated by user ID is required")
    private Long updatedBy;

    // Getters & Setters
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminResponse() { return adminResponse; }
    public void setAdminResponse(String adminResponse) { this.adminResponse = adminResponse; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public Long getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(Long updatedBy) { this.updatedBy = updatedBy; }
}