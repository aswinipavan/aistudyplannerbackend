package com.aistudyplanner.model.entity;

import com.aistudyplanner.model.MaterialType;
import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "materials")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")  // nullable
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Subject subject;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "file_url", columnDefinition = "TEXT")
    private String fileUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "file_type", length = 50)
    private MaterialType fileType;

    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;

    @Column(name = "ai_summary", columnDefinition = "TEXT")
    private String aiSummary;

    @Column(name = "ai_categorized_subject", length = 100)
    private String aiCategorizedSubject;

    @Column(name = "upload_date")
    private OffsetDateTime uploadDate;

    @PrePersist
    public void prePersist() {
        if (uploadDate == null) {
            uploadDate = OffsetDateTime.now();
        }
    }
}
