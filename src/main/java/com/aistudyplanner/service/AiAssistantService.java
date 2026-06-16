package com.aistudyplanner.service;

import com.aistudyplanner.model.dto.request.ChatRequest;
import com.aistudyplanner.model.dto.response.AiChatResponse;
import com.aistudyplanner.model.entity.ChatHistory;
import com.aistudyplanner.model.entity.Student;
import com.aistudyplanner.repository.ChatHistoryRepository;
import com.aistudyplanner.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AiAssistantService {

    private final ChatHistoryRepository chatHistoryRepository;
    private final GroqService groqService;
    private final StudentRepository studentRepository;

    @Transactional
    public AiChatResponse chat(UUID studentId, ChatRequest request) {
        Student student = studentRepository.findById(studentId).orElseThrow();

        ChatHistory userMessage = ChatHistory.builder()
                .student(student)
                .sessionId(request.getSessionId())
                .role("user")
                .message(request.getMessage())
                .build();
        chatHistoryRepository.save(userMessage);

        List<ChatHistory> history = chatHistoryRepository.findByStudentIdAndSessionIdOrderByCreatedAtAsc(studentId, request.getSessionId());
        
        if (history.size() > 10) {
            history = history.subList(history.size() - 10, history.size());
        }

        String assistantReply = groqService.chat(request.getMessage(), history);

        ChatHistory assistantMessage = ChatHistory.builder()
                .student(student)
                .sessionId(request.getSessionId())
                .role("assistant")
                .message(assistantReply)
                .build();
        chatHistoryRepository.save(assistantMessage);

        return AiChatResponse.builder()
                .sessionId(request.getSessionId())
                .reply(assistantReply)
                .build();
    }

    @Transactional(readOnly = true)
    public List<ChatHistory> getChatHistory(UUID studentId, String sessionId) {
        return chatHistoryRepository.findByStudentIdAndSessionIdOrderByCreatedAtAsc(studentId, sessionId);
    }

    @Transactional
    public void clearChatHistory(UUID studentId, String sessionId) {
        List<ChatHistory> history = chatHistoryRepository.findByStudentIdAndSessionIdOrderByCreatedAtAsc(studentId, sessionId);
        chatHistoryRepository.deleteAll(history);
    }

    public String generateNewSessionId() {
        return UUID.randomUUID().toString();
    }
}
