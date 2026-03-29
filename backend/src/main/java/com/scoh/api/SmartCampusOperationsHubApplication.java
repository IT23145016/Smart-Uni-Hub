package com.scoh.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class SmartCampusOperationsHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartCampusOperationsHubApplication.class, args);
    }
}
