import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useTheme } from '../../theme/useTheme';

export const SkeletonCard = () => {
  const { theme, isDark } = useTheme();
  
  return (
    <SkeletonPlaceholder 
      backgroundColor={isDark ? '#334155' : '#E2E8F0'} 
      highlightColor={isDark ? '#1E293B' : '#F8FAFC'}
      borderRadius={12}
    >
      <SkeletonPlaceholder.Item width="100%" height={74} marginBottom={16} />
    </SkeletonPlaceholder>
  );
};
