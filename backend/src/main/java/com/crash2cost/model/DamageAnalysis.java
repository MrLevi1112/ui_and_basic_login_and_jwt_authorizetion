package com.crash2cost.model;

import com.crash2cost.dto.AnalysisResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "damage_analysis")
public class DamageAnalysis {

    @Id
    private String id;

    private String estimateId;

    private AnalysisResult result;
}
