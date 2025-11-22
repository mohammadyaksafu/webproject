package com.sust.hall.controller;

import com.sust.hall.entity.Hall;
import com.sust.hall.enums.HallType;
import com.sust.hall.service.HallService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/halls")
public class HallController {

    private final HallService hallService;

    public HallController(HallService hallService) {
        this.hallService = hallService;
    }

    @GetMapping
    public ResponseEntity<List<Hall>> getAllHalls() {
        return ResponseEntity.ok(hallService.getAllHalls());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Hall>> getActiveHalls() {
        return ResponseEntity.ok(hallService.getActiveHalls());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hall> getHallById(@PathVariable Long id) {
        return hallService.getHallById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{hallCode}")
    public ResponseEntity<Hall> getHallByCode(@PathVariable String hallCode) {
        return hallService.getHallByCode(hallCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{hallName}")
    public ResponseEntity<Hall> getHallByName(@PathVariable String hallName) {
        return hallService.getHallByName(hallName)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Hall>> getHallsByType(@PathVariable HallType type) {
        return ResponseEntity.ok(hallService.getHallsByType(type));
    }

    @GetMapping("/male")
    public ResponseEntity<List<Hall>> getMaleHalls() {
        return ResponseEntity.ok(hallService.getMaleHalls());
    }

    @GetMapping("/female")
    public ResponseEntity<List<Hall>> getFemaleHalls() {
        return ResponseEntity.ok(hallService.getFemaleHalls());
    }

    @PostMapping
    public ResponseEntity<?> createHall(@RequestBody Hall hall) {
        try {
            System.out.println("Received hall: " + hall);
            System.out.println("Hall code: " + hall.getHallCode());
            System.out.println("Hall name: " + hall.getHallName());
            System.out.println("Hall type: " + hall.getType());
            
            Hall createdHall = hallService.createHall(hall);
            return ResponseEntity.ok(createdHall);
        } catch (RuntimeException e) {
            System.out.println("Error creating hall: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHall(@PathVariable Long id, @RequestBody Hall hallDetails) {
        try {
            System.out.println("Updating hall with ID: " + id);
            System.out.println("Update data: " + hallDetails);
            
            Hall updatedHall = hallService.updateHall(id, hallDetails);
            return ResponseEntity.ok(updatedHall);
        } catch (RuntimeException e) {
            System.out.println("Error updating hall: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHall(@PathVariable Long id) {
        try {
            System.out.println("Deleting hall with ID: " + id);
            hallService.deleteHall(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            System.out.println("Error deleting hall: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/occupancy")
    public ResponseEntity<?> updateOccupancy(@PathVariable Long id, @RequestBody OccupancyRequest request) {
        try {
            System.out.println("Updating occupancy for hall ID: " + id + " to: " + request.getOccupancy());
            Hall updatedHall = hallService.updateOccupancy(id, request.getOccupancy());
            return ResponseEntity.ok(updatedHall);
        } catch (RuntimeException e) {
            System.out.println("Error updating occupancy: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/statistics/capacity")
    public ResponseEntity<Integer> getTotalCapacity() {
        return ResponseEntity.ok(hallService.getTotalCapacity());
    }

    @GetMapping("/statistics/occupancy")
    public ResponseEntity<Integer> getTotalOccupancy() {
        return ResponseEntity.ok(hallService.getTotalOccupancy());
    }

    @GetMapping("/statistics/available")
    public ResponseEntity<Integer> getAvailableSeats() {
        return ResponseEntity.ok(hallService.getAvailableSeats());
    }

    @GetMapping("/full-name/{fullName}")
    public ResponseEntity<Hall> getHallByFullName(@PathVariable String fullName) {
        return hallService.getHallByFullName(fullName)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/statistics/summary")
    public ResponseEntity<List<Object[]>> getHallStatistics() {
        return ResponseEntity.ok(hallService.getHallStatistics());
    }

    public static class OccupancyRequest {
        private int occupancy;

        public int getOccupancy() {
            return occupancy;
        }

        public void setOccupancy(int occupancy) {
            this.occupancy = occupancy;
        }
    }
}