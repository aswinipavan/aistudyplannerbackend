package com.aistudyplanner.model.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamResponse {

    private UUID id;
    private SubjectResponse subject;
    private String examName;
    private LocalDate examDate;
    private String examType;
    private BigDecimal durationHours;
    private Long daysRemaining;
    private Boolean isCompleted;
}
