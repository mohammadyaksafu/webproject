package com.sust.hall.dto;

import com.sust.hall.entity.Complaint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class ComplaintDTO {
    
    public static class CreateComplaintRequest {
        @NotBlank(message = "Title is required")
        @Size(max = 200, message = "Title must not exceed 200 characters")
        private String title;

        @NotBlank(message = "Description is required")
        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        private String description;

        @NotBlank(message = "Category is required")
        private String category;

        @NotNull(message = "Priority is required")
        private Complaint.Priority priority;

        // Getters and Setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public Complaint.Priority getPriority() { return priority; }
        public void setPriority(Complaint.Priority priority) { this.priority = priority; }
    }

    public static class UpdateComplaintRequest {
        private String title;
        
        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        private String description;
        
        private String category;
        private Complaint.Priority priority;
        private Complaint.Status status;

        // Getters and Setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public Complaint.Priority getPriority() { return priority; }
        public void setPriority(Complaint.Priority priority) { this.priority = priority; }

        public Complaint.Status getStatus() { return status; }
        public void setStatus(Complaint.Status status) { this.status = status; }
    }

    public static class AdminResponseRequest {
        @NotBlank(message = "Admin response is required")
        @Size(max = 500, message = "Response must not exceed 500 characters")
        private String adminResponse;

        // Getters and Setters
        public String getAdminResponse() { return adminResponse; }
        public void setAdminResponse(String adminResponse) { this.adminResponse = adminResponse; }
    }

    public static class ComplaintResponse {
        private Long id;
        private String title;
        private String description;
        private String category;
        private Complaint.Priority priority;
        private Complaint.Status status;
        private String adminResponse;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private LocalDateTime resolvedAt;
        private Long userId;
        private String userEmail;
        private String userName;
        private String userHall;

        // Constructor from Complaint entity
        public ComplaintResponse(Complaint complaint) {
            this.id = complaint.getId();
            this.title = complaint.getTitle();
            this.description = complaint.getDescription();
            this.category = complaint.getCategory();
            this.priority = complaint.getPriority();
            this.status = complaint.getStatus();
            this.adminResponse = complaint.getAdminResponse();
            this.createdAt = complaint.getCreatedAt();
            this.updatedAt = complaint.getUpdatedAt();
            this.resolvedAt = complaint.getResolvedAt();
            this.userId = complaint.getUser().getId();
            this.userEmail = complaint.getUser().getEmail();
            this.userName = complaint.getUser().getName();
            this.userHall = complaint.getUser().getHallName();
        }

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public Complaint.Priority getPriority() { return priority; }
        public void setPriority(Complaint.Priority priority) { this.priority = priority; }

        public Complaint.Status getStatus() { return status; }
        public void setStatus(Complaint.Status status) { this.status = status; }

        public String getAdminResponse() { return adminResponse; }
        public void setAdminResponse(String adminResponse) { this.adminResponse = adminResponse; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

        public LocalDateTime getResolvedAt() { return resolvedAt; }
        public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getUserEmail() { return userEmail; }
        public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }

        public String getUserHall() { return userHall; }
        public void setUserHall(String userHall) { this.userHall = userHall; }
    }

    public static class ComplaintStatistics {
        private Long totalComplaints;
        private Long openComplaints;
        private Long inProgressComplaints;
        private Long resolvedComplaints;
        private Long closedComplaints;

        // Constructor from query result
        public ComplaintStatistics(Object[] stats) {
            this.totalComplaints = (Long) stats[0];
            this.openComplaints = (Long) stats[1];
            this.inProgressComplaints = (Long) stats[2];
            this.resolvedComplaints = (Long) stats[3];
        }

        // Getters and Setters
        public Long getTotalComplaints() { return totalComplaints; }
        public void setTotalComplaints(Long totalComplaints) { this.totalComplaints = totalComplaints; }

        public Long getOpenComplaints() { return openComplaints; }
        public void setOpenComplaints(Long openComplaints) { this.openComplaints = openComplaints; }

        public Long getInProgressComplaints() { return inProgressComplaints; }
        public void setInProgressComplaints(Long inProgressComplaints) { this.inProgressComplaints = inProgressComplaints; }

        public Long getResolvedComplaints() { return resolvedComplaints; }
        public void setResolvedComplaints(Long resolvedComplaints) { this.resolvedComplaints = resolvedComplaints; }

        public Long getClosedComplaints() { return closedComplaints; }
        public void setClosedComplaints(Long closedComplaints) { this.closedComplaints = closedComplaints; }
    }
}