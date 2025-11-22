package com.sust.hall.dto;

import com.sust.hall.enums.MealType;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MealDTO {
    private Long id;
    private String hallName; 
    private MealType mealType;
    private String mealName;
    private String description;
    private Double price;
    private Integer quantity;
    private LocalDateTime mealDate;
    private Boolean isAvailable;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}