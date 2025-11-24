package com.crash2cost.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "damageRegions")
public class DamageRegion {
    
    @Id
    private String id;
    
    private String estimateId;
    
    private String part;
    
    private String severity;
    
    private String damageType;
    
    private List<Integer> bbox;  // bounding box coordinates
    
    private Double repairCost;
}
