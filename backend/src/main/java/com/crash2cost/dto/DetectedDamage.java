package com.crash2cost.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetectedDamage {
    
    private String part;
    
    private String severity;
    
    private String damageType;
    
    private List<Integer> bbox;
    
    private Double repairCost;
}
