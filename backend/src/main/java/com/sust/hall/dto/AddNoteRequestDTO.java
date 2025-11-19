package com.sust.hall.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AddNoteRequestDTO {
    
    @NotBlank(message = "Note content is required")
    private String note;
    
    @NotNull(message = "Author ID is required")
    private Long authorId;

    // Getters & Setters
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }
}