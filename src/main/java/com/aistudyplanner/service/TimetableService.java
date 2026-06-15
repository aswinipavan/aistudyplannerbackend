package com.aistudyplanner.service;

import com.aistudyplanner.exception.ResourceNotFoundException;
import com.aistudyplanner.model.dto.request.SlotRequest;
import com.aistudyplanner.model.dto.request.TimetableRequest;
import com.aistudyplanner.model.dto.response.SlotResponse;
import com.aistudyplanner.model.dto.response.TimetableResponse;
import com.aistudyplanner.model.entity.Exam;
import com.aistudyplanner.model.entity.Student;
import com.aistudyplanner.model.entity.Subject;
import com.aistudyplanner.model.entity.Timetable;
import com.aistudyplanner.model.entity.TimetableSlot;
import com.aistudyplanner.repository.ExamRepository;
import com.aistudyplanner.repository.MarksRepository;
import com.aistudyplanner.repository.StudentRepository;
import com.aistudyplanner.repository.SubjectRepository;
import com.aistudyplanner.repository.TimetableRepository;
import com.aistudyplanner.repository.TimetableSlotRepository;
import com.aistudyplanner.util.AiPromptBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TimetableService {

    private final TimetableRepository timetableRepository;
    private final TimetableSlotRepository timetableSlotRepository;
    private final SubjectRepository subjectRepository;
    private final MarksRepository marksRepository;
    private final ExamRepository examRepository;
    private final StudentRepository studentRepository;
    private final GroqService groqService;

    @Transactional
    public TimetableResponse generateAiTimetable(UUID studentId, TimetableRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        double availableHours = student.getAvailableHoursPerDay().doubleValue();
        List<Subject> subjects = subjectRepository.findAllByStudentId(studentId);
        List<Object[]> avgData = marksRepository.findAveragePercentageBySubject(studentId);
        
        Map<UUID, Double> subjectAverages = new HashMap<>();
        for (Object[] row : avgData) {
            subjectAverages.put((UUID) row[0], ((Number) row[1]).doubleValue());
        }

        LocalDate next30Days = LocalDate.now().plusDays(30);
        List<Exam> upcomingExams = examRepository.findAllByStudentIdOrderByExamDateAsc(studentId).stream()
                .filter(e -> e.getExamDate() != null && !e.getExamDate().isAfter(next30Days) && !e.getExamDate().isBefore(LocalDate.now()))
                .collect(Collectors.toList());

        Map<UUID, Double> subjectWeights = new HashMap<>();
        double totalWeight = 0;

        for (Subject subject : subjects) {
            double avg = subjectAverages.getOrDefault(subject.getId(), 50.0);
            double diffLevel = subject.getDifficultyLevel() != null ? subject.getDifficultyLevel() : 3.0;
            
            double weight = (100 - avg) + (diffLevel * 10);
            
            long minDaysToExam = 31;
            for (Exam exam : upcomingExams) {
                if (exam.getSubject().getId().equals(subject.getId())) {
                    long days = ChronoUnit.DAYS.between(LocalDate.now(), exam.getExamDate());
                    if (days < minDaysToExam) minDaysToExam = days;
                }
            }

            if (minDaysToExam <= 3) {
                weight += 50;
            } else if (minDaysToExam <= 7) {
                weight += 30;
            }

            subjectWeights.put(subject.getId(), weight);
            totalWeight += weight;
        }

        double totalDailyMinutes = availableHours * 60;
        Map<UUID, Integer> allocatedMinutesMap = new HashMap<>();
        
        for (Subject subject : subjects) {
            double weight = subjectWeights.get(subject.getId());
            double allocated = (weight / totalWeight) * totalDailyMinutes;
            int minutes = Math.max(15, (int) allocated);
            minutes = Math.round(minutes / 30.0f) * 30;
            if (minutes == 0) minutes = 30;
            allocatedMinutesMap.put(subject.getId(), minutes);
        }

        List<Timetable> existing = timetableRepository.findAllByStudentId(studentId);
        for (Timetable t : existing) {
            t.setIsActive(false);
            timetableRepository.save(t);
        }

        Timetable timetable = Timetable.builder()
                .student(student)
                .isAiGenerated(true)
                .isActive(true)
                .build();
        timetable = timetableRepository.save(timetable);

        List<TimetableSlot> slotsToSave = new ArrayList<>();
        
        for (int dayIndex = 0; dayIndex < 7; dayIndex++) {
            DayOfWeek day = DayOfWeek.values()[dayIndex];
            LocalTime currentTime = LocalTime.of(18, 0);
            
            boolean isSunday = day == DayOfWeek.SUNDAY;
            double dayMultiplier = isSunday ? 0.5 : 1.0;

            for (Subject subject : subjects) {
                int subjectMinutes = (int) (allocatedMinutesMap.get(subject.getId()) * dayMultiplier);
                if (subjectMinutes <= 0) continue;

                long daysToExam = 30; 
                double avg = subjectAverages.getOrDefault(subject.getId(), 50.0);

                String prompt = AiPromptBuilder.buildTopicSuggestionPrompt(subject.getSubjectName(), avg, subjectMinutes, (int) daysToExam);
                String topic = groqService.generateTopicSuggestion(subject.getSubjectName(), avg, subjectMinutes, (int) daysToExam);

                TimetableSlot slot = TimetableSlot.builder()
                        .timetable(timetable)
                        .subject(subject)
                        .dayOfWeek(day)
                        .startTime(currentTime)
                        .endTime(currentTime.plusMinutes(subjectMinutes))
                        .suggestedTopic(topic)
                        .isCompleted(false)
                        .build();

                slotsToSave.add(slot);
                
                currentTime = currentTime.plusMinutes(subjectMinutes + 10);
            }
        }

        timetableSlotRepository.saveAll(slotsToSave);
        return getTimetable(studentId);
    }

    @Transactional(readOnly = true)
    public TimetableResponse getTimetable(UUID studentId) {
        Timetable timetable = timetableRepository.findByStudentIdAndIsActiveTrue(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("No active timetable found"));

        List<TimetableSlot> slots = timetableSlotRepository.findAllByTimetableIdOrderByDayOfWeekAscStartTimeAsc(timetable.getId());
        List<SlotResponse> slotResponses = slots.stream().map(this::toSlotResponse).collect(Collectors.toList());

        return TimetableResponse.builder()
                .id(timetable.getId())
                .isAiGenerated(timetable.getIsAiGenerated())
                .isActive(timetable.getIsActive())
                .slots(slotResponses)
                .createdAt(timetable.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<TimetableResponse> getAllTimetables(UUID studentId) {
        return timetableRepository.findAllByStudentId(studentId).stream().map(t -> {
            List<TimetableSlot> slots = timetableSlotRepository.findAllByTimetableIdOrderByDayOfWeekAscStartTimeAsc(t.getId());
            return TimetableResponse.builder()
                    .id(t.getId())
                    .isAiGenerated(t.getIsAiGenerated())
                    .isActive(t.getIsActive())
                    .slots(slots.stream().map(this::toSlotResponse).collect(Collectors.toList()))
                    .createdAt(t.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public SlotResponse updateSlot(UUID studentId, UUID slotId, SlotRequest request) {
        TimetableSlot slot = timetableSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

        if (!slot.getTimetable().getStudent().getId().equals(studentId)) {
            throw new IllegalArgumentException("Slot does not belong to student");
        }

        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
            slot.setSubject(subject);
        }
        
        if (request.getDayOfWeek() != null) slot.setDayOfWeek(request.getDayOfWeek());
        if (request.getStartTime() != null) slot.setStartTime(request.getStartTime());
        if (request.getEndTime() != null) slot.setEndTime(request.getEndTime());
        if (request.getSuggestedTopic() != null) slot.setSuggestedTopic(request.getSuggestedTopic());

        slot = timetableSlotRepository.save(slot);
        return toSlotResponse(slot);
    }

    @Transactional
    public SlotResponse markSlotComplete(UUID studentId, UUID slotId) {
        TimetableSlot slot = timetableSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

        if (!slot.getTimetable().getStudent().getId().equals(studentId)) {
            throw new IllegalArgumentException("Slot does not belong to student");
        }

        slot.setIsCompleted(!slot.getIsCompleted()); 
        slot = timetableSlotRepository.save(slot);
        return toSlotResponse(slot);
    }

    @Transactional
    public void deleteTimetable(UUID studentId, UUID timetableId) {
        Timetable timetable = timetableRepository.findById(timetableId)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable not found"));

        if (!timetable.getStudent().getId().equals(studentId)) {
            throw new IllegalArgumentException("Timetable does not belong to student");
        }

        timetableRepository.delete(timetable);
    }

    @Transactional
    public TimetableResponse customCreateTimetable(UUID studentId, TimetableRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        List<Timetable> existing = timetableRepository.findAllByStudentId(studentId);
        for (Timetable t : existing) {
            t.setIsActive(false);
            timetableRepository.save(t);
        }

        Timetable timetable = Timetable.builder()
                .student(student)
                .isAiGenerated(false)
                .isActive(true)
                .build();
        timetable = timetableRepository.save(timetable);

        return getTimetable(studentId);
    }

    private SlotResponse toSlotResponse(TimetableSlot slot) {
        return SlotResponse.builder()
                .id(slot.getId())
                .subjectId(slot.getSubject() != null ? slot.getSubject().getId() : null)
                .subjectName(slot.getSubject() != null ? slot.getSubject().getSubjectName() : null)
                .dayOfWeek(slot.getDayOfWeek())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .suggestedTopic(slot.getSuggestedTopic())
                .isCompleted(slot.getIsCompleted())
                .build();
    }
}
