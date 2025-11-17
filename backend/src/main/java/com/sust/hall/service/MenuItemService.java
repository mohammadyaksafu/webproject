package com.sust.hall.service;

import com.sust.hall.dto.MenuItemRequest;
import com.sust.hall.entity.MenuItem;
import com.sust.hall.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuItemService {

    private final MenuItemRepository repo;

    public MenuItem createMenu(MenuItemRequest request) {
        MenuItem item = new MenuItem();
        item.setHallName(request.getHallName());
        item.setMealTime(request.getMealTime());
        item.setItemName(request.getItemName());
        item.setPrice(request.getPrice());
        item.setDate(request.getDate());

        return repo.save(item);
    }

    public MenuItem updateMenu(Long id, MenuItemRequest request) {
        MenuItem item = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        item.setHallName(request.getHallName());
        item.setMealTime(request.getMealTime());
        item.setItemName(request.getItemName());
        item.setPrice(request.getPrice());
        item.setDate(request.getDate());

        return repo.save(item);
    }

    public void deleteMenu(Long id) {
        repo.deleteById(id);
    }

    public List<MenuItem> getAllMenu() {
        return repo.findAll();
    }

    public List<MenuItem> getTodayMenu() {
        return repo.findByDate(LocalDate.now());
    }

    public List<MenuItem> getHallMenu(String hallName) {
        return repo.findByHallName(hallName);
    }

    public List<MenuItem> getHallTodayMenu(String hallName) {
        return repo.findByHallNameAndDate(hallName, LocalDate.now());
    }
}
