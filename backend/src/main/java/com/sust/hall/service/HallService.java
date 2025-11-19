package com.sust.hall.service;

import org.springframework.stereotype.Service;
import com.sust.hall.entity.Hall;
import com.sust.hall.enums.HallType;
import com.sust.hall.repository.HallRepository;

import java.util.List;
import java.util.Optional;

@Service
public class HallService {

    private final HallRepository hallRepository;

    public HallService(HallRepository hallRepository) {
        this.hallRepository = hallRepository;
    }

    public List<Hall> getAllHalls() {
        return hallRepository.findAll();
    }

    public List<Hall> getActiveHalls() {
        return hallRepository.findAllActiveHalls();
    }

    public Optional<Hall> getHallById(Long id) {
        return hallRepository.findById(id);
    }

    public Optional<Hall> getHallByCode(String hallCode) {
        return hallRepository.findByHallCode(hallCode);
    }

    public List<Hall> getHallsByType(HallType type) {
        return hallRepository.findByType(type);
    }

    public List<Hall> getMaleHalls() {
        return hallRepository.findMaleHalls();
    }

    public List<Hall> getFemaleHalls() {
        return hallRepository.findFemaleHalls();
    }

    public Hall createHall(Hall hall) {
        // Validate hall code uniqueness
        if (hallRepository.existsByHallCode(hall.getHallCode())) {
            throw new RuntimeException("Hall with code " + hall.getHallCode() + " already exists");
        }

        // Validate hall name uniqueness
        if (hallRepository.existsByHallName(hall.getHallName())) {
            throw new RuntimeException("Hall with name " + hall.getHallName() + " already exists");
        }

        // Set default values if not provided
        if (hall.getCurrentOccupancy() == null) {
            hall.setCurrentOccupancy(0);
        }
        if (hall.getIsActive() == null) {
            hall.setIsActive(true);
        }

        return hallRepository.save(hall);
    }

    public Hall updateHall(Long id, Hall hallDetails) {
        Optional<Hall> optionalHall = hallRepository.findById(id);
        if (optionalHall.isEmpty()) {
            throw new RuntimeException("Hall not found with id: " + id);
        }

        Hall existingHall = optionalHall.get();

        // Check if hall code is being changed and if it's unique
        if (!existingHall.getHallCode().equals(hallDetails.getHallCode()) && 
            hallRepository.existsByHallCode(hallDetails.getHallCode())) {
            throw new RuntimeException("Hall with code " + hallDetails.getHallCode() + " already exists");
        }

        // Check if hall name is being changed and if it's unique
        if (!existingHall.getHallName().equals(hallDetails.getHallName()) && 
            hallRepository.existsByHallName(hallDetails.getHallName())) {
            throw new RuntimeException("Hall with name " + hallDetails.getHallName() + " already exists");
        }

        // Update fields
        existingHall.setHallCode(hallDetails.getHallCode());
        existingHall.setHallName(hallDetails.getHallName());
        existingHall.setFullName(hallDetails.getFullName());
        existingHall.setType(hallDetails.getType());
        existingHall.setCapacity(hallDetails.getCapacity());
        existingHall.setCurrentOccupancy(hallDetails.getCurrentOccupancy());
        existingHall.setProvost(hallDetails.getProvost());
        existingHall.setEmail(hallDetails.getEmail());
        existingHall.setPhone(hallDetails.getPhone());
        existingHall.setOfficeLocation(hallDetails.getOfficeLocation());
        existingHall.setOfficeHours(hallDetails.getOfficeHours());
        existingHall.setDescription(hallDetails.getDescription());
        existingHall.setImageUrl(hallDetails.getImageUrl());
        existingHall.setFacilities(hallDetails.getFacilities());
        existingHall.setIsActive(hallDetails.getIsActive());

        return hallRepository.save(existingHall);
    }

    public void deleteHall(Long id) {
        Optional<Hall> optionalHall = hallRepository.findById(id);
        if (optionalHall.isEmpty()) {
            throw new RuntimeException("Hall not found with id: " + id);
        }
        
        // Soft delete by deactivating the hall
        hallRepository.deactivateHall(id);
    }

    public Hall updateOccupancy(Long id, int occupancy) {
        Optional<Hall> optionalHall = hallRepository.findById(id);
        if (optionalHall.isEmpty()) {
            throw new RuntimeException("Hall not found with id: " + id);
        }

        Hall hall = optionalHall.get();
        
        // Validate occupancy doesn't exceed capacity
        if (occupancy > hall.getCapacity()) {
            throw new RuntimeException("Occupancy cannot exceed capacity. Capacity: " + hall.getCapacity() + ", Requested occupancy: " + occupancy);
        }

        if (occupancy < 0) {
            throw new RuntimeException("Occupancy cannot be negative");
        }

        hallRepository.updateOccupancy(id, occupancy);
        
        // Return updated hall
        return hallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Failed to retrieve updated hall"));
    }

    public int getTotalCapacity() {
        return hallRepository.getTotalCapacity();
    }

    public int getTotalOccupancy() {
        return hallRepository.getTotalOccupancy();
    }

    public int getAvailableSeats() {
        int totalCapacity = getTotalCapacity();
        int totalOccupancy = getTotalOccupancy();
        return totalCapacity - totalOccupancy;
    }

    public List<Object[]> getHallStatistics() {
        return hallRepository.getHallStatistics();
    }
  
    public Hall addHall(Hall hall) {
        return hallRepository.save(hall);
    }

    public Optional<Hall> getHallByName(String hallName) {
    return hallRepository.findByHallName(hallName);
}

public Optional<Hall> getHallByFullName(String fullName) {
    return hallRepository.findByFullName(fullName);
}
}