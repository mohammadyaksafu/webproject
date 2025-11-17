package com.sust.hall.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class MenuItemRequest {
    private String hallName;
    private String mealTime;
    private String itemName;
    private double price;
    private LocalDate date;
}
