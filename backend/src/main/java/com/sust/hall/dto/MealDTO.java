package com.sust.hall.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import com.sust.hall.enums.MealType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MealDTO {
    private Long id;
    private Long hallId;
    private String hallName;
    private String hallCode;
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
