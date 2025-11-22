package com.sust.hall.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sust.hall.dto.MealDTO;
import com.sust.hall.entity.Meal;
import com.sust.hall.entity.Hall;
import com.sust.hall.enums.MealType;
import com.sust.hall.repository.MealRepository;
import com.sust.hall.repository.HallRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Optional;

@Service
@Transactional
public class MealService {

    private static final Logger logger = LoggerFactory.getLogger(MealService.class); // ADD THIS LINE

    @Autowired
    private MealRepository mealRepository;

    @Autowired
    private HallRepository hallRepository;

    // Get all meals
    public List<MealDTO> getAllMeals() {
        return mealRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get meals by hall ID
    public List<MealDTO> getMealsByHallId(Long hallId) {
        validateHallExists(hallId);
        return mealRepository.findByHallId(hallId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get meals by hall name
    public List<MealDTO> getMealsByHallName(String hallName) {
        Hall hall = hallRepository.findByHallName(hallName)
                .orElseThrow(() -> new EntityNotFoundException("Hall not found with name: " + hallName));
        return mealRepository.findByHallId(hall.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get meals by hall and meal type
    public List<MealDTO> getMealsByHallAndType(Long hallId, MealType mealType) {
        validateHallExists(hallId);
        return mealRepository.findByHallIdAndMealType(hallId, mealType).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get meals by hall name and meal type
    public List<MealDTO> getMealsByHallNameAndType(String hallName, MealType mealType) {
        Hall hall = hallRepository.findByHallName(hallName)
                .orElseThrow(() -> new EntityNotFoundException("Hall not found with name: " + hallName));
        return mealRepository.findByHallIdAndMealType(hall.getId(), mealType).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get today's meals by hall ID
    public List<MealDTO> getTodaysMeals(Long hallId) {
        validateHallExists(hallId);
        return mealRepository.findTodaysMealsByHallId(hallId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get today's meals by hall name
    public List<MealDTO> getTodaysMealsByHallName(String hallName) {
        try {
            logger.info("Looking for hall with name: '{}'", hallName);
            
            // Try exact match first
            Optional<Hall> hallOpt = hallRepository.findByHallName(hallName);
            
            // If not found, try case-insensitive search
            if (hallOpt.isEmpty()) {
                logger.info("Exact match not found, trying case-insensitive search...");
                List<Hall> allHalls = hallRepository.findAll();
                hallOpt = allHalls.stream()
                    .filter(hall -> hall.getHallName().equalsIgnoreCase(hallName))
                    .findFirst();
            }
            
            if (hallOpt.isEmpty()) {
                logger.error("Hall not found with name: '{}'", hallName);
                List<String> availableHalls = hallRepository.findAll().stream()
                    .map(Hall::getHallName)
                    .collect(Collectors.toList());
                logger.info("Available halls: {}", availableHalls);
                throw new EntityNotFoundException("Hall not found with name: " + hallName);
            }
            
            Hall hall = hallOpt.get();
            logger.info("Found hall: {} (ID: {})", hall.getHallName(), hall.getId());
            
            // Get today's meals
            List<Meal> meals = mealRepository.findTodaysMealsByHallId(hall.getId());
            logger.info("Found {} meals for today in hall: {}", meals.size(), hall.getHallName());
            
            return meals.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            
        } catch (Exception e) {
            logger.error("Error in getTodaysMealsByHallName for hall: '{}'", hallName, e);
            throw e;
        }
    }

    // Get meals by date range
    public List<MealDTO> getMealsByDateRange(Long hallId, LocalDateTime startDate, LocalDateTime endDate) {
        validateHallExists(hallId);
        return mealRepository.findMealsByHallAndDateRange(hallId, startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get meals by date range and hall name
    public List<MealDTO> getMealsByDateRangeAndHallName(String hallName, LocalDateTime startDate, LocalDateTime endDate) {
        Hall hall = hallRepository.findByHallName(hallName)
                .orElseThrow(() -> new EntityNotFoundException("Hall not found with name: " + hallName));
        return mealRepository.findMealsByHallAndDateRange(hall.getId(), startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get available meals
    public List<MealDTO> getAvailableMeals() {
        return mealRepository.findAllAvailableMeals().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get available meals by hall ID
    public List<MealDTO> getAvailableMealsByHall(Long hallId) {
        validateHallExists(hallId);
        return mealRepository.findAvailableMealsByHallId(hallId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get available meals by hall name
    public List<MealDTO> getAvailableMealsByHallName(String hallName) {
        Hall hall = hallRepository.findByHallName(hallName)
                .orElseThrow(() -> new EntityNotFoundException("Hall not found with name: " + hallName));
        return mealRepository.findAvailableMealsByHallId(hall.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get meals by type
    public List<MealDTO> getMealsByType(MealType mealType) {
        return mealRepository.findByMealType(mealType).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Create meal
    public MealDTO createMeal(MealDTO mealDTO) {
        Hall hall = hallRepository.findById(mealDTO.getHallId())
                .orElseThrow(() -> new EntityNotFoundException("Hall not found with ID: " + mealDTO.getHallId()));

        Meal meal = new Meal();
        meal.setHall(hall);
        meal.setMealType(mealDTO.getMealType());
        meal.setMealName(mealDTO.getMealName());
        meal.setDescription(mealDTO.getDescription());
        meal.setPrice(mealDTO.getPrice());
        meal.setQuantity(mealDTO.getQuantity());
        meal.setMealDate(mealDTO.getMealDate() != null ? mealDTO.getMealDate() : LocalDateTime.now());
        meal.setIsAvailable(mealDTO.getIsAvailable() != null ? mealDTO.getIsAvailable() : true);

        Meal savedMeal = mealRepository.save(meal);
        return convertToDTO(savedMeal);
    }

    // Update meal
    public MealDTO updateMeal(Long id, MealDTO mealDTO) {
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Meal not found with ID: " + id));

        if (mealDTO.getMealName() != null) {
            meal.setMealName(mealDTO.getMealName());
        }
        if (mealDTO.getDescription() != null) {
            meal.setDescription(mealDTO.getDescription());
        }
        if (mealDTO.getPrice() != null) {
            meal.setPrice(mealDTO.getPrice());
        }
        if (mealDTO.getQuantity() != null) {
            meal.setQuantity(mealDTO.getQuantity());
        }
        if (mealDTO.getMealDate() != null) {
            meal.setMealDate(mealDTO.getMealDate());
        }
        if (mealDTO.getIsAvailable() != null) {
            meal.setIsAvailable(mealDTO.getIsAvailable());
        }
        if (mealDTO.getMealType() != null) {
            meal.setMealType(mealDTO.getMealType());
        }

        Meal updatedMeal = mealRepository.save(meal);
        return convertToDTO(updatedMeal);
    }

    // Delete meal
    public void deleteMeal(Long id) {
        if (!mealRepository.existsById(id)) {
            throw new EntityNotFoundException("Meal not found with ID: " + id);
        }
        mealRepository.deleteById(id);
    }

    // Get meal by ID
    public MealDTO getMealById(Long id) {
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Meal not found with ID: " + id));
        return convertToDTO(meal);
    }

    // Validate hall exists by ID
    private void validateHallExists(Long hallId) {
        if (!hallRepository.existsById(hallId)) {
            throw new EntityNotFoundException("Hall not found with ID: " + hallId);
        }
    }

    // Validate hall exists by name
    private void validateHallExists(String hallName) {
        if (!hallRepository.existsByHallName(hallName)) {
            throw new EntityNotFoundException("Hall not found with name: " + hallName);
        }
    }

    
    private MealDTO convertToDTO(Meal meal) {
        MealDTO dto = new MealDTO();
        dto.setId(meal.getId());
        dto.setHallId(meal.getHall().getId());
        dto.setHallName(meal.getHall().getHallName());
        dto.setHallCode(meal.getHall().getHallCode());
        dto.setMealType(meal.getMealType());
        dto.setMealName(meal.getMealName());
        dto.setDescription(meal.getDescription());
        dto.setPrice(meal.getPrice());
        dto.setQuantity(meal.getQuantity());
        dto.setMealDate(meal.getMealDate());
        dto.setIsAvailable(meal.getIsAvailable());
        dto.setCreatedAt(meal.getCreatedAt());
        dto.setUpdatedAt(meal.getUpdatedAt());
        return dto;
    }
}