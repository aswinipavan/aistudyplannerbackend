package com.aistudyplanner.controller;

import com.aistudyplanner.model.dto.request.ChatRequest;
import com.aistudyplanner.model.dto.response.AiChatResponse;
import com.aistudyplanner.model.dto.response.ApiResponse;
import com.aistudyplanner.model.entity.ChatHistory;
import com.aistudyplanner.model.entity.Student;
import com.aistudyplanner.security.CurrentStudent;
import com.aistudyplanner.service.AiAssistantService;
import com.aistudyplanner.service.ExamService;
import com.aistudyplanner.service.GroqService;
import com.aistudyplanner.service.MarksService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("isAuthenticated()")
@Tag(name = "AI Assistant", description = "AI Chat and Insights APIs")
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;
    private final GroqService groqService;
    private final MarksService marksService;
    private final ExamService examService;

    @PostMapping("/chat")
    @Operation(summary = "Chat with AI Assistant")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(
            @CurrentStudent Student student,
            @Valid @RequestBody ChatRequest request) {
        log.info("Processing AI chat request for student: {}", student.getId());
        AiChatResponse response = aiAssistantService.chat(student.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, "Response generated successfully"));
    }

    @GetMapping("/chat/history")
    @Operation(summary = "Get chat history by session ID")
    public ResponseEntity<ApiResponse<List<ChatHistory>>> getChatHistory(
            @CurrentStudent Student student,
            @RequestParam String sessionId) {
        log.info("Fetching chat history for session: {}", sessionId);
        List<ChatHistory> history = aiAssistantService.getChatHistory(student.getId(), sessionId);
        return ResponseEntity.ok(ApiResponse.success(history, "Chat history fetched successfully"));
    }

    @DeleteMapping("/chat/history")
    @Operation(summary = "Clear chat history for session")
    public ResponseEntity<Void> clearChatHistory(
            @CurrentStudent Student student,
            @RequestParam String sessionId) {
        log.info("Clearing chat history for session: {}", sessionId);
        aiAssistantService.clearChatHistory(student.getId(), sessionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/chat/session")
    @Operation(summary = "Generate a new session ID")
    public ResponseEntity<ApiResponse<String>> generateSessionId() {
        String sessionId = aiAssistantService.generateNewSessionId();
        return ResponseEntity.ok(ApiResponse.success(sessionId, "Session ID generated successfully"));
    }

    @PostMapping("/analyze-performance")
    @Operation(summary = "Analyze student performance")
    public ResponseEntity<ApiResponse<String>> analyzePerformance(@CurrentStudent Student student) {
        log.info("Analyzing performance for student: {}", student.getId());
        Map<String, Double> subjectAverages = marksService.getSubjectWiseAverages(student.getId());
        String analysis = groqService.analyzeMarks(student.getId(), subjectAverages);
        return ResponseEntity.ok(ApiResponse.success(analysis, "Performance analyzed successfully"));
    }

    @GetMapping("/exam-prep-plan")
    @Operation(summary = "Generate exam preparation plan")
    public ResponseEntity<ApiResponse<String>> generateExamPrepPlan(@CurrentStudent Student student) {
        log.info("Generating exam prep plan for student: {}", student.getId());
        String plan = examService.generateExamPrepPlan(student.getId());
        return ResponseEntity.ok(ApiResponse.success(plan, "Exam prep plan generated successfully"));
    }

    @GetMapping("/motivation")
    @Operation(summary = "Get daily motivational tip")
    public ResponseEntity<ApiResponse<String>> getMotivation() {
        log.info("Fetching motivational tip");
        String tip = groqService.getMotivationalTip();
        return ResponseEntity.ok(ApiResponse.success(tip, "Motivational tip fetched successfully"));
    }
}
