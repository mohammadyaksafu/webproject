package com.sust.hall.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ComplaintResponseDTO {

    private Long id;
    private String title;
    private String description;
    private String category;
    private String priority;
    private String status;
    private String adminResponse;
    private Long respondedBy;
    private Long userId;
    private String userName; // Added user name for better response
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private List<ComplaintNoteDTO> notes;

    // ----------- Getters & Setters -------------
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminResponse() { return adminResponse; }
    public void setAdminResponse(String adminResponse) { this.adminResponse = adminResponse; }

    public Long getRespondedBy() { return respondedBy; }
    public void setRespondedBy(Long respondedBy) { this.respondedBy = respondedBy; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public List<ComplaintNoteDTO> getNotes() { return notes; }
    public void setNotes(List<ComplaintNoteDTO> notes) { this.notes = notes; }
}