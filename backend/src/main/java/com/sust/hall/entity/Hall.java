package com.sust.hall.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import com.sust.hall.enums.HallType;

@Data
@Entity
@Table(name = "halls")
public class Hall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hall_code", nullable = false, unique = true)
    private String hallCode; 

    @Column(name = "hall_name", nullable = false, unique = true)
    private String hallName; 

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HallType type; 
    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private Integer currentOccupancy = 0;

    @Column(nullable = false)
    private String provost;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(name = "office_location", nullable = false)
    private String officeLocation;

    @Column(name = "office_hours", nullable = false)
    private String officeHours;

    @Column(length = 1000)
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "facilities", length = 1000)
    private String facilities; 
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    @Column(name = "hall_short_name")
    private String hallShortName;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
     

    
    public String getHallShortName() {
        return hallShortName;
    }

    public void setHallShortName(String hallShortName) {
        this.hallShortName = hallShortName;
    }
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}