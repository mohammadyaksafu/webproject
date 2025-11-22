package com.sust.hall.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sust.hall.dto.MealDTO;
import com.sust.hall.enums.MealType;
import com.sust.hall.service.MealService;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/meals")
public class MealController {

    private static final Logger logger = LoggerFactory.getLogger(MealController.class);

    @Autowired
    private MealService mealService;

    // POST - Create a new meal
   @PostMapping
public ResponseEntity<?> createMeal(@Valid @RequestBody MealDTO mealDTO) {
    try {
        logger.info("Creating new meal: {}", mealDTO.getMealName());
        logger.info("Meal data - Hall: {}, Type: {}, Price: {}", 
            mealDTO.getHallName(), mealDTO.getMealType(), mealDTO.getPrice());
        
        MealDTO createdMeal = mealService.createMeal(mealDTO);
        logger.info("Successfully created meal with ID: {}", createdMeal.getId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Meal created successfully");
        response.put("data", createdMeal);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
        
    } catch (EntityNotFoundException e) {
        logger.error("Hall not found for meal creation: {}", mealDTO.getHallName()); // Changed from getHallId()
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        
    } catch (Exception e) {
        logger.error("Error creating meal: {}", mealDTO.getMealName(), e);
        return errorResponse("Error creating meal", e);
    }
}

    // POST - Create multiple meals
    @PostMapping("/batch")
    public ResponseEntity<?> createMeals(@Valid @RequestBody List<MealDTO> mealDTOs) {
        try {
            logger.info("Creating {} meals in batch", mealDTOs.size());
            
            List<MealDTO> createdMeals = mealDTOs.stream()
                .map(mealService::createMeal)
                .collect(java.util.stream.Collectors.toList());
            
            logger.info("Successfully created {} meals", createdMeals.size());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Meals created successfully");
            response.put("data", createdMeals);
            response.put("count", createdMeals.size());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            logger.error("Error creating batch meals", e);
            return errorResponse("Error creating batch meals", e);
        }
    }

    // PUT - Update an existing meal
    @PutMapping("/{id}")
public ResponseEntity<?> updateMeal(@PathVariable Long id, @Valid @RequestBody MealDTO mealDTO) {
    try {
        logger.info("Updating meal with ID: {}", id);
        logger.info("Update data - Hall: {}, Meal: {}", mealDTO.getHallName(), mealDTO.getMealName());
        
        MealDTO updatedMeal = mealService.updateMeal(id, mealDTO);
        logger.info("Successfully updated meal with ID: {}", id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Meal updated successfully");
        response.put("data", updatedMeal);
        
        return ResponseEntity.ok(response);
        
    } catch (EntityNotFoundException e) {
        logger.error("Meal or Hall not found for update - Meal ID: {}, Hall: {}", id, mealDTO.getHallName());
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        
    } catch (Exception e) {
        logger.error("Error updating meal with ID: {}", id, e);
        return errorResponse("Error updating meal", e);
    }
}
    // PUT - Update meal availability
    @PutMapping("/{id}/availability")
    public ResponseEntity<?> updateMealAvailability(@PathVariable Long id, @RequestBody Map<String, Boolean> availabilityMap) {
        try {
            Boolean isAvailable = availabilityMap.get("isAvailable");
            if (isAvailable == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "isAvailable field is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }
            
            logger.info("Updating availability for meal ID: {} to {}", id, isAvailable);
            
            // Create a partial DTO with only the availability field
            MealDTO mealDTO = new MealDTO();
            mealDTO.setIsAvailable(isAvailable);
            
            MealDTO updatedMeal = mealService.updateMeal(id, mealDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Meal availability updated successfully");
            response.put("data", updatedMeal);
            
            return ResponseEntity.ok(response);
            
        } catch (EntityNotFoundException e) {
            logger.error("Meal not found for availability update: {}", id);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            
        } catch (Exception e) {
            logger.error("Error updating meal availability for ID: {}", id, e);
            return errorResponse("Error updating meal availability", e);
        }
    }

    // GET - Get meal by ID (useful for PUT operations)
    @GetMapping("/{id}")
    public ResponseEntity<?> getMealById(@PathVariable Long id) {
        try {
            logger.info("Fetching meal with ID: {}", id);
            
            MealDTO meal = mealService.getMealById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Meal fetched successfully");
            response.put("data", meal);
            
            return ResponseEntity.ok(response);
            
        } catch (EntityNotFoundException e) {
            logger.error("Meal not found: {}", id);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            
        } catch (Exception e) {
            logger.error("Error fetching meal with ID: {}", id, e);
            return errorResponse("Error fetching meal", e);
        }
    }

    // DELETE - Delete a meal
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMeal(@PathVariable Long id) {
        try {
            logger.info("Deleting meal with ID: {}", id);
            
            mealService.deleteMeal(id);
            logger.info("Successfully deleted meal with ID: {}", id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Meal deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (EntityNotFoundException e) {
            logger.error("Meal not found for deletion: {}", id);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            
        } catch (Exception e) {
            logger.error("Error deleting meal with ID: {}", id, e);
            return errorResponse("Error deleting meal", e);
        }
    }

    // Existing methods remain the same...
    @GetMapping("/hall/{hallName}/today")
    public ResponseEntity<?> getTodaysMeals(@PathVariable String hallName) {
        try {
            String decodedHallName = URLDecoder.decode(hallName, StandardCharsets.UTF_8);
            logger.info("Fetching today's meals for hall: {}", decodedHallName);
            
            List<MealDTO> meals = mealService.getTodaysMealsByHallName(decodedHallName);
            logger.info("Successfully found {} meals for hall: {}", meals.size(), decodedHallName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Meals fetched successfully");
            response.put("data", meals);
            response.put("hall", decodedHallName);
            response.put("count", meals.size());
            
            return ResponseEntity.ok(response);
            
        } catch (EntityNotFoundException e) {
            logger.error("Hall not found: {}", hallName);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Hall not found: " + hallName);
            errorResponse.put("data", List.of());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            
        } catch (Exception e) {
            logger.error("Error fetching today's meals for hall: {}", hallName, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Internal server error");
            errorResponse.put("error", e.getMessage());
            errorResponse.put("data", List.of());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/hall/{hallName}")
    public ResponseEntity<?> getMealsByHall(@PathVariable String hallName) {
        try {
            String decodedHallName = URLDecoder.decode(hallName, StandardCharsets.UTF_8);
            logger.info("Fetching all meals for hall: {}", decodedHallName);
            List<MealDTO> meals = mealService.getMealsByHallName(decodedHallName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Meals fetched successfully");
            response.put("data", meals);
            response.put("count", meals.size());
            
            return ResponseEntity.ok(response);
            
        } catch (EntityNotFoundException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Hall not found: " + hallName);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (Exception e) {
            logger.error("Error fetching meals for hall: {}", hallName, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllMeals() {
        try {
            List<MealDTO> meals = mealService.getAllMeals();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", meals);
            response.put("count", meals.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return errorResponse("Error fetching all meals", e);
        }
    }

    private ResponseEntity<Map<String, Object>> errorResponse(String message, Exception e) {
        logger.error(message, e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", message);
        errorResponse.put("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}