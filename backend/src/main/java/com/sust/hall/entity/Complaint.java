package com.sust.hall.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "complaints")
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    @Column(nullable = false, length = 1000)
    private String description;

    @NotBlank(message = "Category is required")
    @Column(nullable = false)
    private String category;

    @NotNull(message = "Priority is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.OPEN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(length = 1000)
    private String adminResponse;

    @Column(name = "responded_by")
    private Long respondedBy; // Admin/Teacher ID who responded

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime resolvedAt;

    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ComplaintNote> notes = new ArrayList<>();

    // Enums
    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }

    public enum Status {
        OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED
    }

    // Constructors
    public Complaint() {
        this.createdAt = LocalDateTime.now();
    }

    public Complaint(String title, String description, String category, Priority priority, User user) {
        this();
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.user = user;
    }

    // Helper methods
    public void addNote(String note, Long authorId) {
        ComplaintNote complaintNote = new ComplaintNote(note, authorId, this);
        this.notes.add(complaintNote);
    }

    public void updateStatus(Status newStatus, Long updatedBy, String note) {
        this.status = newStatus;
        if (note != null && !note.trim().isEmpty()) {
            addNote("Status changed to " + newStatus + ": " + note, updatedBy);
        }
    }

    public void setAdminResponse(String adminResponse, Long respondedBy) {
        this.adminResponse = adminResponse;
        this.respondedBy = respondedBy;
        if (adminResponse != null && !adminResponse.trim().isEmpty()) {
            addNote("Admin response added: " + adminResponse, respondedBy);
        }
    }

    // Pre-update callback
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
        if ((this.status == Status.RESOLVED || this.status == Status.CLOSED) && this.resolvedAt == null) {
            this.resolvedAt = LocalDateTime.now();
        }
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

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getAdminResponse() { return adminResponse; }
    public void setAdminResponse(String adminResponse) { this.adminResponse = adminResponse; }

    public Long getRespondedBy() { return respondedBy; }
    public void setRespondedBy(Long respondedBy) { this.respondedBy = respondedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public List<ComplaintNote> getNotes() { return notes; }
    public void setNotes(List<ComplaintNote> notes) { this.notes = notes; }
}