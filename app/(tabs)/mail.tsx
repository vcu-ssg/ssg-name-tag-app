import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';

import debounce from 'lodash.debounce';
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

import { useRouter } from 'expo-router';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useSettings } from '@/contexts/settings-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';

export default function MailScreen() {
  const router = useRouter();
  const { email, scannedNames, setScannedNames } = useSettings();

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

  const debouncedSetScannedNames = useCallback(
    debounce((names: string[]) => setScannedNames(names), 300),
    []
  );

  const handleBodyChange = (text: string) => {
    setBody(text);
    const updatedNames = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    debouncedSetScannedNames(updatedNames);
  };

  const handleSend = async () => {
    if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
      Alert.alert('Unsupported Platform', 'Sending is only supported on iOS and Android.');
      return;
    }

    try {
      const csvRows = [
        [`"${subject}"`, ''],
        ...scannedNames.map((name) => ['', `"${name}"`]),
      ].map((row) => row.join(','));

      const csvContent = csvRows.join('\n');
      const fileUri = documentDirectory + 'attendees.csv';

      await writeAsStringAsync(fileUri, csvContent, {
        encoding: EncodingType.UTF8,
      });

      const fileInfo = await getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        Alert.alert('Error', 'CSV file could not be written.');
        return;
      }

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
      } else {
        const sharingAvailable = await isSharingAvailable();
        if (!sharingAvailable) {
          Alert.alert('Sharing Unavailable', 'Cannot share on this device.');
          return;
        }

        await shareAsync(fileUri, {
          dialogTitle: 'Share attendee list',
          mimeType: 'text/csv',
          UTI: 'public.comma-separated-values-text',
          message: formattedBody,
        });
      }
    } catch (error) {
      console.error('handleSend error:', error);
      Alert.alert('Unexpected Error', 'Failed to send or share email.');
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Clear Attendee List?',
      'This will erase all scanned names and return to the Scan tab.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setScannedNames([]);
            router.push('/camera');
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#F7C58C', dark: '#4A3719' }}
        headerImage={
          <IconSymbol
            size={310}
            color="#808080"
            name="mail"
            style={styles.headerImage}
          />
        }
        autoScrollToBottom
      >
        <ThemedText style={styles.countText}>
          {`Name tags scanned: ${scannedNames.length}`}
        </ThemedText>

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
            onChangeText={handleBodyChange}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.buttonSend} onPress={handleSend}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonClear} onPress={handleClear}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
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
  countText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: -30,
    marginBottom: 0,
  },
  textarea: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    minHeight: 150,
  },
  buttonGroup: {
    marginTop: 20,
    alignItems: 'center',
    gap: 12,
  },
  buttonSend: {
    backgroundColor: '#28a745', // green
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    minWidth: 160,
    alignItems: 'center',
  },
  buttonClear: {
    backgroundColor: '#ff6b6b', // light red
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    minWidth: 160,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
