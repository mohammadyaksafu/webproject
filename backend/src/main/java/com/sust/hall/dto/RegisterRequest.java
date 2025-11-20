package com.sust.hall.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String hallName;
    private String password;
    private String confirmPassword;

    @Override
    public String toString(){
        return name + " " + email+ " " +hallName + " " +password + " " +confirmPassword + "\n";
    }
}