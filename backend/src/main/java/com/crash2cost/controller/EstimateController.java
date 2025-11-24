package com.crash2cost.controller;

import com.crash2cost.dto.AnalysisResult;
import com.crash2cost.dto.DetectedDamage;
import com.crash2cost.dto.EstimateResponse;
import com.crash2cost.model.DamageAnalysis;
import com.crash2cost.model.DamageRegion;
import com.crash2cost.model.Estimate;
import com.crash2cost.repository.DamageAnalysisRepository;
import com.crash2cost.repository.DamageRegionRepository;
import com.crash2cost.repository.EstimateRepository;
import com.crash2cost.service.DamageAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class EstimateController {

    private final EstimateRepository estimateRepository;
    private final DamageRegionRepository damageRegionRepository;
    private final DamageAnalysisRepository damageAnalysisRepository;
    private final DamageAnalysisService damageAnalysisService;

    @Value("${upload.directory}")
    private String uploadDirectory;

    @PostMapping("/estimate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> estimateDamage(@RequestParam("file") MultipartFile file) {
        log.debug("DEBUG: Estimate request received - filename: {}", file.getOriginalFilename());

        try {
            // Create upload directory if it doesn't exist
            File uploadDir = new File(uploadDirectory);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // Save the uploaded file
            String filename = file.getOriginalFilename();
            Path filePath = Paths.get(uploadDirectory, filename);
            Files.write(filePath, file.getBytes());
            log.info("DEBUG: File saved successfully - {} bytes", file.getSize());

            // Run damage analysis
            log.info("DEBUG: Running damage analysis...");
            AnalysisResult analysis = damageAnalysisService.analyzeImage(filePath.toString());
            log.info("DEBUG: Analysis complete - detected: {} damages",
                    analysis.getDetected().size());

            // Calculate total cost
            double totalCost = analysis.getDetected().stream()
                    .mapToDouble(DetectedDamage::getRepairCost)
                    .sum();

            // Create and save estimate
            String estimateId = UUID.randomUUID().toString();
            LocalDateTime createdAt = LocalDateTime.now();

            Estimate estimate = Estimate.builder()
                    .id(estimateId)
                    .filename(filename)
                    .createdAt(createdAt)
                    .totalCost(totalCost)
                    .build();

            estimateRepository.save(estimate);
            log.info("DEBUG: Estimate saved to DB - {}", estimateId);

            // Save full analysis result
            DamageAnalysis damageAnalysis = DamageAnalysis.builder()
                    .estimateId(estimateId)
                    .result(analysis)
                    .build();
            damageAnalysisRepository.save(damageAnalysis);
            log.info("DEBUG: Analysis result saved to DB");

            // Save damage regions
            List<DamageRegion> damageRegions = analysis.getDetected().stream()
                    .map(d -> DamageRegion.builder()
                            .estimateId(estimateId)
                            .part(d.getPart())
                            .severity(d.getSeverity())
                            .damageType(d.getDamageType())
                            .bbox(d.getBbox())
                            .repairCost(d.getRepairCost())
                            .build())
                    .collect(Collectors.toList());

            if (!damageRegions.isEmpty()) {
                damageRegionRepository.saveAll(damageRegions);
                log.info("DEBUG: {} damage regions saved", damageRegions.size());
            }

            // Build response
            EstimateResponse response = EstimateResponse.builder()
                    .estimateId(estimateId)
                    .filename(filename)
                    .analysis(analysis)
                    .totalCost(totalCost)
                    .createdAt(createdAt.format(DateTimeFormatter.ISO_DATE_TIME) + "Z")
                    .build();

            log.info("DEBUG: Returning result");
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            log.error("DEBUG: Error in estimate - {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("detail", "Error processing estimate: " + e.getMessage()));
        }
    }

    @GetMapping("/admin/estimates")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllEstimates() {
        log.debug("DEBUG: Admin estimates request");

        try {
            List<Estimate> estimates = estimateRepository.findAllByOrderByCreatedAtDesc();

            // Convert to response format
            List<Map<String, Object>> estimateList = estimates.stream()
                    .map(est -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("_id", est.getId());
                        map.put("filename", est.getFilename());
                        map.put("totalCost", est.getTotalCost());
                        map.put("createdAt", est.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME) + "Z");
                        return map;
                    })
                    .collect(Collectors.toList());

            log.info("DEBUG: Returning {} estimates", estimateList.size());

            Map<String, Object> response = new HashMap<>();
            response.put("estimates", estimateList);
            response.put("total", estimateList.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("DEBUG: Error fetching estimates - {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("detail", "Error fetching estimates: " + e.getMessage()));
        }
    }
}
