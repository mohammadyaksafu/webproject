package com.sust.hall.exeptions;

public class BadRequestException extends RuntimeException{
    public BadRequestException (String ex){
        super(ex);
    }
}
