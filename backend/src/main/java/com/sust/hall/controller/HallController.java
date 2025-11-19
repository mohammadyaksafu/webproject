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
    public ResponseEntity<Hall> createHall(@RequestBody Hall hall) {
        try {
            Hall createdHall = hallService.createHall(hall);
            return ResponseEntity.ok(createdHall);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hall> updateHall(@PathVariable Long id, @RequestBody Hall hallDetails) {
        try {
            Hall updatedHall = hallService.updateHall(id, hallDetails);
            return ResponseEntity.ok(updatedHall);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHall(@PathVariable Long id) {
        try {
            hallService.deleteHall(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/occupancy")
    public ResponseEntity<Hall> updateOccupancy(@PathVariable Long id, @RequestBody OccupancyRequest request) {
        try {
            Hall updatedHall = hallService.updateOccupancy(id, request.getOccupancy());
            return ResponseEntity.ok(updatedHall);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
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