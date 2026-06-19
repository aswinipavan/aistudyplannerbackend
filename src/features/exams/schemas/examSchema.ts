import { z } from 'zod';

export const examSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  examDate: z.date({
    message: "Exam date is required",
  }).refine((date) => date >= new Date(new Date().setHours(0,0,0,0)), {
    message: "Exam date cannot be in the past",
  }),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  notes: z.string().max(500, 'Notes are too long').optional(),
});

export type ExamFormData = z.infer<typeof examSchema>;
