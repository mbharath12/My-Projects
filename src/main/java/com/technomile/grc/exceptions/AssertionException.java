package com.technomile.grc.exceptions;

public class AssertionException extends RuntimeException {

    private String message;

    public AssertionException(final String msg, Throwable err) {
        super(msg, err);
        this.message = msg;
    }

    public String toString() {
        return message;
    }

    public String getMessage() {
        return message;
    }
}
