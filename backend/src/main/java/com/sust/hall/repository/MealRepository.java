package com.sust.hall.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.sust.hall.entity.Meal;
import com.sust.hall.enums.MealType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {

    // Find all meals by hall
    @Query("SELECT m FROM Meal m WHERE m.hall.id = :hallId ORDER BY m.mealDate DESC")
    List<Meal> findByHallId(@Param("hallId") Long hallId);

    // Find meals by hall and type
    @Query("SELECT m FROM Meal m WHERE m.hall.id = :hallId AND m.mealType = :mealType ORDER BY m.mealDate DESC")
    List<Meal> findByHallIdAndMealType(@Param("hallId") Long hallId, @Param("mealType") MealType mealType);

    // Find today's meals by hall
    @Query("SELECT m FROM Meal m WHERE m.hall.id = :hallId AND DATE(m.mealDate) = CURDATE() ORDER BY m.mealType")
    List<Meal> findTodaysMealsByHallId(@Param("hallId") Long hallId);

    // Find meals by date range
    @Query("SELECT m FROM Meal m WHERE m.hall.id = :hallId AND m.mealDate BETWEEN :startDate AND :endDate ORDER BY m.mealDate")
    List<Meal> findMealsByHallAndDateRange(
        @Param("hallId") Long hallId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    // Find all available meals
    @Query("SELECT m FROM Meal m WHERE m.isAvailable = true ORDER BY m.mealDate DESC")
    List<Meal> findAllAvailableMeals();

    // Find available meals by hall
    @Query("SELECT m FROM Meal m WHERE m.hall.id = :hallId AND m.isAvailable = true ORDER BY m.mealDate DESC")
    List<Meal> findAvailableMealsByHallId(@Param("hallId") Long hallId);

    // Find meals by type
    @Query("SELECT m FROM Meal m WHERE m.mealType = :mealType AND m.isAvailable = true ORDER BY m.mealDate DESC")
    List<Meal> findByMealType(@Param("mealType") MealType mealType);

    // Find specific meal for today
    @Query("SELECT m FROM Meal m WHERE m.hall.id = :hallId AND m.mealType = :mealType AND DATE(m.mealDate) = CURDATE()")
    Optional<Meal> findTodaysMealByHallAndType(@Param("hallId") Long hallId, @Param("mealType") MealType mealType);

    // Count available meals by hall
    @Query("SELECT COUNT(m) FROM Meal m WHERE m.hall.id = :hallId AND m.isAvailable = true")
    Long countAvailableMealsByHall(@Param("hallId") Long hallId);
}