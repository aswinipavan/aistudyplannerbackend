import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { pick, types, errorCodes, isErrorWithCode } from '@react-native-documents/picker';
import { useRoute } from '@react-navigation/native';
import { Theme } from '../../theme';
import { useUploadMaterial } from './hooks/useUploadMaterial';

interface SelectedFileType {
  uri: string;
  name: string | null;
  type: string | null;
  size: number | null;
}

export const MaterialsScreen = () => {
  // In a real app, subjectId comes from route params
  // const route = useRoute<any>();
  // const { subjectId } = route.params;
  const subjectId = 'temp-subject-id';
  
  const [selectedFile, setSelectedFile] = useState<SelectedFileType | null>(null);
  const [title, setTitle] = useState('');
  
  const uploadMutation = useUploadMaterial();

  const handlePickDocument = async () => {
    try {
      const [res] = await pick({
        type: [types.pdf, types.images, types.video],
      });
      setSelectedFile(res);
      setTitle(res.name || 'New Material');
    } catch (err) {
      if (!(isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED)) {
        console.error(err);
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !selectedFile.name || !selectedFile.type || !selectedFile.uri) return;
    
    uploadMutation.mutate({
      file: {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.type
      },
      title: title,
      subjectId: subjectId
    }, {
      onSuccess: () => {
        setSelectedFile(null);
        setTitle('');
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Study Materials</Text>
      
      <View style={styles.uploadCard}>
        <TouchableOpacity style={styles.pickButton} onPress={handlePickDocument}>
          <Text style={styles.pickButtonText}>
            {selectedFile ? 'Change File' : 'Select File'}
          </Text>
        </TouchableOpacity>
        
        {selectedFile && (
          <View style={styles.selectedFileContainer}>
            <Text style={styles.fileName}>{selectedFile.name}</Text>
            
            <TouchableOpacity 
              style={styles.uploadButton} 
              onPress={handleUpload}
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <ActivityIndicator color={Theme.light.colors.surface} />
              ) : (
                <Text style={styles.uploadButtonText}>Upload Material</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {uploadMutation.isSuccess && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>File uploaded successfully!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.light.colors.background,
    padding: Theme.light.spacing.lg,
  },
  header: {
    ...Theme.light.typography.h1,
    color: Theme.light.colors.text,
    marginBottom: Theme.light.spacing.md,
  },
  uploadCard: {
    backgroundColor: Theme.light.colors.surface,
    padding: Theme.light.spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Theme.light.colors.border,
  },
  pickButton: {
    backgroundColor: Theme.light.colors.background,
    borderWidth: 2,
    borderColor: Theme.light.colors.primary,
    borderStyle: 'dashed',
    padding: Theme.light.spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Theme.light.spacing.md,
  },
  pickButtonText: {
    ...Theme.light.typography.h3,
    color: Theme.light.colors.primary,
  },
  selectedFileContainer: {
    marginTop: Theme.light.spacing.sm,
  },
  fileName: {
    ...Theme.light.typography.body,
    color: Theme.light.colors.textSecondary,
    marginBottom: Theme.light.spacing.md,
  },
  uploadButton: {
    backgroundColor: Theme.light.colors.primary,
    padding: Theme.light.spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    ...Theme.light.typography.h3,
    color: Theme.light.colors.surface,
  },
  successMessage: {
    marginTop: Theme.light.spacing.md,
    padding: Theme.light.spacing.md,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    alignItems: 'center',
  },
  successText: {
    ...Theme.light.typography.body,
    color: '#2E7D32',
    fontWeight: 'bold',
  }
});
