import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function EmailScreen() {
  const router = useRouter();

  const sendEmail = () => {
    // This will later trigger CSV creation and MailComposer
    Alert.alert('CSV emailed to recipient!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email Attendance</Text>

      <Text style={styles.bodyText}>This screen will generate a CSV and send it to the saved email address.</Text>

      <View style={{ marginVertical: 16 }}>
        <Button title="Send Email" onPress={sendEmail} />
      </View>

      <Button
        title="Go to Settings"
        onPress={() => router.push('/settings')}
        color="#666"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
});
