package com.crash2cost.service;

import com.crash2cost.dto.AnalysisResult;
import com.crash2cost.dto.DetectedDamage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
public class DamageAnalysisService {

    /**
     * Dummy analysis for now - returns mock damage data
     * In production, this would call your ML model
     */
    public AnalysisResult analyzeImage(String filePath) {
        log.info("🔍 DEBUG: Running damage analysis on: {}", filePath);

        // Mock detected damages
        List<DetectedDamage> detected = Arrays.asList(
                DetectedDamage.builder()
                        .part("Front Bumper")
                        .severity("Moderate")
                        .damageType("Scratch")
                        .bbox(Arrays.asList(100, 150, 250, 300))
                        .repairCost(450.0)
                        .build(),
                DetectedDamage.builder()
                        .part("Hood")
                        .severity("Severe")
                        .damageType("Dent")
                        .bbox(Arrays.asList(200, 100, 400, 250))
                        .repairCost(1200.0)
                        .build(),
                DetectedDamage.builder()
                        .part("Right Headlight")
                        .severity("Critical")
                        .damageType("Broken")
                        .bbox(Arrays.asList(320, 160, 400, 220))
                        .repairCost(800.0)
                        .build()
        );

        log.info("✅ DEBUG: Analysis complete - detected {} damages", detected.size());

        return AnalysisResult.builder()
                .detected(detected)
                .build();
    }
}
