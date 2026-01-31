package com.staylio.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class StaylioBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(StaylioBackendApplication.class, args);
		System.out.println("Staylio Backend is Running.....");
	}

	@org.springframework.context.annotation.Bean
	public org.springframework.boot.web.servlet.FilterRegistrationBean<com.staylio.backend.config.SimpleCorsFilter> simpleCorsFilter() {
		org.springframework.boot.web.servlet.FilterRegistrationBean<com.staylio.backend.config.SimpleCorsFilter> bean = new org.springframework.boot.web.servlet.FilterRegistrationBean<>();
		bean.setFilter(new com.staylio.backend.config.SimpleCorsFilter());
		bean.setOrder(org.springframework.core.Ordered.HIGHEST_PRECEDENCE);
		return bean;
	}

}
