package com.sust.hall.service;

import com.sust.hall.dto.LoginRequest;
import com.sust.hall.dto.RegisterRequest;
import com.sust.hall.dto.Response;
import com.sust.hall.entity.User;
import com.sust.hall.enums.AccountStatus;
import com.sust.hall.enums.UserRole;
import com.sust.hall.exeptions.BadRequestException;
import com.sust.hall.repository.UserRepository;
import com.sust.hall.security.JwtUtils;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.sust.hall.exeptions.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtUtils jwtUtils;

    // public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    //     this.userRepository = userRepository;
    //     this.passwordEncoder = passwordEncoder;
    // }

    public Response<?> registerUser(RegisterRequest registerRequest) {

        log.info(registerRequest.toString());
       
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email already registered: " + registerRequest.getEmail());
        }

        
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        
        if (!registerRequest.getEmail().endsWith("sust.edu")) {
            throw new BadRequestException("Only SUST email addresses are allowed");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setHallName(registerRequest.getHallName());
        user.setRole(UserRole.STUDENT);
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setAccountStatus(AccountStatus.PENDING); 
        User savedUser = userRepository.save(user);

        return Response.builder()
                    .statusCode(HttpStatus.CREATED.value())
                    .message("user created successfully.")
                    .data(savedUser)
                    .build();
    }

    public Response<?> login(LoginRequest loginRequest) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        User user = userRepository.findByEmail(loginRequest.getEmail())
             .orElseThrow(() -> new NotFoundException("User not found with email: " + loginRequest.getEmail()));
        if (user == null) {
            throw new NotFoundException("User not found with email: " + loginRequest.getEmail());
        }

        // Generate JWT token
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Login successful")
                .token(token)
                .data(user)
                .build();
    }

    
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists: " + user.getEmail());
        }
        
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User existingUser = getUserById(id);
        existingUser.setName(userDetails.getName());
        existingUser.setEmail(userDetails.getEmail());
        existingUser.setHallName(userDetails.getHallName());
        existingUser.setRole(userDetails.getRole());

        // Update password only if provided
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        return userRepository.save(existingUser);
    }

    
    public List<User> getAllUsers() {
        return userRepository.findAllUsers();
    }

    public User getUserById(Long id) {
        return userRepository.findUserById(id);
    }

    public List<User> getUsersByHall(String hallName) {
        return userRepository.findUsersByHall(hallName);
    }

    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findUsersByRole(role);
    }

    public void deleteUser(Long id) {
        userRepository.deleteUser(id);
    }

    public List<String> getAllHallNames() {
        return userRepository.findAllHallNames();
    }

    public Integer getUsersCountByHall(String hallName) {
        return userRepository.countUsersByHall(hallName);
    }

    public List<Object[]> getUserStatistics() {
        return userRepository.getUserStatisticsByHall();
    }

    public List<User> getPendingUsers() {
        return userRepository.findPendingUsers();
    }

    public List<User> getUsersByStatus(AccountStatus status) {
        return userRepository.findUsersByAccountStatus(status);
    }

    public User approveUser(Long id) {
        userRepository.updateUserStatus(id, AccountStatus.APPROVED);
        return getUserById(id);
    }

    public User rejectUser(Long id) {
        userRepository.updateUserStatus(id, AccountStatus.REJECTED);
        return getUserById(id);
    }

    public User updateUserRole(Long id, UserRole role) {
        userRepository.updateUserRole(id, role);
        return getUserById(id);
    }

    public User suspendUser(Long id) {
        userRepository.updateUserStatus(id, AccountStatus.SUSPENDED);
        return getUserById(id);
    }

    public User activateUser(Long id) {
        userRepository.updateUserStatus(id, AccountStatus.APPROVED);
        return getUserById(id);
    }

}