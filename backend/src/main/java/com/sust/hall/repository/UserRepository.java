package com.sust.hall.repository;

import com.sust.hall.entity.User;
import com.sust.hall.entity.UserRole;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

   
    public int createUser(String name, String email, String hallName, UserRole role) {
        String sql = "INSERT INTO users (name, email, hall_name, role) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, name, email, hallName, role.name());
    }

    
    public List<User> findAllUsers() {
        String sql = "SELECT * FROM users";
        return jdbcTemplate.query(sql, new UserRowMapper());
    }

   
    public User findUserById(Long id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new UserRowMapper(), id);
    }

    
    public List<User> findUsersByHall(String hallName) {
        String sql = "SELECT * FROM users WHERE hall_name = ?";
        return jdbcTemplate.query(sql, new UserRowMapper(), hallName);
    }

    
    public List<User> findUsersByRole(UserRole role) {
        String sql = "SELECT * FROM users WHERE role = ?";
        return jdbcTemplate.query(sql, new UserRowMapper(), role.name());
    }

    
    public List<User> findUsersByHallAndRole(String hallName, UserRole role) {
        String sql = "SELECT * FROM users WHERE hall_name = ? AND role = ?";
        return jdbcTemplate.query(sql, new UserRowMapper(), hallName, role.name());
    }

    
    public int updateUser(Long id, String name, String email, String hallName, UserRole role) {
        String sql = "UPDATE users SET name = ?, email = ?, hall_name = ?, role = ? WHERE id = ?";
        return jdbcTemplate.update(sql, name, email, hallName, role.name(), id);
    }

    
    public int deleteUser(Long id) {
        String sql = "DELETE FROM users WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    
    public List<String> findAllHallNames() {
        String sql = "SELECT DISTINCT hall_name FROM users";
        return jdbcTemplate.queryForList(sql, String.class);
    }

  
    public Integer countUsersByHall(String hallName) {
        String sql = "SELECT COUNT(*) FROM users WHERE hall_name = ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, hallName);
    }

    
    public List<Object[]> getUserStatisticsByHall() {
        String sql = """
            SELECT hall_name, role, COUNT(*) as count 
            FROM users 
            GROUP BY hall_name, role 
            ORDER BY hall_name, role
            """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> 
            new Object[]{
                rs.getString("hall_name"),
                rs.getString("role"),
                rs.getInt("count")
            });
    }

    // RowMapper implementation
    private static class UserRowMapper implements RowMapper<User> {
        @Override
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            User user = new User();
            user.setId(rs.getLong("id"));
            user.setName(rs.getString("name"));
            user.setEmail(rs.getString("email"));
            user.setHallName(rs.getString("hall_name"));
            user.setRole(UserRole.valueOf(rs.getString("role")));
            return user;
        }
    }
}