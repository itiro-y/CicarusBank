package com.cicarus.investment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class InvestmentStartup {

	public static void main(String[] args) {
		SpringApplication.run(InvestmentStartup.class, args);
	}

}
