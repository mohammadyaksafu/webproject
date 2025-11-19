package com.sust.hall.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sust.hall.dto.MealDTO;
import com.sust.hall.enums.MealType;
import com.sust.hall.service.MealService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/meals")

public class MealController {

    private static final Logger logger = LoggerFactory.getLogger(MealController.class);

    @Autowired
    private MealService mealService;

    // Get all meals
    @GetMapping
    public ResponseEntity<List<MealDTO>> getAllMeals() {
        try {
            logger.info("Fetching all meals");
            List<MealDTO> meals = mealService.getAllMeals();
            logger.info("Found {} meals", meals.size());
            return ResponseEntity.ok(meals);
        } catch (Exception e) {
            logger.error("Error fetching all meals", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get meals by hall ID
    @GetMapping("/hall/{hallId}")
    public ResponseEntity<List<MealDTO>> getMealsByHall(@PathVariable Long hallId) {
        try {
            logger.info("Fetching meals for hall: {}", hallId);
            List<MealDTO> meals = mealService.getMealsByHallId(hallId);
            logger.info("Found {} meals for hall {}", meals.size(), hallId);
            return ResponseEntity.ok(meals);
        } catch (EntityNotFoundException e) {
            logger.error("Hall not found: {}", hallId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            logger.error("Error fetching meals for hall: {}", hallId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get meals by hall and type
    @GetMapping("/hall/{hallId}/type/{mealType}")
    public ResponseEntity<List<MealDTO>> getMealsByHallAndType(
            @PathVariable Long hallId,
            @PathVariable MealType mealType) {
        try {
            logger.info("Fetching {} meals for hall: {}", mealType, hallId);
            List<MealDTO> meals = mealService.getMealsByHallAndType(hallId, mealType);
            return ResponseEntity.ok(meals);
        } catch (Exception e) {
            logger.error("Error fetching meals", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get today's meals
    @GetMapping("/hall/{hallId}/today")
    public ResponseEntity<List<MealDTO>> getTodaysMeals(@PathVariable Long hallId) {
        try {
            logger.info("Fetching today's meals for hall: {}", hallId);
            List<MealDTO> meals = mealService.getTodaysMeals(hallId);
            return ResponseEntity.ok(meals);
        } catch (Exception e) {
            logger.error("Error fetching today's meals", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get available meals
    @GetMapping("/available")
    public ResponseEntity<List<MealDTO>> getAvailableMeals() {
        try {
            logger.info("Fetching available meals");
            List<MealDTO> meals = mealService.getAvailableMeals();
            return ResponseEntity.ok(meals);
        } catch (Exception e) {
            logger.error("Error fetching available meals", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get available meals by hall
    @GetMapping("/hall/{hallId}/available")
    public ResponseEntity<List<MealDTO>> getAvailableMealsByHall(@PathVariable Long hallId) {
        try {
            List<MealDTO> meals = mealService.getAvailableMealsByHall(hallId);
            return ResponseEntity.ok(meals);
        } catch (Exception e) {
            logger.error("Error fetching available meals", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get meal by ID
    @GetMapping("/{id}")
    public ResponseEntity<MealDTO> getMealById(@PathVariable Long id) {
        try {
            MealDTO meal = mealService.getMealById(id);
            return ResponseEntity.ok(meal);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            logger.error("Error fetching meal", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Create meal
    @PostMapping
    public ResponseEntity<MealDTO> createMeal(@RequestBody MealDTO mealDTO) {
        try {
            logger.info("Creating meal: {}", mealDTO.getMealName());
            MealDTO createdMeal = mealService.createMeal(mealDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdMeal);
        } catch (EntityNotFoundException e) {
            logger.error("Error creating meal - Hall not found");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            logger.error("Error creating meal", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Update meal
    @PutMapping("/{id}")
    public ResponseEntity<MealDTO> updateMeal(
            @PathVariable Long id,
            @RequestBody MealDTO mealDTO) {
        try {
            logger.info("Updating meal: {}", id);
            MealDTO updatedMeal = mealService.updateMeal(id, mealDTO);
            return ResponseEntity.ok(updatedMeal);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            logger.error("Error updating meal", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Delete meal
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteMeal(@PathVariable Long id) {
        try {
            logger.info("Deleting meal: {}", id);
            mealService.deleteMeal(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Meal deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            logger.error("Error deleting meal", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}