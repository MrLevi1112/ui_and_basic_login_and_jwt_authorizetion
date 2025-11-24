package com.crash2cost.repository;

import com.crash2cost.model.Estimate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EstimateRepository extends MongoRepository<Estimate, String> {
    
    List<Estimate> findAllByOrderByCreatedAtDesc();
}
