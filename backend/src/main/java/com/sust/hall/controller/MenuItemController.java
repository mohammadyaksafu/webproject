package com.sust.hall.controller;

import com.sust.hall.dto.MenuItemRequest;
import com.sust.hall.entity.MenuItem;
import com.sust.hall.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuItemController {

    private final MenuItemService service;

    @PostMapping
    public MenuItem createMenu(@RequestBody MenuItemRequest request) {
        return service.createMenu(request);
    }

    @PutMapping("/{id}")
    public MenuItem updateMenu(@PathVariable Long id, @RequestBody MenuItemRequest request) {
        return service.updateMenu(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteMenu(@PathVariable Long id) {
        service.deleteMenu(id);
        return "Menu item deleted successfully!";
    }

    @GetMapping
    public List<MenuItem> getAll() {
        return service.getAllMenu();
    }

    @GetMapping("/today")
    public List<MenuItem> todayMenu() {
        return service.getTodayMenu();
    }

    @GetMapping("/{hallName}")
    public List<MenuItem> hallMenu(@PathVariable String hallName) {
        return service.getHallMenu(hallName);
    }

    @GetMapping("/{hallName}/today")
    public List<MenuItem> hallTodayMenu(@PathVariable String hallName) {
        return service.getHallTodayMenu(hallName);
    }
}
