package com.crash2cost.repository;

import com.crash2cost.model.DamageRegion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DamageRegionRepository extends MongoRepository<DamageRegion, String> {
    
    List<DamageRegion> findByEstimateId(String estimateId);
}
