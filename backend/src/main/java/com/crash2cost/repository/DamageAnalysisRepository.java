package com.crash2cost.repository;

import com.crash2cost.model.DamageAnalysis;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DamageAnalysisRepository extends MongoRepository<DamageAnalysis, String> {
}
