package com.crash2cost;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoAuditing
@EnableMongoRepositories(basePackages = "com.crash2cost.repository")
public class Crash2CostApplication {

    public static void main(String[] args) {
        SpringApplication.run(Crash2CostApplication.class, args);
        System.out.println("🚀 Crash2Cost API is running on http://127.0.0.1:8001");
    }
}
