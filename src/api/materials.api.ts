import { apiClient } from './client';
import { StudyMaterial } from '../types/api.types';

export const materialsApi = {
  getUploadUrl: async (filename: string, type: string): Promise<{ uploadUrl: string, filePath: string, publicUrl: string }> => {
    const response = await apiClient.get<any>('/api/materials/upload-url', {
      params: { fileName: filename, fileType: type }
    });
    return response.data.data;
  },

  saveMaterial: async (data: { title: string, subjectId: string, fileUrl: string, fileType: string, fileName: string, fileSizeBytes: number }): Promise<StudyMaterial> => {
    let materialType = 'PDF';
    if (data.fileType === 'pdf') materialType = 'PDF';
    else if (data.fileType === 'image') materialType = 'IMAGE';
    else if (data.fileType === 'doc' || data.fileType === 'docx') materialType = 'DOC';
    else materialType = 'NOTES';

    const response = await apiClient.post<any>('/api/materials/', {
      subjectId: data.subjectId,
      title: data.title,
      fileName: data.fileName,
      materialType: materialType,
      textPreview: "Uploaded study material: " + data.title
    }, {
      params: {
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        fileSizeBytes: data.fileSizeBytes
      }
    });
    const material = response.data.data;
    return {
      id: material.id,
      title: material.title,
      fileUrl: material.fileUrl,
      fileType: material.fileType as any,
      subjectId: material.subject?.id || '',
      uploadedAt: material.uploadedAt || new Date().toISOString()
    };
  }
};

