import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function ScanScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Name Tags</Text>

      {/* Placeholder button to simulate scanning */}
      <Button
        title="Simulate Scan and Go to Email Screen"
        onPress={() => router.push('/email')}
      />

      {/* Optional: Navigate to settings directly */}
      <View style={{ marginTop: 20 }}>
        <Button
          title="Settings"
          onPress={() => router.push('/settings')}
          color="#666"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
});
