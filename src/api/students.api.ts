import { apiClient } from './client';

export interface StudentProfileData {
  name: string;
  grade: string;
  examBoard: string;
  photoUrl?: string;
}

export const studentsApi = {
  updateProfile: async (data: StudentProfileData) => {
    const numericGrade = parseInt(data.grade.replace(/\D/g, ''), 10) || 1;

    const body: Record<string, any> = {
      fullName: data.name,
      collegeName: data.examBoard,
      semester: numericGrade,
      department: 'General',
      availableHoursPerDay: 4.0,
    };

    if (data.photoUrl) {
      body.profilePictureUrl = data.photoUrl;
    }

    const response = await apiClient.put<any>('/api/students/me', body);
    return response.data.data;
  },

  /**
   * Uploads a local image URI to the backend via multipart/form-data.
   * Backend endpoint: POST /api/students/me/profile-picture
   *
   * Then saves the public download URL to the backend profile via updateProfile().
   * Returns the uploaded image URL.
   */
  uploadProfilePhoto: async (localUri: string): Promise<string> => {
    const filename = localUri.substring(localUri.lastIndexOf('/') + 1);
    const extension = filename.split('.').pop() || 'jpg';
    const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';

    const formData = new FormData();
    formData.append('photo', {
      uri: localUri,
      name: filename,
      type: mimeType,
    } as any);

    const response = await apiClient.post<any>('/api/students/me/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data?.profilePictureUrl || response.data.data?.url || '';
  },
};
