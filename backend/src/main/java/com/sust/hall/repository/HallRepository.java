package com.sust.hall.repository;

import com.sust.hall.entity.Hall;
import com.sust.hall.enums.HallType;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class HallRepository {

    private final JdbcTemplate jdbcTemplate;

    public HallRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Hall save(Hall hall) {
        if (hall.getId() == null) {
            // Insert new hall
            String sql = """
                INSERT INTO halls (hall_code, hall_name, full_name, type, capacity, current_occupancy, 
                provost, email, phone, office_location, office_hours, description, image_url, 
                facilities, is_active, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;
            KeyHolder keyHolder = new GeneratedKeyHolder();
            
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, hall.getHallCode());
                ps.setString(2, hall.getHallName());
                ps.setString(3, hall.getFullName());
                ps.setString(4, hall.getType().name());
                ps.setInt(5, hall.getCapacity());
                ps.setInt(6, hall.getCurrentOccupancy());
                ps.setString(7, hall.getProvost());
                ps.setString(8, hall.getEmail());
                ps.setString(9, hall.getPhone());
                ps.setString(10, hall.getOfficeLocation());
                ps.setString(11, hall.getOfficeHours());
                ps.setString(12, hall.getDescription());
                ps.setString(13, hall.getImageUrl());
                ps.setString(14, hall.getFacilities());
                ps.setBoolean(15, hall.getIsActive());
                ps.setTimestamp(16, Timestamp.valueOf(hall.getCreatedAt() != null ? hall.getCreatedAt() : LocalDateTime.now()));
                ps.setTimestamp(17, Timestamp.valueOf(hall.getUpdatedAt() != null ? hall.getUpdatedAt() : LocalDateTime.now()));
                return ps;
            }, keyHolder);
            
            hall.setId(keyHolder.getKey().longValue());
            return hall;
        } else {
        
            String sql = """
                UPDATE halls SET hall_code = ?, hall_name = ?, full_name = ?, type = ?, capacity = ?, 
                current_occupancy = ?, provost = ?, email = ?, phone = ?, office_location = ?, 
                office_hours = ?, description = ?, image_url = ?, facilities = ?, is_active = ?, 
                updated_at = ? WHERE id = ?
                """;
            jdbcTemplate.update(sql, 
                hall.getHallCode(),
                hall.getHallName(),
                hall.getFullName(),
                hall.getType().name(),
                hall.getCapacity(),
                hall.getCurrentOccupancy(),
                hall.getProvost(),
                hall.getEmail(),
                hall.getPhone(),
                hall.getOfficeLocation(),
                hall.getOfficeHours(),
                hall.getDescription(),
                hall.getImageUrl(),
                hall.getFacilities(),
                hall.getIsActive(),
                LocalDateTime.now(),
                hall.getId());
            return hall;
        }
    }

    public List<Hall> findAll() {
        String sql = "SELECT * FROM halls WHERE is_active = true ORDER BY hall_name";
        return jdbcTemplate.query(sql, new HallRowMapper());
    }

    public List<Hall> findAllActiveHalls() {
        String sql = "SELECT * FROM halls WHERE is_active = true ORDER BY hall_name";
        return jdbcTemplate.query(sql, new HallRowMapper());
    }

    public Optional<Hall> findById(Long id) {
        String sql = "SELECT * FROM halls WHERE id = ? AND is_active = true";
        try {
            Hall hall = jdbcTemplate.queryForObject(sql, new HallRowMapper(), id);
            return Optional.ofNullable(hall);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<Hall> findByHallCode(String hallCode) {
        String sql = "SELECT * FROM halls WHERE hall_code = ? AND is_active = true";
        try {
            Hall hall = jdbcTemplate.queryForObject(sql, new HallRowMapper(), hallCode);
            return Optional.ofNullable(hall);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<Hall> findByType(HallType type) {
        String sql = "SELECT * FROM halls WHERE type = ? AND is_active = true ORDER BY hall_name";
        return jdbcTemplate.query(sql, new HallRowMapper(), type.name());
    }

    public List<Hall> findMaleHalls() {
        return findByType(HallType.MALE);
    }

    public List<Hall> findFemaleHalls() {
        return findByType(HallType.FEMALE);
    }

    /**
     * Check if a hall exists by ID
     * @param hallId the hall ID
     * @return true if hall exists with is_active = true, false otherwise
     */
    public boolean existsById(Long hallId) {
        String sql = "SELECT COUNT(*) FROM halls WHERE id = ? AND is_active = true";
        try {
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, hallId);
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if a hall exists (including inactive halls)
     * @param hallId the hall ID
     * @return true if hall exists regardless of active status
     */
    public boolean existsByIdIncludingInactive(Long hallId) {
        String sql = "SELECT COUNT(*) FROM halls WHERE id = ?";
        try {
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, hallId);
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }

    public int updateOccupancy(Long hallId, int newOccupancy) {
        String sql = "UPDATE halls SET current_occupancy = ?, updated_at = ? WHERE id = ?";
        return jdbcTemplate.update(sql, newOccupancy, LocalDateTime.now(), hallId);
    }

    public int deactivateHall(Long hallId) {
        String sql = "UPDATE halls SET is_active = false, updated_at = ? WHERE id = ?";
        return jdbcTemplate.update(sql, LocalDateTime.now(), hallId);
    }

    public int getTotalCapacity() {
        String sql = "SELECT SUM(capacity) FROM halls WHERE is_active = true";
        Integer total = jdbcTemplate.queryForObject(sql, Integer.class);
        return total != null ? total : 0;
    }

    public int getTotalOccupancy() {
        String sql = "SELECT SUM(current_occupancy) FROM halls WHERE is_active = true";
        Integer total = jdbcTemplate.queryForObject(sql, Integer.class);
        return total != null ? total : 0;
    }

    public List<Object[]> getHallStatistics() {
        String sql = """
            SELECT type, COUNT(*) as hall_count, SUM(capacity) as total_capacity, 
            SUM(current_occupancy) as total_occupancy 
            FROM halls WHERE is_active = true 
            GROUP BY type
            """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> 
            new Object[]{
                rs.getString("type"),
                rs.getInt("hall_count"),
                rs.getInt("total_capacity"),
                rs.getInt("total_occupancy")
            });
    }

    public boolean existsByHallCode(String hallCode) {
        String sql = "SELECT COUNT(*) FROM halls WHERE hall_code = ? AND is_active = true";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, hallCode);
        return count != null && count > 0;
    }

    

    public Optional<Hall> findByHallName(String hallName) {
    String sql = "SELECT * FROM halls WHERE LOWER(hall_name) = LOWER(?) AND is_active = true";
    try {
        Hall hall = jdbcTemplate.queryForObject(sql, new HallRowMapper(), hallName);
        return Optional.ofNullable(hall);
    } catch (Exception e) {
        return Optional.empty();
    }
}

public Optional<Hall> findByFullName(String fullName) {
    String sql = "SELECT * FROM halls WHERE LOWER(full_name) = LOWER(?) AND is_active = true";
    try {
        Hall hall = jdbcTemplate.queryForObject(sql, new HallRowMapper(), fullName);
        return Optional.ofNullable(hall);
    } catch (Exception e) {
        return Optional.empty();
    }
}

    public boolean existsByHallName(String hallName) {
        String sql = "SELECT COUNT(*) FROM halls WHERE hall_name = ? AND is_active = true";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, hallName);
        return count != null && count > 0;
    }

    private static class HallRowMapper implements RowMapper<Hall> {
        @Override
        public Hall mapRow(ResultSet rs, int rowNum) throws SQLException {
            Hall hall = new Hall();
            hall.setId(rs.getLong("id"));
            hall.setHallCode(rs.getString("hall_code"));
            hall.setHallName(rs.getString("hall_name"));
            hall.setFullName(rs.getString("full_name"));
            hall.setType(HallType.valueOf(rs.getString("type")));
            hall.setCapacity(rs.getInt("capacity"));
            hall.setCurrentOccupancy(rs.getInt("current_occupancy"));
            hall.setProvost(rs.getString("provost"));
            hall.setEmail(rs.getString("email"));
            hall.setPhone(rs.getString("phone"));
            hall.setOfficeLocation(rs.getString("office_location"));
            hall.setOfficeHours(rs.getString("office_hours"));
            hall.setDescription(rs.getString("description"));
            hall.setImageUrl(rs.getString("image_url"));
            hall.setFacilities(rs.getString("facilities"));
            hall.setIsActive(rs.getBoolean("is_active"));
            
            Timestamp createdAt = rs.getTimestamp("created_at");
            if (createdAt != null) {
                hall.setCreatedAt(createdAt.toLocalDateTime());
            }
            
            Timestamp updatedAt = rs.getTimestamp("updated_at");
            if (updatedAt != null) {
                hall.setUpdatedAt(updatedAt.toLocalDateTime());
            }
            
            return hall;
        }
    }
}