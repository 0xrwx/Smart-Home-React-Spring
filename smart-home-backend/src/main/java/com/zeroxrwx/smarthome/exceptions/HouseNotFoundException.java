package com.zeroxrwx.smarthome.exceptions;

public class HouseNotFoundException extends RuntimeException {
    public HouseNotFoundException(Long id) {
        super("Could not find house " + id);
    }
}
