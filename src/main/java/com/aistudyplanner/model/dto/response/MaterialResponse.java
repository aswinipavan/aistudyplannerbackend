package com.aistudyplanner.model.dto.response;

import com.aistudyplanner.model.MaterialType;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialResponse {

    private UUID id;
    private String fileName;
    private String fileUrl;
    private MaterialType fileType;
    private Long fileSizeBytes;
    private String aiSummary;
    private String aiCategorizedSubject;
    private OffsetDateTime uploadDate;
}
