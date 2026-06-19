import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const MaterialsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>MaterialsScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 },
});
