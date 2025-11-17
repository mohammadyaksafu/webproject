package com.sust.hall.repository;

import com.sust.hall.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findByHallName(String hallName);

    List<MenuItem> findByDate(LocalDate date);

    List<MenuItem> findByHallNameAndDate(String hallName, LocalDate date);
}
