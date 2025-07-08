package com.cicarus.currency_exchange.exception;

public class CurrencyNotSupportedException extends RuntimeException {
    public CurrencyNotSupportedException(String from, String to) {
        super("Currency pair not supported: " + from + "to" + to);

    }
}
