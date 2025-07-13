package com.cicarus.card;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class CardApplication {
	public static void main(String[] args) {
		SpringApplication.run(CardApplication.class, args);
	}
}
