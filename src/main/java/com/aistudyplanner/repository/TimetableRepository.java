package com.aistudyplanner.repository;

import com.aistudyplanner.model.entity.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TimetableRepository extends JpaRepository<Timetable, UUID> {

    Optional<Timetable> findByStudentIdAndIsActive(UUID studentId, boolean isActive);

    List<Timetable> findAllByStudentIdOrderByCreatedAtDesc(UUID studentId);
}
