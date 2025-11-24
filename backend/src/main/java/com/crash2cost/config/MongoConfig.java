package com.crash2cost.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Override
    protected String getDatabaseName() {
        return "crash2cost";
    }

    @Override
    protected boolean autoIndexCreation() {
        return true;
    }
}
