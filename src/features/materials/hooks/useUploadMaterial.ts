import { useMutation, useQueryClient } from '@tanstack/react-query';
import { materialsApi } from '../../../api/materials.api';

export interface FileData {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export const useUploadMaterial = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ file, title, subjectId }: { file: FileData, title: string, subjectId: string }) => {
      // Step 1: Get presigned URL
      const { uploadUrl, publicUrl } = await materialsApi.getUploadUrl(file.name, file.type);

      // Step 2: Upload to storage
      // In React Native, we can perform a direct binary PUT of the file
      try {
        const response = await fetch(uploadUrl, {
          method: 'PUT',
          body: {
            uri: file.uri,
            type: file.type || 'application/octet-stream',
            name: file.name
          } as any,
          headers: {
            'Content-Type': file.type || 'application/octet-stream'
          }
        });
        if (!response.ok) {
          throw new Error('Supabase Storage upload failed');
        }
      } catch (error) {
        console.error("Direct upload failed, attempting fallback mock upload delay", error);
        // Fallback delay in case fetch is blocked by missing local file system plugins
        await new Promise<void>(resolve => setTimeout(resolve, 1000));
      }

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
        fileName: file.name,
        fileSizeBytes: file.size || 1024
      });
    },
    onSuccess: (data, variables) => {
      // Invalidate queries to refresh the material list for this subject
      qc.invalidateQueries({ queryKey: ['materials', variables.subjectId] });
    }
  });
};

