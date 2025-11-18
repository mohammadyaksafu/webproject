package com.sust.hall.repository;

import com.sust.hall.entity.User;
import com.sust.hall.enums.UserRole;
import com.sust.hall.entity.AccountStatus;
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

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public User save(User user) {
        if (user.getId() == null) {
            if (user.getCreatedAt() == null) {
                user.setCreatedAt(LocalDateTime.now());
            }
            
            String sql = "INSERT INTO users (name, email, hall_name, role, password, account_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, user.getName());
                ps.setString(2, user.getEmail());
                ps.setString(3, user.getHallName());
                ps.setString(4, user.getRole().name());
                ps.setString(5, user.getPassword());
                ps.setString(6, user.getAccountStatus().name());
                ps.setTimestamp(7, Timestamp.valueOf(user.getCreatedAt())); 
                return ps;
            }, keyHolder);
            
            user.setId(keyHolder.getKey().longValue());
            return user;
        } else {
            
            String sql = "UPDATE users SET name = ?, email = ?, hall_name = ?, role = ?, password = ?, account_status = ? WHERE id = ?";
            jdbcTemplate.update(sql, 
                user.getName(), 
                user.getEmail(), 
                user.getHallName(), 
                user.getRole().name(), 
                user.getPassword(),
                user.getAccountStatus().name(),
                user.getId());
            return user;
        }
    }

    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    public int createUser(String name, String email, String hallName, UserRole role) {
        String sql = "INSERT INTO users (name, email, hall_name, role, account_status) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, name, email, hallName, role.name(), AccountStatus.PENDING.name());
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

   

    public List<User> findUsersByAccountStatus(AccountStatus status) {
        String sql = "SELECT * FROM users WHERE account_status = ?";
        return jdbcTemplate.query(sql, new UserRowMapper(), status.name());
    }

    public List<User> findPendingUsers() {
        return findUsersByAccountStatus(AccountStatus.PENDING);
    }

    public int updateUserStatus(Long id, AccountStatus status) {
        String sql = "UPDATE users SET account_status = ? WHERE id = ?";
        return jdbcTemplate.update(sql, status.name(), id);
    }

    public int updateUserRole(Long id, UserRole role) {
        String sql = "UPDATE users SET role = ? WHERE id = ?";
        return jdbcTemplate.update(sql, role.name(), id);
    }

    public int updateUserRoleAndStatus(Long id, UserRole role, AccountStatus status) {
        String sql = "UPDATE users SET role = ?, account_status = ? WHERE id = ?";
        return jdbcTemplate.update(sql, role.name(), status.name(), id);
    }

    
    private static class UserRowMapper implements RowMapper<User> {
        @Override
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            User user = new User();
            user.setId(rs.getLong("id"));
            user.setName(rs.getString("name"));
            user.setEmail(rs.getString("email"));
            user.setHallName(rs.getString("hall_name"));
            user.setRole(UserRole.valueOf(rs.getString("role")));
            user.setPassword(rs.getString("password"));
            
            // Handle account_status (with fallback for existing records)
            String accountStatusStr = rs.getString("account_status");
            if (accountStatusStr != null) {
                user.setAccountStatus(AccountStatus.valueOf(accountStatusStr));
            } else {
                user.setAccountStatus(AccountStatus.PENDING); 
            }
            
          
            Timestamp timestamp = rs.getTimestamp("created_at");
            if (timestamp != null) {
                user.setCreatedAt(timestamp.toLocalDateTime());
            }
            
            return user;
        }
    }
}