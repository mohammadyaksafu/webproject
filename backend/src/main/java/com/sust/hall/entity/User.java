package com.sust.hall.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "hall_name", nullable = false)
    private String hallName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
}