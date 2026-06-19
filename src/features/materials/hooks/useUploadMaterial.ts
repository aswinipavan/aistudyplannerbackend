import { useMutation, useQueryClient } from '@tanstack/react-query';
import { materialsApi } from '../../../api/materials.api';

export interface FileData {
  uri: string;
  name: string;
  type: string;
}

export const useUploadMaterial = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ file, title, subjectId }: { file: FileData, title: string, subjectId: string }) => {
      // Step 1: Get presigned URL
      const { uploadUrl, publicUrl } = await materialsApi.getUploadUrl(file.name, file.type);

      // Step 2: Upload to storage
      // In a real app, this would be fetch(uploadUrl, { method: 'PUT', body: file })
      // We simulate the upload time here for local testing
      await new Promise<void>(resolve => setTimeout(resolve, 1500));

      // Infer file type
      let fileType = 'doc';
      if (file.type.includes('pdf')) fileType = 'pdf';
      else if (file.type.includes('image')) fileType = 'image';
      else if (file.type.includes('video')) fileType = 'video';

      // Step 3: Save metadata
      return materialsApi.saveMaterial({
        title,
        subjectId,
        fileUrl: publicUrl,
        fileType,
      });
    },
    onSuccess: (data, variables) => {
      // Invalidate queries to refresh the material list for this subject
      qc.invalidateQueries({ queryKey: ['materials', variables.subjectId] });
    }
  });
};
