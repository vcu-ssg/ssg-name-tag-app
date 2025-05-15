import { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Alert,
  Button,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

import {
  writeAsStringAsync,
  getInfoAsync,
  documentDirectory,
  EncodingType,
} from 'expo-file-system';
import {
  composeAsync,
  isAvailableAsync as isMailAvailable,
} from 'expo-mail-composer';

import {
  shareAsync,
  isAvailableAsync as isSharingAvailable,
} from 'expo-sharing';


import { useSettings } from '@/contexts/settings-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';


export default function MailScreen() {
  const { email, scannedNames } = useSettings();

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
    setSubject(`New event: ${formattedDate}`);
    setBody(scannedNames.join('\n'));
  }, [scannedNames]);

  const handleSend = async () => {
    if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
      Alert.alert('Unsupported Platform', 'Sending is only supported on iOS and Android.');
      return;
    }

    try {

      // Build CSV content with names in column B
      const csvRows = [
        [`"${subject}"`, ''],                 // A1, B1
        ...scannedNames.map(name => ['', `"${name}"`]) // B2, B3, ...
      ].map(row => row.join(','));

      const csvContent = csvRows.join('\n');

      // Save file to a shareable directory
      const fileUri = documentDirectory + 'attendees.csv';
      await writeAsStringAsync(fileUri, csvContent, {
        encoding: EncodingType.UTF8,
      });

      const fileInfo = await getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        Alert.alert('Error', 'CSV file could not be written.');
        return;
      }

      // Construct body text with TO and SUBJECT included
      const formattedBody = `To: ${email}\nSubject: ${subject}\n\nAttendees:\n${scannedNames.join('\n')}`;

      if (Platform.OS === 'ios') {
        const mailAvailable = await isMailAvailable();
        if (!mailAvailable) {
          Alert.alert('Mail Unavailable', 'Mail services are not available on this device.');
          return;
        }

        await composeAsync({
          recipients: [email],
          subject,
          body: formattedBody,
          attachments: [fileUri],
        });

      } else if (Platform.OS === 'android') {
        const sharingAvailable = await isSharingAvailable();
        if (!sharingAvailable) {
          Alert.alert('Sharing Unavailable', 'Cannot share on this device.');
          return;
        }

        await shareAsync(fileUri, {
          dialogTitle: 'Share attendee list',
          mimeType: 'text/csv',
          // Optionally include formattedBody in message (if supported)
          UTI: 'public.comma-separated-values-text', // safe to include
          message: formattedBody,
        });
      }

    } catch (error) {
      console.error('handleSend error:', error);
      Alert.alert('Unexpected Error', 'Failed to send or share email.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80} // adjust if needed
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerIcon}>
          <IconSymbol size={200} name="mail" color="#808080" />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>To:</Text>
          <Text style={styles.readonly}>{email}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Subject:</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Body:</Text>
          <TextInput
            style={styles.textarea}
            value={body}
            onChangeText={setBody}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.sendButton}>
          <Button title="Send" onPress={handleSend} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerIcon: {
    alignItems: 'center',
    marginBottom: 20,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  readonly: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
  },
  textarea: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    minHeight: 150,
  },
  sendButton: {
    marginTop: 20,
    alignItems: 'center',
  },
});
