package com.aistudyplanner.repository;

import com.aistudyplanner.model.entity.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, UUID> {

    List<ChatHistory> findAllByStudentIdAndSessionIdOrderByCreatedAtAsc(UUID studentId, String sessionId);

    // Alias without "All" prefix for service compatibility
    default List<ChatHistory> findByStudentIdAndSessionIdOrderByCreatedAtAsc(UUID studentId, String sessionId) {
        return findAllByStudentIdAndSessionIdOrderByCreatedAtAsc(studentId, sessionId);
    }

    List<ChatHistory> findTop20ByStudentIdOrderByCreatedAtDesc(UUID studentId);
}
