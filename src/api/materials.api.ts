import { apiClient } from './client';
import { StudyMaterial } from '../types/api.types';

export const materialsApi = {
  getUploadUrl: async (filename: string, type: string) => {
    // Mocking the presigned URL flow for local UI testing
    return new Promise<{ uploadUrl: string, publicUrl: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          uploadUrl: `https://mock-storage.com/upload/${filename}`,
          publicUrl: `https://mock-storage.com/public/${filename}`
        });
      }, 500);
    });
  },

  saveMaterial: async (data: { title: string, subjectId: string, fileUrl: string, fileType: string }) => {
    return new Promise<StudyMaterial>((resolve) => {
      setTimeout(() => {
        resolve({
          id: `mat-${Date.now()}`,
          title: data.title,
          fileUrl: data.fileUrl,
          fileType: data.fileType as any,
          subjectId: data.subjectId,
          uploadedAt: new Date().toISOString()
        });
      }, 500);
    });
  }
};
