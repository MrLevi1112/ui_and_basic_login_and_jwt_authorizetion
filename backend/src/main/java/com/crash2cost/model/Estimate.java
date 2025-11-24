package com.crash2cost.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "estimates")
public class Estimate {
    
    @Id
    private String id;
    
    private String filename;
    
    private LocalDateTime createdAt;
    
    private Double totalCost;
}
