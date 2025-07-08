package com.sicarus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;


//Transaction → Account
//
//No lançamento de uma transação, o Transaction Service pode chamar o Account Service para:
//
//Validar que a conta existe
//
//Atualizar o saldo (débito/crédito)

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.sicarus.clients")
public class StartupTransaction {
	public static void main(String[] args) {
		SpringApplication.run(StartupTransaction.class, args);
	}
}
