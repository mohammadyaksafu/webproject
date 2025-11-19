package com.sust.hall.controller;

import com.sust.hall.entity.User;
import com.sust.hall.enums.AccountStatus;
import com.sust.hall.enums.UserRole;
import com.sust.hall.service.UserService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@Slf4j
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    
    @GetMapping("/pending-users")
    public ResponseEntity<List<User>> getPendingUsers() {
        return ResponseEntity.ok(userService.getPendingUsers());
    }

    
    @GetMapping("/users/status/{status}")
    public ResponseEntity<List<User>> getUsersByStatus(@PathVariable AccountStatus status) {
        return ResponseEntity.ok(userService.getUsersByStatus(status));
    }

   
    @PostMapping("/users/{id}/approve")
    public ResponseEntity<User> approveUser(@PathVariable Long id) {
        log.info("/approve was hit");
        return ResponseEntity.ok(userService.approveUser(id));
    }

    
    @PostMapping("/users/{id}/reject")
    public ResponseEntity<User> rejectUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.rejectUser(id));
    }

    
    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestBody UserRoleUpdateRequest request) {
        return ResponseEntity.ok(userService.updateUserRole(id, request.getRole()));
    }

    
    @PostMapping("/users/{id}/suspend")
    public ResponseEntity<User> suspendUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.suspendUser(id));
    }

   
    @PostMapping("/users/{id}/activate")
    public ResponseEntity<User> activateUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.activateUser(id));
    }

    
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    
    public static class UserRoleUpdateRequest {
        private UserRole role;

        public UserRole getRole() {
            return role;
        }

        public void setRole(UserRole role) {
            this.role = role;
        }
    }
}