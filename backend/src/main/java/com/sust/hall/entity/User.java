package com.sust.hall.entity;

import com.sust.hall.enums.UserRole;
import com.sust.hall.enums.AccountStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

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

    @Column(name = "hall_name")
    private String hallName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status", nullable = false)
    private AccountStatus accountStatus;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Default constructor
    public User() {
        this.createdAt = LocalDateTime.now();
        this.accountStatus = AccountStatus.PENDING; // Default status
    }

    // Constructor without id and createdAt
    public User(String name, String email, String hallName, UserRole role, String password,
            AccountStatus accountStatus) {
        this();
        this.name = name;
        this.email = email;
        this.hallName = hallName;
        this.role = role;
        this.password = password;
        this.accountStatus = accountStatus;
    }

    // Getters and Setters (same as before)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public AccountStatus getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(AccountStatus accountStatus) {
        this.accountStatus = accountStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // equals, hashCode, toString, and business methods (same as before)
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        User user = (User) o;
        return Objects.equals(id, user.id) && Objects.equals(email, user.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email);
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", hallName='" + hallName + '\'' +
                ", role=" + role +
                ", accountStatus=" + accountStatus +
                ", createdAt=" + createdAt +
                '}';
    }

    public boolean isApproved() {
        return AccountStatus.APPROVED.equals(accountStatus);
    }

    public boolean isPending() {
        return AccountStatus.PENDING.equals(accountStatus);
    }

    public boolean isRejected() {
        return AccountStatus.REJECTED.equals(accountStatus);
    }

    public boolean isSuspended() {
        return AccountStatus.SUSPENDED.equals(accountStatus);
    }

    public boolean hasRole(UserRole checkRole) {
        return this.role.equals(checkRole);
    }

    public boolean belongsToHall(String hallName) {
        return this.hallName != null && this.hallName.equals(hallName);
    }

    public String getHallName() {
        return hallName;
    }

    public void setHallName(String hallName) {
        this.hallName = hallName;
    }
}
