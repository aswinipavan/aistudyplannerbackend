import { z } from 'zod';

export const subjectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional(),
  targetHours: z.number().min(1).max(20).optional(),
});

export type SubjectFormData = z.infer<typeof subjectSchema>;
